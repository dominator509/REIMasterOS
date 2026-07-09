import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { createTestAuthContext } from "./auth-context.interface.js";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // Placeholder: in production, validate JWT/session token
    // For now, inject a test auth context
    const request = _context.switchToHttp().getRequest();
    request.authContext = createTestAuthContext();
    return true;
  }
}
