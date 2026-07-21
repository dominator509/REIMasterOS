import Link from "next/link";
import type { ReactNode } from "react";

export const NAVIGATION_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/contacts", label: "Owners & contacts" },
  { href: "/lead-lists", label: "Lead lists" },
  { href: "/tasks", label: "Tasks & follow-ups" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/activity", label: "Activity timeline" },
  { href: "/compliance", label: "Compliance & approvals" },
  { href: "/imports", label: "Import & export" },
  { href: "/ai", label: "AI assistant" },
  { href: "/cost-center", label: "Cost Optimization Center" },
  { href: "/providers", label: "Provider settings" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="sidebar" aria-label="Application sidebar">
        <div className="product-mark" aria-label="Acquisitions OS home">
          <span aria-hidden="true">AO</span>
          <strong>Acquisitions OS</strong>
        </div>
        <nav aria-label="Primary navigation">
          <ul className="navigation-list">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <dl className="workspace-indicator" aria-label="Current workspace">
          <div>
            <dt>Workspace</dt>
            <dd>Local workspace</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>Investor / acquisitions</dd>
          </div>
        </dl>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <p>Local-first operations</p>
          <span className="status-badge">Providers optional</span>
        </header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
