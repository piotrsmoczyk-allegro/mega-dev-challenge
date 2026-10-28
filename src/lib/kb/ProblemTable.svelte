<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { problemRows } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';

  // `filed`: problem → the ticket filed for it (URL) and its state, in words. A problem with no entry
  // has no ticket yet.
  let { ticket, filed = {} }: { ticket: number; filed?: Record<string, { url: string; state: string }> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const rows = $derived(problemRows(merged, tenantOf, notes.oneDayMove));
  const tags = (g: { taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
  const label = (url: string) => `issue #${url.split('/').pop()}`;
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{rows.length}</strong>
  {rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tagged as</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each rows as g (g.problem)}
      <tr class:unfiled={!filed[g.problem]}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td class="tags">{tags(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if filed[g.problem]}
            <a href={filed[g.problem].url}>{label(filed[g.problem].url)}</a>
            <span class="state">{filed[g.problem].state}</span>
          {:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each rows as g (g.problem)}
  {#if g.filedUnder.length}
    <p class="note">
      {g.reports.length} <code>{g.problem}</code> reports are filed under <code>{g.filedUnder.join(', ')}</code> by tenant,
      and counted there too, as the desk counts.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .state { display: block; color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .unfiled td { background: var(--warn-bg); }
  .unfiled td:last-child { color: var(--warn); font-weight: 600; }
</style>
