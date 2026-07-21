import type { ReactNode } from "react";
import type { ResourceState } from "../lib/api-client";

export function ResourceStatePanel<T>({
  state,
  empty,
  isEmpty,
  children,
}: {
  state: ResourceState<T>;
  empty: ReactNode;
  isEmpty(data: T): boolean;
  children(data: T): ReactNode;
}) {
  if (state.status === "loading") {
    return (
      <div className="state-panel" role="status" aria-live="polite">
        Loading workspace data…
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="state-panel state-panel--error" role="alert">
        <strong>{state.code.replaceAll("_", " ")}</strong>
        <span>{state.message}</span>
        <span>Retry after checking the local API and your signed-in workspace.</span>
      </div>
    );
  }
  if (isEmpty(state.data)) {
    return (
      <div className="state-panel" role="status">
        {empty}
      </div>
    );
  }
  return children(state.data);
}
