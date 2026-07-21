import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DashboardPage from "../src/app/page";
import RootLayout from "../src/app/layout";
import { NAVIGATION_ITEMS } from "../src/components/app-shell";

describe("dashboard shell acceptance", () => {
  it("renders accessible landmarks, workspace context, and investor-first navigation", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <DashboardPage />
      </RootLayout>,
    );

    expect(html).toContain('href="#main-content"');
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html).toContain('<main id="main-content"');
    expect(html).toContain("Investor / acquisitions");
    expect(html).toContain("Providers optional");
    expect(html).not.toMatch(/PropStream|Cobras/);
  });

  it("links every required destination to an implemented route", () => {
    const appDirectory = fileURLToPath(new URL("../src/app/", import.meta.url));

    for (const item of NAVIGATION_ITEMS) {
      const relativePage = item.href === "/" ? "page.tsx" : `${item.href.slice(1)}/page.tsx`;
      expect(existsSync(`${appDirectory}${relativePage}`), `${item.label} route`).toBe(true);
    }
  });
});
