import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.js";

describe("API HTTP boundary", () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(0);
    baseUrl = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves liveness through the real Nest HTTP adapter", async () => {
    const response = await fetch(`${baseUrl}/health/live`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { data?: { status?: string } };
    expect(body.data?.status).toBe("ok");
  });

  it("denies a protected resource without a session", async () => {
    const response = await fetch(`${baseUrl}/properties?page=1&limit=20`);
    expect(response.status).toBe(401);
    const body = (await response.json()) as { error?: { code?: string } };
    expect(body.error?.code).toBe("UNAUTHENTICATED");
  });
});
