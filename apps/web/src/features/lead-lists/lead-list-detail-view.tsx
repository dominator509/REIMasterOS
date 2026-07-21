import type { ApiResponse, LeadListRecordResponse } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export function LeadListDetailView({
  state,
}: {
  state: ResourceState<ApiResponse<LeadListRecordResponse>>;
}) {
  return (
    <section aria-labelledby="lead-list-detail-title">
      <p className="eyebrow">Lead list record</p>
      <ResourceStatePanel state={state} isEmpty={() => false} empty="Lead list not found.">
        {(result) => (
          <>
            <h1 id="lead-list-detail-title">{result.data.name}</h1>
            <p>{result.data.description || "No description provided."}</p>
            <dl className="detail-grid">
              <div>
                <dt>Stacking stage</dt>
                <dd>{result.data.stage.replaceAll("_", " ")}</dd>
              </div>
              <div>
                <dt>Sources</dt>
                <dd>{result.data.sources.length}</dd>
              </div>
              <div>
                <dt>Deduplication</dt>
                <dd>{result.data.stage === "ready" ? "Scrub complete" : "Pending scrub stage"}</dd>
              </div>
            </dl>
          </>
        )}
      </ResourceStatePanel>
    </section>
  );
}
