import { Injectable } from "@nestjs/common";
import type { JobQueue, JobRequest, QueuedJob } from "./job-queue.interface.js";

@Injectable()
export class InMemoryJobQueue implements JobQueue {
  private readonly jobs = new Map<string, QueuedJob>();

  async enqueue(request: JobRequest): Promise<QueuedJob> {
    const key = `${request.tenantId}:${request.idempotencyKey}`;
    const existing = this.jobs.get(key);
    if (existing) return existing;
    const job: QueuedJob = { id: crypto.randomUUID(), status: "queued", ...request };
    this.jobs.set(key, job);
    return job;
  }

  listForTenant(tenantId: string): readonly QueuedJob[] {
    return [...this.jobs.values()].filter((job) => job.tenantId === tenantId);
  }
}
