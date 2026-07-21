import { ApiResponseEnvelopeSchema, LeadListRecordResponseSchema } from "@rei-os/contracts";
import { LeadListDetailView } from "../../../features/lead-lists/lead-list-detail-view";
import { loadApiResource } from "../../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function LeadListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = await loadApiResource(
    `/lead-lists/${encodeURIComponent(id)}`,
    ApiResponseEnvelopeSchema(LeadListRecordResponseSchema),
  );
  return <LeadListDetailView state={state} />;
}
