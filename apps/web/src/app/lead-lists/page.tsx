import { LeadListCollectionResponseSchema } from "@rei-os/contracts";
import { LeadListsView } from "../../features/lead-lists/lead-lists-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function LeadListsPage() {
  const state = await loadApiResource(
    "/lead-lists?page=1&limit=20",
    LeadListCollectionResponseSchema,
  );
  return <LeadListsView state={state} />;
}
