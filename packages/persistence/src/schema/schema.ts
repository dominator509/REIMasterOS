/** Canonical table names — single source of truth. */
export const TABLES = {
  tenants: "tenants",
  users: "users",
  properties: "properties",
  owners: "owners",
  contacts: "contacts",
  contactPoints: "contact_points",
  leadLists: "lead_lists",
  leads: "leads",
  tasks: "tasks",
  activityEvents: "activity_events",
  complianceVerdicts: "compliance_verdicts",
  offers: "offers",
  providerCredentials: "provider_credentials",
  objectArtifacts: "object_artifacts",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
