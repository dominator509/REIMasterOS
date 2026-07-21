import { Global, Module } from "@nestjs/common";
import { loadAuthConfig } from "@rei-os/config";
import { AUTH_CLOCK, AUTH_CONFIG, AuthSessionService } from "./session/auth-session.service.js";
import { SessionMiddleware } from "./session/session.middleware.js";
import {
  BuiltInAuthService,
  DenyAllIdentityStore,
  IDENTITY_STORE,
} from "./built-in-auth.service.js";
import {
  DenyAllStepUpVerifier,
  STEP_UP_VERIFIER,
  StepUpService,
} from "./step-up/step-up.service.js";

@Global()
@Module({
  providers: [
    { provide: AUTH_CONFIG, useFactory: () => loadAuthConfig() },
    { provide: AUTH_CLOCK, useValue: Date.now },
    { provide: IDENTITY_STORE, useClass: DenyAllIdentityStore },
    AuthSessionService,
    SessionMiddleware,
    BuiltInAuthService,
    { provide: STEP_UP_VERIFIER, useClass: DenyAllStepUpVerifier },
    StepUpService,
  ],
  exports: [AUTH_CONFIG, AuthSessionService, SessionMiddleware, BuiltInAuthService, StepUpService],
})
export class AuthModule {}
