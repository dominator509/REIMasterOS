/** A person in the CRM. */
export interface Contact {
  readonly id: string;
  readonly tenantId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly contactType: ContactType;
  readonly tags: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type ContactType = "owner" | "agent" | "buyer" | "vendor" | "team_member" | "other";

export function createContact(params: {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  contactType?: ContactType;
}): Contact {
  return {
    id: params.id,
    tenantId: params.tenantId,
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phone: params.phone,
    contactType: params.contactType ?? "other",
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
