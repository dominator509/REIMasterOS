import { ProviderHealthListResponseSchema } from "@rei-os/contracts";
import { CostCenterView } from "../../features/cost-center/cost-center-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function ProvidersPage() {
  const state = await loadApiResource("/providers/health", ProviderHealthListResponseSchema);
  return <CostCenterView state={state} />;
}
