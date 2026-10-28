// The problems in a merged ticket, counted the way the desk counts (CauseTable.svelte): a report
// counts under the cause it is filed under. Reports the desk read as a one-day move
// (desk-notes.json) stay counted there, and also make up a problem of their own.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day move';

export type ProblemRow = {
  problem: Problem;
  reports: Report[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // Causes these reports are filed, and counted, under. Empty for a cause's own row.
  filedUnder: Problem[];
};

function row(problem: Problem, rs: Report[], filedUnder: Problem[] = []): ProblemRow {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
    tenants: new Set(rs.map((r) => r.tenant)).size,
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    filedUnder,
  };
}

export function problemRows(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemRow[] {
  const groups = groupByCause(reports, tenantOf);
  const rows = groups.map((g) => row(g.cause, g.reports));
  const movedIn = groups.filter((g) => g.reports.some((r) => oneDayMove.includes(r.id)));
  const moved = movedIn.flatMap((g) => g.reports.filter((r) => oneDayMove.includes(r.id)));
  if (moved.length) rows.push(row('one-day move', moved, movedIn.map((g) => g.cause)));
  return rows;
}
