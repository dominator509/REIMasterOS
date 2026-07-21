import type { LeadListCollectionResponseSchema } from "@rei-os/contracts";
import Link from "next/link";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export type LeadListEnvelope = ReturnType<typeof LeadListCollectionResponseSchema.parse>;

export function LeadListsView({ state }: { state: ResourceState<LeadListEnvelope> }) {
  return (
    <section aria-labelledby="lead-lists-title">
      <p className="eyebrow">List operations</p>
      <h1 id="lead-lists-title">Lead lists</h1>
      <p>Review stacking, source, and deduplication readiness before outreach.</p>
      <ResourceStatePanel
        state={state}
        isEmpty={(result) => result.data.items.length === 0}
        empty="No lead lists are available. Start with a validated CSV import."
      >
        {(result) => (
          <ul className="record-grid" aria-label="Lead lists">
            {result.data.items.map((list) => (
              <li key={list.id}>
                <Link href={`/lead-lists/${list.id}`}>{list.name}</Link>
                <span className="status-badge">{list.stage.replaceAll("_", " ")}</span>
                <p>{list.description || "No description provided."}</p>
                <small>
                  {list.sources.length} source{list.sources.length === 1 ? "" : "s"} · Deduplication
                  status follows the import scrub stage.
                </small>
              </li>
            ))}
          </ul>
        )}
      </ResourceStatePanel>
    </section>
  );
}
