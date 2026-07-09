import { Controller, Post, Body } from "@nestjs/common";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ComplianceCheckRequestSchema } from "@rei-os/contracts";
import { successResponse } from "../common/response.envelope.js";

@Controller("compliance")
export class ComplianceController {
  @Post("check")
  async check(@Body(new ZodValidationPipe(ComplianceCheckRequestSchema)) _body: any) {
    // Placeholder — always returns needs_approval for safety
    return successResponse({
      verdict: "needs_approval",
      reasonCodes: ["COMPLIANCE_NOT_CONFIGURED"],
      evidenceRefs: [],
      requiredApprovals: ["admin_review"],
    });
  }
}
