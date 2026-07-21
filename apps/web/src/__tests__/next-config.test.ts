import { describe, expect, it } from "vitest";
import { createNextConfig } from "../../next.config";

describe("Next build output", () => {
  it("keeps standalone output for Linux container and CI builds", () => {
    expect(createNextConfig({ platform: "linux", forceStandalone: false }).output).toBe(
      "standalone",
    );
  });

  it("avoids symlink-dependent standalone tracing on Windows by default", () => {
    expect(createNextConfig({ platform: "win32", forceStandalone: false }).output).toBeUndefined();
  });

  it("allows an explicitly symlink-capable Windows builder to force standalone output", () => {
    expect(createNextConfig({ platform: "win32", forceStandalone: true }).output).toBe(
      "standalone",
    );
  });
});
