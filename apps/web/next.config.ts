import type { NextConfig } from "next";

interface BuildEnvironment {
  readonly platform: string;
  readonly forceStandalone: boolean;
}

export function createNextConfig(environment: BuildEnvironment): NextConfig {
  return {
    reactStrictMode: true,
    ...(environment.platform !== "win32" || environment.forceStandalone
      ? { output: "standalone" as const }
      : {}),
  };
}

const nextConfig = createNextConfig({
  platform: process.platform,
  forceStandalone: process.env["REI_OS_NEXT_STANDALONE"] === "1",
});

export default nextConfig;
