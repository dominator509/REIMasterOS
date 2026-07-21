import { PropertyListResponseSchema } from "@rei-os/contracts";
import { PropertiesView } from "../../features/properties/properties-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const state = await loadApiResource("/properties?page=1&limit=20", PropertyListResponseSchema);
  return <PropertiesView state={state} />;
}
