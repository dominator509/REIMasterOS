import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "REI-OS",
  description:
    "Real Estate Investor Operating System — self-hostable, AI-native, provider-agnostic",
};

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/leads", label: "Leads" },
  { href: "/contacts", label: "Contacts" },
  { href: "/tasks", label: "Tasks" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/imports", label: "Import" },
  { href: "/ai", label: "AI Assistant" },
  { href: "/cost-center", label: "Cost Center" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              width: 240,
              background: "#1a1a2e",
              color: "#e0e0e0",
              padding: "1rem",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                color: "#fff",
              }}
            >
              REI-OS
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href} style={{ marginBottom: "0.25rem" }}>
                  <Link
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "0.5rem 0.75rem",
                      color: "#c0c0d0",
                      textDecoration: "none",
                      borderRadius: 4,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              style={{ marginTop: "auto", paddingTop: "2rem", fontSize: "0.75rem", color: "#666" }}
            >
              <div>Tenant: Default</div>
              <div>Mode: Investor</div>
              <div>v0.0.0</div>
            </div>
          </nav>

          {/* Main content */}
          <main style={{ flex: 1, padding: "2rem", background: "#f5f5f5", minHeight: "100vh" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
