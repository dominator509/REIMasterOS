import type { TaskListResponseSchema } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export type TaskListEnvelope = ReturnType<typeof TaskListResponseSchema.parse>;

export function TasksView({ state }: { state: ResourceState<TaskListEnvelope> }) {
  return (
    <section aria-labelledby="tasks-title">
      <p className="eyebrow">Follow-up queue</p>
      <h1 id="tasks-title">Tasks & follow-ups</h1>
      <form className="inline-form" aria-describedby="task-form-note">
        <label htmlFor="task-title">Task title</label>
        <input id="task-title" name="title" disabled />
        <button type="button" disabled>
          Create task
        </button>
        <p id="task-form-note">
          Task writes unlock after EP-006 configures authenticated sessions.
        </p>
      </form>
      <ResourceStatePanel
        state={state}
        isEmpty={(result) => result.data.items.length === 0}
        empty="No open follow-ups. New task controls remain disabled until authentication is configured."
      >
        {(result) => (
          <ul className="timeline" aria-label="Task queue">
            {result.data.items.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.status.replaceAll("_", " ")}</span>
                <p>{task.description || "No additional notes."}</p>
                <small>
                  Priority: {task.priority}
                  {task.dueDate ? ` · Due ${new Date(task.dueDate).toLocaleDateString()}` : ""}
                </small>
              </li>
            ))}
          </ul>
        )}
      </ResourceStatePanel>
    </section>
  );
}
