import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import type { ZodSchema, ZodIssue } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const messages = result.error.issues
        .map((i: ZodIssue) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new BadRequestException({ code: "VALIDATION_ERROR", message: messages });
    }
    return result.data;
  }
}
