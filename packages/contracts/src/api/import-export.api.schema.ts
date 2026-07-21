import { z } from "zod";

export const ImportPreviewRequestSchema = z.object({
  artifactKey: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine(
      (value) =>
        !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes(".."),
      "Artifact key must be a safe tenant-scoped relative key",
    ),
  format: z.literal("csv"),
});
export const ImportCommitRequestSchema = z.object({ previewId: z.string().uuid() });
export const AsyncJobResponseSchema = z.object({
  jobId: z.string().uuid(),
  status: z.literal("queued"),
});
export const ExportRequestSchema = z.object({
  format: z.enum(["csv", "pdf"]),
  entityType: z.enum(["properties", "contacts", "leads", "direct_mail"]),
  entityIds: z.array(z.string().uuid()).min(1).max(10_000),
});

export type ImportPreviewRequest = z.infer<typeof ImportPreviewRequestSchema>;
export type ImportCommitRequest = z.infer<typeof ImportCommitRequestSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
export type AsyncJobResponse = z.infer<typeof AsyncJobResponseSchema>;
