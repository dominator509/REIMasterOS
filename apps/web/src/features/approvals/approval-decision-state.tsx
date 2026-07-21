import type { ApprovalResponse } from "@rei-os/contracts";

export function ApprovalDecisionState({ approval }: { approval: ApprovalResponse }) {
  if (approval.status === "expired") {
    return <p role="alert">Expired. Request a new approval before retrying this action.</p>;
  }
  if (approval.status === "approved") {
    return <p role="status">Approved after MFA verification.</p>;
  }
  if (approval.status === "denied") {
    return <p role="alert">Denied. This action remains blocked.</p>;
  }
  return (
    <>
      <button type="button" disabled aria-describedby={`approval-help-${approval.id}`}>
        Review with MFA
      </button>
      <small id={`approval-help-${approval.id}`}>
        Sign in to the authenticated dashboard to complete MFA and record a decision.
      </small>
    </>
  );
}
