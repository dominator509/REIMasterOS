import type { ApprovalResponse } from "@rei-os/contracts";
import { ApprovalDecisionState } from "../approvals/approval-decision-state";

export function ApprovalCard({ approval }: { approval: ApprovalResponse }) {
  return (
    <article className="approval-card" aria-labelledby={`approval-${approval.id}`}>
      <span className="status-badge">{approval.status}</span>
      <h2 id={`approval-${approval.id}`}>{approval.action.replaceAll(".", " ")}</h2>
      <p>Requested by {approval.requestedBy}</p>
      {approval.expiresAt ? (
        <p>
          Expires{" "}
          <time dateTime={approval.expiresAt}>{new Date(approval.expiresAt).toLocaleString()}</time>
        </p>
      ) : (
        <p>No expiration was supplied.</p>
      )}
      <ApprovalDecisionState approval={approval} />
    </article>
  );
}
