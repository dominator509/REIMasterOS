import type { ActivityListResponseSchema } from "@rei-os/contracts";
import { ResourceStatePanel } from "../../components/resource-state";
import type { ResourceState } from "../../lib/api-client";

export type ActivityListEnvelope = ReturnType<typeof ActivityListResponseSchema.parse>;

export function ActivityView({ state }: { state: ResourceState<ActivityListEnvelope> }) {
  return (
    <section aria-labelledby="activity-title">
      <p className="eyebrow">Audit-friendly history</p>
      <h1 id="activity-title">Activity timeline</h1>
      <p>Operational events are announced politely and never expose hidden provider payloads.</p>
      <ResourceStatePanel
        state={state}
        isEmpty={(result) => result.data.items.length === 0}
        empty="No activity has been recorded in this workspace."
      >
        {(result) => (
          <ol className="timeline" aria-live="polite" aria-label="Universal activity timeline">
            {result.data.items.map((event) => (
              <li key={event.id}>
                <strong>{event.action.replaceAll("_", " ")}</strong>
                <span>
                  {event.targetType} · {event.targetId}
                </span>
                <time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time>
              </li>
            ))}
          </ol>
        )}
      </ResourceStatePanel>
    </section>
  );
}
