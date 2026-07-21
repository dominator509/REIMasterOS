import type { ComplianceCheckResponse } from "@rei-os/contracts";

export function ComplianceVerdictPanel({ verdict }: { verdict: ComplianceCheckResponse }) {
  const heading =
    verdict.verdict === "blocked"
      ? "Action blocked"
      : verdict.verdict === "needs_approval"
        ? "Approval required"
        : "Policy check passed";
  return (
    <section
      className={`verdict verdict--${verdict.verdict}`}
      role={verdict.verdict === "allowed" ? "status" : "alert"}
      aria-labelledby={`verdict-${verdict.verdict}`}
    >
      <p className="eyebrow">Server policy verdict</p>
      <h2 id={`verdict-${verdict.verdict}`}>{heading}</h2>
      <p>{verdict.userMessage}</p>
      {verdict.reasonCodes.length > 0 ? (
        <ul aria-label="Policy reasons">
          {verdict.reasonCodes.map((reason) => (
            <li key={reason}>{reason.replaceAll("_", " ")}</li>
          ))}
        </ul>
      ) : null}
      {verdict.requiredApprovals.length > 0 ? (
        <p>
          Required approval: <strong>{verdict.requiredApprovals.join(", ")}</strong>
        </p>
      ) : null}
    </section>
  );
}
