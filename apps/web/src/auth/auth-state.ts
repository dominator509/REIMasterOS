export type WebAuthState =
  | { status: "anonymous" }
  | { status: "authenticated"; tenantLabel: string; mode: "investor" | "brokerage" }
  | { status: "expired" };

export const anonymousAuthState: WebAuthState = { status: "anonymous" };
