import { Inject, Injectable } from "@nestjs/common";
import type { AuthContext } from "../auth-context.interface.js";

export interface StepUpChallenge {
  readonly sessionId: string;
  readonly code: string;
}

export interface StepUpVerifier {
  verify(context: AuthContext, challenge: StepUpChallenge): Promise<boolean>;
}

export const STEP_UP_VERIFIER = Symbol("STEP_UP_VERIFIER");

export class DenyAllStepUpVerifier implements StepUpVerifier {
  async verify(_context: AuthContext, _challenge: StepUpChallenge): Promise<false> {
    return false;
  }
}

/** Deterministic synthetic adapter for tests and local development only. */
export class LocalTestStepUpVerifier implements StepUpVerifier {
  constructor(
    private readonly expectedCode: string,
    private readonly environment: "development" | "test" = "test",
  ) {}

  async verify(context: AuthContext, challenge: StepUpChallenge): Promise<boolean> {
    return (
      (this.environment === "development" || this.environment === "test") &&
      challenge.sessionId === context.sessionId &&
      challenge.code.length > 0 &&
      challenge.code === this.expectedCode
    );
  }
}

@Injectable()
export class StepUpService {
  constructor(@Inject(STEP_UP_VERIFIER) private readonly verifier: StepUpVerifier) {}

  verify(context: AuthContext, challenge: StepUpChallenge): Promise<boolean> {
    return this.verifier.verify(context, challenge);
  }
}
