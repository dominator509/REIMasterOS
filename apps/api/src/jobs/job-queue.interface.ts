export interface JobRequest {
  readonly tenantId: string;
  readonly type: string;
  readonly idempotencyKey: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface QueuedJob extends JobRequest {
  readonly id: string;
  readonly status: "queued";
}

export interface JobQueue {
  enqueue(request: JobRequest): Promise<QueuedJob>;
  listForTenant(tenantId: string): readonly QueuedJob[];
}
