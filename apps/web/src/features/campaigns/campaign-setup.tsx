import type { ComplianceCheckResponse } from "@rei-os/contracts";
import { ComplianceVerdictPanel } from "../compliance/compliance-verdict";

export function CampaignSetup({ verdict }: { verdict?: ComplianceCheckResponse }) {
  return (
    <section aria-labelledby="campaign-title">
      <p className="eyebrow">Approval-gated outreach</p>
      <h1 id="campaign-title">Campaign setup</h1>
      <form className="surface-card">
        <label htmlFor="campaign-channel">Primary channel</label>
        <select id="campaign-channel" name="channel" defaultValue="email">
          <option value="email">Email</option>
          <option value="direct_mail">Direct mail</option>
          <option value="voice">Manual call tasks</option>
        </select>
        <label htmlFor="campaign-fallback">Fallback</label>
        <select id="campaign-fallback" name="fallback" defaultValue="manual_export">
          <option value="manual_export">Manual export</option>
          <option value="disabled">No fallback</option>
        </select>
        <button type="button" disabled>
          Check compliance and request approval
        </button>
        <p className="field-note">
          Launch remains disabled until the API returns an allowed verdict, an approved
          campaign.launch record, and verified MFA.
        </p>
      </form>
      {verdict ? (
        <ComplianceVerdictPanel verdict={verdict} />
      ) : (
        <div className="state-panel" role="status">
          No server compliance verdict has been requested.
        </div>
      )}
    </section>
  );
}
