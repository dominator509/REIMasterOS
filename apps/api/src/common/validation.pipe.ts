import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import type { ZodSchema, ZodIssue } from "zod";
import { errorResponse } from "./response.envelope.js";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const details = result.error.issues.map((issue: ZodIssue) => ({
        field: issue.path.join(".") || undefined,
        message: issue.message,
        code: issue.code,
      }));
      throw new BadRequestException(
        errorResponse("VALIDATION_FAILED", "The request is invalid.", details),
      );
    }
    return result.data;
  }
}
