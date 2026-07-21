import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CampaignSetup } from "../src/features/campaigns/campaign-setup";
import { ApprovalCard } from "../src/features/compliance/approval-card";
import { ApprovalDecisionState } from "../src/features/approvals/approval-decision-state";
import { ComplianceVerdictPanel } from "../src/features/compliance/compliance-verdict";
import { ImportExportView } from "../src/features/imports/import-export-view";

describe("compliance and data-movement acceptance", () => {
  it("shows CSV validation errors and both provider-optional manual export paths", () => {
    const html = renderToStaticMarkup(
      <ImportExportView
        preview={{
          status: "validation_error",
          errors: ["Row 4 has an invalid state code.", "Row 8 is missing an address."],
        }}
      />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain("Row 4 has an invalid state code");
    expect(html).toContain("Prepare email CSV");
    expect(html).toContain("Prepare direct-mail export");
    expect(html).toContain("disabled");
  });

  it.each([
    ["allowed", "Policy check passed"],
    ["blocked", "Action blocked"],
    ["needs_approval", "Approval required"],
  ] as const)("announces the %s server verdict", (verdict, heading) => {
    const html = renderToStaticMarkup(
      <ComplianceVerdictPanel
        verdict={{
          verdict,
          reasonCodes: verdict === "allowed" ? [] : ["SYNTHETIC_POLICY_REASON"],
          evidenceRefs: ["synthetic:evidence"],
          requiredApprovals: verdict === "needs_approval" ? ["campaign.launch"] : [],
          userMessage: `Synthetic ${verdict} message.`,
        }}
      />,
    );
    expect(html).toContain(heading);
    expect(html).toContain(verdict === "allowed" ? 'role="status"' : 'role="alert"');
  });

  it("keeps launch and approval decisions disabled while showing approval expiration", () => {
    const approvalHtml = renderToStaticMarkup(
      <ApprovalCard
        approval={{
          id: "00000000-0000-4000-8000-000000000501",
          tenantId: "tenant-test",
          action: "campaign.launch",
          status: "pending",
          requestedBy: "user-test",
          evidenceRefs: ["synthetic:evidence"],
          expiresAt: "2026-07-18T13:00:00.000Z",
          createdAt: "2026-07-18T12:00:00.000Z",
          updatedAt: "2026-07-18T12:00:00.000Z",
        }}
      />,
    );
    const campaignHtml = renderToStaticMarkup(<CampaignSetup />);
    expect(approvalHtml).toContain("Expires");
    expect(approvalHtml).toContain("Review with MFA");
    expect(approvalHtml).toContain("disabled");
    expect(campaignHtml).toContain("Check compliance and request approval");
    expect(campaignHtml).toContain("approved campaign.launch record");
  });

  it("renders clear approved, denied, and expired high-risk states", () => {
    const base = {
      id: "00000000-0000-4000-8000-000000000502",
      tenantId: "tenant-test",
      action: "provider.credentials_change",
      requestedBy: "user-test",
      evidenceRefs: ["synthetic:evidence"],
      expiresAt: "2026-07-18T13:00:00.000Z",
      createdAt: "2026-07-18T12:00:00.000Z",
      updatedAt: "2026-07-18T12:00:00.000Z",
    };
    expect(
      renderToStaticMarkup(<ApprovalDecisionState approval={{ ...base, status: "approved" }} />),
    ).toContain("Approved after MFA");
    expect(
      renderToStaticMarkup(<ApprovalDecisionState approval={{ ...base, status: "denied" }} />),
    ).toContain("remains blocked");
    expect(
      renderToStaticMarkup(<ApprovalDecisionState approval={{ ...base, status: "expired" }} />),
    ).toContain("Request a new approval");
  });
});
