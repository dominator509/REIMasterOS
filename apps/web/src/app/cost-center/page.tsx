export default function CostCenterPage() {
  return (
    <div>
      <h1>Cost Optimization Center</h1>
      <p>Provider costs, fallback status, and budget tracking.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <CostCard provider="Email (SMTP)" tier="budget" status="local" cost="$0/mo" />
        <CostCard provider="Direct Mail" tier="manual" status="csv export" cost="$0/mo" />
        <CostCard provider="AI (Hermes)" tier="local" status="not configured" cost="$0/mo" />
        <CostCard provider="Property Data" tier="manual" status="csv import" cost="$0/mo" />
        <CostCard provider="Voice" tier="disabled" status="not configured" cost="—" />
        <CostCard provider="SMS" tier="disabled" status="not configured" cost="—" />
      </div>
    </div>
  );
}

function CostCard({
  provider,
  tier,
  status,
  cost,
}: {
  provider: string;
  tier: string;
  status: string;
  cost: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{provider}</div>
      <div style={{ fontSize: "0.85rem", color: "#888" }}>
        <div>Tier: {tier}</div>
        <div>Status: {status}</div>
        <div
          style={{
            marginTop: "0.5rem",
            fontWeight: "bold",
            color: tier === "disabled" ? "#999" : "#2a7d2a",
          }}
        >
          {cost}
        </div>
      </div>
    </div>
  );
}
