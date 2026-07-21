import type { ApprovalListResponseSchema } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";
import { ApprovalCard } from "./approval-card";

export type ApprovalListEnvelope = ReturnType<typeof ApprovalListResponseSchema.parse>;

export function ApprovalsView({ state }: { state: ResourceState<ApprovalListEnvelope> }) {
  return (
    <ResourceStatePanel
      state={state}
      isEmpty={(result) => result.data.items.length === 0}
      empty="No approval requests are waiting in this workspace."
    >
      {(result) => (
        <div className="record-grid" aria-label="Approval requests">
          {result.data.items.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      )}
    </ResourceStatePanel>
  );
}
