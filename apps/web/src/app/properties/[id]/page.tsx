import { ApiResponseEnvelopeSchema, PropertyResponseDataSchema } from "@rei-os/contracts";
import { PropertyDetailView } from "../../../features/properties/property-detail-view";
import { loadApiResource } from "../../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = await loadApiResource(
    `/properties/${encodeURIComponent(id)}`,
    ApiResponseEnvelopeSchema(PropertyResponseDataSchema),
  );
  return <PropertyDetailView state={state} />;
}
