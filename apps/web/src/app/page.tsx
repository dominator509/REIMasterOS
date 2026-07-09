export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ margin: "0 0 0.5rem 0" }}>Dashboard</h1>
      <p style={{ color: "#666", margin: "0 0 2rem 0" }}>
        Real Estate Investor Operating System — Foundation Phase
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatCard title="Active Leads" value="—" description="No leads imported yet" />
        <StatCard title="Properties" value="—" description="No properties added yet" />
        <StatCard title="Open Tasks" value="—" description="No tasks created yet" />
        <StatCard title="Active Campaigns" value="—" description="No campaigns running" />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>{value}</div>
      <div style={{ fontSize: "0.85rem", color: "#999" }}>{description}</div>
    </div>
  );
}
