import { ApprovalListResponseSchema } from "@rei-os/contracts";
import { ApprovalsView } from "../../features/compliance/approvals-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const approvals = await loadApiResource(
    "/approvals?page=1&limit=20&status=pending",
    ApprovalListResponseSchema,
  );
  return (
    <section aria-labelledby="compliance-title">
      <p className="eyebrow">Deterministic policy</p>
      <h1 id="compliance-title">Compliance & approvals</h1>
      <p>
        Verdicts come from the API. An approval never overrides suppression, consent, opt-out, or
        quiet-hours facts.
      </p>
      <ApprovalsView state={approvals} />
    </section>
  );
}
