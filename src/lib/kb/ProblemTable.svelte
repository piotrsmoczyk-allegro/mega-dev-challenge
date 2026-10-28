<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { groupByProblem } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';

  // `filed`: problem → URL of the ticket filed for it. A problem with no entry has no ticket yet.
  let { ticket, filed = {} }: { ticket: number; filed?: Record<string, string> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
  const counted = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const tags = (g: { taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
  const label = (url: string) => `issue #${url.split('/').pop()}`;
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tagged as</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr class:unfiled={!filed[g.problem]}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td class="tags">{tags(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if filed[g.problem]}<a href={filed[g.problem]}>{label(filed[g.problem])}</a>{:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <td>all</td>
      <td>{counted}</td>
      <td colspan="4">{counted === merged.length ? 'every report counted once' : `${merged.length - counted} reports not counted`}</td>
    </tr>
  </tfoot>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  tfoot td { color: var(--muted); font-size: 0.85em; }
  .unfiled td { background: var(--warn-bg); }
  .unfiled td:last-child { color: var(--warn); font-weight: 600; }
</style>
