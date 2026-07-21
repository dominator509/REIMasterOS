import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  ApprovalCreateRequest,
  ApprovalDecisionRequest,
  ApprovalListQuery,
  ApprovalResponse,
} from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertMfa, assertPermission } from "../auth/authorization.js";
import { errorResponse, paginatedResponse, successResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";

export const APPROVAL_CLOCK = Symbol("APPROVAL_CLOCK");
const DEFAULT_APPROVAL_TTL_MS = 15 * 60 * 1000;

@Injectable()
export class ApprovalsService {
  private readonly store = new TenantMemoryStore<ApprovalResponse>();

  constructor(
    @Inject(ActivityService) private readonly activities: ActivityService,
    @Inject(APPROVAL_CLOCK) private readonly now: () => number = Date.now,
  ) {}

  private expireIfNeeded(context: AuthContext, record: ApprovalResponse): ApprovalResponse {
    if (
      record.status !== "expired" &&
      record.expiresAt &&
      Date.parse(record.expiresAt) <= this.now()
    ) {
      const expired = {
        ...record,
        status: "expired" as const,
        updatedAt: new Date(this.now()).toISOString(),
      };
      this.store.set(expired);
      this.activities.record(context, {
        action: "approval.expired",
        targetType: "approval",
        targetId: record.id,
      });
      return expired;
    }
    return record;
  }

  list(context: AuthContext, query: ApprovalListQuery) {
    assertPermission(context, PERMISSIONS.APPROVAL_READ);
    const all = this.store
      .list(context.tenantId)
      .map((record) => this.expireIfNeeded(context, record));
    const filtered = query.status ? all.filter((item) => item.status === query.status) : all;
    const offset = (query.page - 1) * query.limit;
    return paginatedResponse(
      filtered.slice(offset, offset + query.limit),
      filtered.length,
      query.page,
      query.limit,
      { tenantId: context.tenantId },
    );
  }

  getRecord(context: AuthContext, id: string): ApprovalResponse | undefined {
    const record = this.store.get(context.tenantId, id);
    return record ? this.expireIfNeeded(context, record) : undefined;
  }

  create(context: AuthContext, input: ApprovalCreateRequest) {
    assertPermission(context, PERMISSIONS.APPROVAL_READ);
    const now = new Date(this.now()).toISOString();
    const expiresAt =
      input.expiresAt ?? new Date(this.now() + DEFAULT_APPROVAL_TTL_MS).toISOString();
    if (Date.parse(expiresAt) <= this.now()) {
      throw new ConflictException(
        errorResponse("CONFLICT", "Approval expiration must be in the future."),
      );
    }
    const record: ApprovalResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      action: input.action,
      status: "pending",
      requestedBy: context.userId,
      evidenceRefs: input.evidenceRefs ?? [],
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(record);
    this.activities.record(context, {
      action: "approval.requested",
      targetType: "approval",
      targetId: record.id,
      metadata: { approvalAction: record.action },
    });
    return successResponse(record, { tenantId: context.tenantId });
  }

  decide(context: AuthContext, id: string, input: ApprovalDecisionRequest) {
    assertPermission(context, PERMISSIONS.APPROVAL_GRANT);
    assertMfa(context);
    if (!input.mfaVerified) {
      throw new Error("Approval decision contract requires MFA verification");
    }
    const stored = this.store.get(context.tenantId, id);
    const existing = stored ? this.expireIfNeeded(context, stored) : undefined;
    if (!existing) {
      throw new NotFoundException(errorResponse("NOT_FOUND", `Approval ${id} not found`));
    }
    if (existing.status !== "pending") {
      throw new ConflictException(errorResponse("CONFLICT", "Approval is no longer pending."));
    }
    const record: ApprovalResponse = {
      ...existing,
      status: input.decision,
      approvedBy: context.userId,
      updatedAt: new Date(this.now()).toISOString(),
    };
    this.store.set(record);
    this.activities.record(context, {
      action: `approval.${input.decision}`,
      targetType: "approval",
      targetId: id,
    });
    return successResponse(record, { tenantId: context.tenantId });
  }
}
