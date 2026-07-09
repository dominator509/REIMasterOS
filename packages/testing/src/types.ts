import type { Tenant, Property, Contact, Lead } from "@rei-os/domain";

export interface TestFixtures {
  tenant: Tenant;
  properties: Property[];
  contacts: Contact[];
  leads: Lead[];
}
