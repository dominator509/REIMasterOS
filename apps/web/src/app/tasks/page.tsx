import { TaskListResponseSchema } from "@rei-os/contracts";
import { TasksView } from "../../features/tasks/tasks-view";
import { loadApiResource } from "../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const state = await loadApiResource("/tasks?page=1&limit=20", TaskListResponseSchema);
  return <TasksView state={state} />;
}
