import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { HealthController } from "./health/health.controller.js";
import { PropertiesModule } from "./properties/properties.module.js";
import { LeadsModule } from "./leads/leads.module.js";
import { ContactsModule } from "./contacts/contacts.module.js";
import { ComplianceModule } from "./compliance/compliance.module.js";
import { ActivityModule } from "./activity/activity.module.js";
import { JobsModule } from "./jobs/jobs.module.js";
import { LeadListsModule } from "./lead-lists/lead-lists.module.js";
import { TasksModule } from "./tasks/tasks.module.js";
import { ApprovalsModule } from "./approvals/approvals.module.js";
import { ImportsModule } from "./imports/imports.module.js";
import { ExportsModule } from "./exports/exports.module.js";
import { ProvidersModule } from "./providers/providers.module.js";
import { AiModule } from "./ai/ai.module.js";
import { CampaignsModule } from "./campaigns/campaigns.module.js";
import { WebhooksModule } from "./webhooks/webhooks.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { SessionMiddleware } from "./auth/session/session.middleware.js";
import { CsrfMiddleware } from "./security/csrf.middleware.js";
import { RateLimitMiddleware } from "./security/rate-limit.middleware.js";
import { SecurityHeadersMiddleware } from "./security/security-headers.middleware.js";
import { SecurityModule } from "./security/security.module.js";

@Module({
  imports: [
    AuthModule,
    SecurityModule,
    ActivityModule,
    JobsModule,
    PropertiesModule,
    LeadsModule,
    ContactsModule,
    ComplianceModule,
    LeadListsModule,
    TasksModule,
    ApprovalsModule,
    ImportsModule,
    ExportsModule,
    ProvidersModule,
    AiModule,
    CampaignsModule,
    WebhooksModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityHeadersMiddleware, SessionMiddleware, RateLimitMiddleware, CsrfMiddleware)
      .forRoutes("*");
  }
}
