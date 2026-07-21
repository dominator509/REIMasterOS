import { ActivityListResponseSchema } from "@rei-os/contracts";
import { ActivityView } from "../../features/activity/activity-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const state = await loadApiResource("/activity?page=1&limit=20", ActivityListResponseSchema);
  return <ActivityView state={state} />;
}
