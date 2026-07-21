import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "../src/app/layout";
import { CampaignSetup } from "../src/features/campaigns/campaign-setup";
import { ComplianceVerdictPanel } from "../src/features/compliance/compliance-verdict";
import { ImportExportView } from "../src/features/imports/import-export-view";
import { PropertiesView } from "../src/features/properties/properties-view";

function expectControlsAreLabelled(html: string): void {
  const controlIds = [...html.matchAll(/<(?:input|select|textarea)[^>]+id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const id of controlIds) {
    expect(html, `label for ${id}`).toContain(`for="${id}"`);
  }
  const buttonText = [...html.matchAll(/<button[^>]*>(.*?)<\/button>/gs)].map((match) =>
    match[1]?.replace(/<[^>]+>/g, "").trim(),
  );
  expect(buttonText.every(Boolean)).toBe(true);
}

describe("critical-screen accessibility acceptance", () => {
  it("provides keyboard entry, semantic landmarks, and named navigation", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <ImportExportView preview={{ status: "idle" }} />
      </RootLayout>,
    );
    expect(html.indexOf('href="#main-content"')).toBeLessThan(html.indexOf("<main"));
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain('<main id="main-content" tabindex="-1"');
    expectControlsAreLabelled(html);
  });

  it("uses textual, announced policy states instead of color alone", () => {
    const blocked = renderToStaticMarkup(
      <ComplianceVerdictPanel
        verdict={{
          verdict: "blocked",
          reasonCodes: ["SYNTHETIC_SUPPRESSION"],
          evidenceRefs: [],
          requiredApprovals: [],
          userMessage: "Synthetic record is suppressed.",
        }}
      />,
    );
    expect(blocked).toContain('role="alert"');
    expect(blocked).toContain("Action blocked");
    expect(blocked).toContain("SYNTHETIC SUPPRESSION");
  });

  it("labels campaign controls and preserves a table alternative for property workflows", () => {
    const campaign = renderToStaticMarkup(<CampaignSetup />);
    const properties = renderToStaticMarkup(
      <PropertiesView
        state={{
          status: "ready",
          data: {
            data: {
              items: [
                {
                  id: "00000000-0000-4000-8000-000000000601",
                  tenantId: "00000000-0000-4000-8000-000000000001",
                  address: {
                    street: "456 Synthetic Avenue",
                    city: "Phoenix",
                    state: "AZ",
                    zip: "85001",
                  },
                  characteristics: { propertyType: "single_family" },
                  status: "active",
                  createdAt: "2026-07-18T12:00:00.000Z",
                  updatedAt: "2026-07-18T12:00:00.000Z",
                },
              ],
              total: 1,
              page: 1,
              limit: 20,
              totalPages: 1,
            },
            meta: { requestId: "request-test", tenantId: "tenant-test" },
          },
        }}
      />,
    );
    expectControlsAreLabelled(campaign);
    expectControlsAreLabelled(properties);
    expect(properties).toContain("Property results table alternative");
    expect(properties).toContain("<caption>Property search results</caption>");
  });

  it("does not place protected payload categories in rendered critical screens", () => {
    const html = renderToStaticMarkup(<CampaignSetup />);
    expect(html).not.toMatch(/hidden[_ -]?prefix|compiled[_ -]?prompt|raw dnc/i);
  });
});
