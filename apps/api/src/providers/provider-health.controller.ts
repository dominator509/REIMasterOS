import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { ProviderHealthResponse } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { assertPermission } from "../auth/authorization.js";
import { successResponse } from "../common/response.envelope.js";

@Controller("providers")
@UseGuards(AuthGuard)
export class ProviderHealthController {
  @Get("health")
  list(@Req() request: AuthenticatedRequest) {
    const context = requireAuthContext(request);
    assertPermission(context, PERMISSIONS.PROVIDER_MANAGE);
    const checkedAt = new Date().toISOString();
    const providers: ProviderHealthResponse[] = [
      {
        provider: "smtp",
        category: "email",
        status: "not_configured",
        fallback: "manual_export",
        checkedAt,
      },
      {
        provider: "manual_direct_mail",
        category: "direct_mail",
        status: "healthy",
        checkedAt,
      },
      {
        provider: "local_ai",
        category: "ai",
        status: "disabled",
        checkedAt,
      },
    ];
    return successResponse(providers, { tenantId: context.tenantId });
  }
}
