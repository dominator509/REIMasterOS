export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      style={{ textAlign: "center", padding: "2rem", color: "#888" }}
    >
      {label}
    </div>
  );
}
