# Environment

## Required Tools

Baseline tools for the default greenfield stack:

| Tool           | Version Rule                                     | Purpose                                  |
| -------------- | ------------------------------------------------ | ---------------------------------------- |
| POSIX `sh`     | Any modern POSIX shell                           | Run scripts in `scripts/`                |
| Git            | 2.40+ recommended                                | Source control and diff review           |
| Node.js        | 20 LTS or 22 LTS                                 | TypeScript/Next.js/NestJS tooling        |
| pnpm           | 9+ or 10+                                        | Package manager                          |
| Docker         | Current stable                                   | Local services and deployment profiles   |
| Docker Compose | v2+                                              | Local deployment profiles                |
| Python         | 3.11+                                            | AI gateway/service work when implemented |
| uv or Poetry   | Confirm during EP-001/AI service setup           | Python dependency management             |
| Go             | 1.22+ if Go workers are implemented              | Ingestion/high-throughput services       |
| Rust           | stable if token-compressor is implemented        | Token compression service                |
| kubectl        | Matching cluster version if deploying Kubernetes | Enterprise deployments                   |
| Helm           | 3+ if deploying Kubernetes                       | Helm charts                              |

## Package Manager

Use `pnpm` by default. Do not use npm or yarn unless an ADR approves a change.

## Environment Variables

The exact variable set must be confirmed during implementation. The table below is the intended baseline. Additions require updates to this file and relevant config validation.

| Name                                | Required                              | Environment             | Example Value                                |                  Secret | Description                                              | Validation Rule                                                                                                                                                                 |
| ----------------------------------- | ------------------------------------- | ----------------------- | -------------------------------------------- | ----------------------: | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                          | Required                              | all                     | `development`                                |                      No | Node runtime mode.                                       | One of `development`, `test`, `production`.                                                                                                                                     |
| `APP_ENV`                           | Required                              | all                     | `local`                                      |                      No | Deployment environment.                                  | One of `local`, `test`, `staging`, `production`.                                                                                                                                |
| `APP_BASE_URL`                      | Required                              | all                     | `http://localhost:3000`                      |                      No | Public web base URL.                                     | Valid URL.                                                                                                                                                                      |
| `API_BASE_URL`                      | Required                              | all                     | `http://localhost:3001`                      |                      No | API base URL.                                            | Valid URL.                                                                                                                                                                      |
| `REI_OS_NEXT_STANDALONE`            | Optional build-only                   | local/CI                | `1`                                          |                      No | Force Next standalone output on Windows.                 | Exactly `1`; use only on a Windows builder with symlink privilege. Linux CI/container builds use standalone output by default.                                                  |
| `DATABASE_URL`                      | Required after EP-003                 | local/staging/prod/test | `postgresql://rei:rei@localhost:5432/rei_os` |                  Secret | PostgreSQL/PostGIS connection.                           | Must use PostgreSQL URL; production must not use default password.                                                                                                              |
| `POSTGRES_HOST_PORT`                | Optional local Compose override       | local                   | `5432`                                       |              Non-secret | Host port for the solo-budget PostgreSQL service.        | Set to an unused local port such as `5433` when another development database already owns `5432`; container-to-container traffic remains on `5432`.                             |
| `REDIS_URL`                         | Required after EP-003                 | local/staging/prod/test | `redis://localhost:6379/0`                   |          Secret in prod | Redis connection.                                        | Valid Redis URL.                                                                                                                                                                |
| `SEARCH_PROVIDER`                   | Required after search setup           | all                     | `opensearch`                                 |                      No | Search adapter.                                          | One of `disabled`, `opensearch`, `elasticsearch`.                                                                                                                               |
| `SEARCH_URL`                        | Optional until search enabled         | all                     | `http://localhost:9200`                      | Secret if auth included | Search service URL.                                      | Required when `SEARCH_PROVIDER` is not `disabled`.                                                                                                                              |
| `OBJECT_STORAGE_PROVIDER`           | Required after EP-003                 | all                     | `local`                                      |                      No | Object storage adapter.                                  | One of `local`, `minio`, `s3`, `r2`, `b2`, `s3-compatible`.                                                                                                                     |
| `OBJECT_STORAGE_BUCKET`             | Required after EP-003                 | all                     | `rei-os-local`                               |                      No | Artifact bucket/container.                               | Non-empty when object storage enabled.                                                                                                                                          |
| `OBJECT_STORAGE_ENDPOINT`           | Optional                              | all                     | `http://localhost:9000`                      |                      No | S3-compatible endpoint.                                  | Required for MinIO/S3-compatible non-AWS providers.                                                                                                                             |
| `OBJECT_STORAGE_ACCESS_KEY_ID`      | Optional                              | all                     | `minioadmin`                                 |                  Secret | Object storage access key.                               | Required for non-local object storage.                                                                                                                                          |
| `OBJECT_STORAGE_SECRET_ACCESS_KEY`  | Optional                              | all                     | `minioadmin`                                 |                  Secret | Object storage secret key.                               | Required for non-local object storage.                                                                                                                                          |
| `AUTH_PROVIDER`                     | Required after auth setup             | all                     | `built-in`                                   |                      No | Auth mode.                                               | One of `built-in`, `keycloak`, `authentik`, `ory`, `auth0`, `workos`, `okta`.                                                                                                   |
| `SESSION_SECRET`                    | Required after auth setup             | all                     | `replace-with-32-byte-secret`                |                  Secret | Session signing/encryption secret.                       | Minimum 32 bytes; not default in staging/prod.                                                                                                                                  |
| `ENCRYPTION_KEY`                    | Required after security setup         | all                     | `base64:replace-with-32-byte-key`            |                  Secret | App-level encryption key for credentials/sensitive data. | 32-byte key; not default in staging/prod.                                                                                                                                       |
| `SESSION_COOKIE_NAME`               | Required after auth setup             | all                     | `rei_os_session`                             |                      No | Signed session cookie name.                              | Letters, digits, underscore, and hyphen only.                                                                                                                                   |
| `CSRF_COOKIE_NAME`                  | Required after auth setup             | all                     | `rei_os_csrf`                                |                      No | Double-submit CSRF cookie name.                          | Letters, digits, underscore, and hyphen only.                                                                                                                                   |
| `CORS_ALLOWED_ORIGINS`              | Required after auth setup             | all                     | `http://localhost:3000`                      |                      No | Comma-separated dashboard origins allowed by the API.    | Wildcards are forbidden; staging/production must supply an explicit non-local allowlist.                                                                                        |
| `SESSION_MAX_AGE_SECONDS`           | Optional                              | all                     | `28800`                                      |                      No | Absolute session lifetime.                               | Integer from 300 through 2592000.                                                                                                                                               |
| `SESSION_IDLE_TIMEOUT_SECONDS`      | Optional                              | all                     | `1800`                                       |                      No | Session idle lifetime.                                   | Integer from 60 through 86400.                                                                                                                                                  |
| `RATE_LIMIT_WINDOW_SECONDS`         | Optional                              | all                     | `60`                                         |                      No | In-process abuse-control window.                         | Integer from 10 through 3600.                                                                                                                                                   |
| `RATE_LIMIT_AUTH_ATTEMPTS`          | Optional                              | all                     | `10`                                         |                      No | Auth requests per principal/window.                      | Integer from 1 through 1000.                                                                                                                                                    |
| `RATE_LIMIT_SENSITIVE_REQUESTS`     | Optional                              | all                     | `60`                                         |                      No | Import/export/AI/campaign requests per tenant/window.    | Integer from 1 through 10000.                                                                                                                                                   |
| `RATE_LIMIT_WEBHOOK_REQUESTS`       | Optional                              | all                     | `300`                                        |                      No | Webhook requests per source/window.                      | Integer from 1 through 100000.                                                                                                                                                  |
| `SMTP_HOST`                         | Optional                              | all                     | `localhost`                                  |                      No | SMTP host for email adapter.                             | Required when email provider is `smtp`.                                                                                                                                         |
| `SMTP_PORT`                         | Optional                              | all                     | `1025`                                       |                      No | SMTP port.                                               | Integer 1-65535.                                                                                                                                                                |
| `SMTP_USERNAME`                     | Optional                              | all                     | `user`                                       |                  Secret | SMTP username.                                           | Required if SMTP auth enabled.                                                                                                                                                  |
| `SMTP_PASSWORD`                     | Optional                              | all                     | `password`                                   |                  Secret | SMTP password.                                           | Required if SMTP auth enabled.                                                                                                                                                  |
| `EMAIL_PROVIDER`                    | Required after channel setup          | all                     | `manual_export`                              |                      No | Email adapter.                                           | One of `manual_export`, `smtp`, `postal`, `listmonk`, `mautic`, `mailchimp`, `sendgrid`, `mailgun`, `postmark`, `ses`, `brevo`, `hubspot`, `activecampaign`, `constantcontact`. |
| `DIRECT_MAIL_PROVIDER`              | Required after channel setup          | all                     | `manual_pdf_csv`                             |                      No | Direct-mail adapter.                                     | One of `manual_pdf_csv`, `lob`, `postgrid`, `postalytics`, `local_mailhouse_export`.                                                                                            |
| `VOICE_PROVIDER`                    | Required after voice setup            | all                     | `manual_task`                                |                      No | Voice/call adapter.                                      | One of `manual_task`, `sip`, `livekit`, `asterisk`, `freeswitch`, `signalwire`, `twilio`, `telnyx`, `plivo`, `bandwidth`.                                                       |
| `SMS_PROVIDER`                      | Required after SMS setup              | all                     | `disabled`                                   |                      No | SMS adapter.                                             | One of `disabled`, `signalwire`, `twilio`, `telnyx`, `plivo`, `bandwidth`.                                                                                                      |
| `TELEGRAM_BOT_TOKEN`                | Optional                              | all                     | `123:abc`                                    |                  Secret | Telegram bot token.                                      | Required only when Telegram enabled.                                                                                                                                            |
| `TELEGRAM_ENABLED`                  | Required after Telegram setup         | all                     | `false`                                      |                      No | Enable Telegram command center.                          | Boolean.                                                                                                                                                                        |
| `MAP_PROVIDER`                      | Required after UI map setup           | all                     | `maplibre`                                   |                      No | Map adapter.                                             | One of `maplibre`, `self_hosted_tiles`, `mapbox`, `google`.                                                                                                                     |
| `GEOCODER_PROVIDER`                 | Optional                              | all                     | `disabled`                                   |                      No | Geocoding adapter.                                       | One of `disabled`, `pelias`, `nominatim_self_hosted`, `google`, `mapbox`, `here`, `radar`.                                                                                      |
| `LLM_MODE`                          | Required after AI setup               | all                     | `local_only`                                 |                      No | AI routing mode.                                         | One of `disabled`, `local_only`, `hybrid`, `hosted_overflow`.                                                                                                                   |
| `LOCAL_LLM_PROVIDER`                | Optional                              | all                     | `ollama`                                     |                      No | Local model runtime.                                     | One of `disabled`, `vllm`, `ollama`, `llama_cpp`, `tgi`.                                                                                                                        |
| `LOCAL_LLM_BASE_URL`                | Optional                              | all                     | `http://localhost:11434`                     |                      No | Local LLM API URL.                                       | Valid URL when local provider enabled.                                                                                                                                          |
| `LOCAL_LLM_MODEL`                   | Optional                              | all                     | `nous-hermes-local`                          |                      No | Local Hermes model identifier.                           | Non-empty when local provider enabled.                                                                                                                                          |
| `DEEPSEEK_API_KEY`                  | Optional                              | all                     | `sk-...`                                     |                  Secret | DeepSeek key for optional hosted/hybrid reasoning.       | Required only when DeepSeek route enabled.                                                                                                                                      |
| `DEEPSEEK_BASE_URL`                 | Optional                              | all                     | `https://api.deepseek.example`               |                      No | DeepSeek-compatible API base URL.                        | Valid URL when DeepSeek enabled.                                                                                                                                                |
| `HOSTED_LLM_ALLOWED`                | Required after AI setup               | all                     | `false`                                      |                      No | Whether hosted LLM calls may be used.                    | Boolean; production default must be tenant-configurable.                                                                                                                        |
| `DNC_PROVIDER`                      | Required after compliance setup       | all                     | `internal_only`                              |                      No | DNC/scrub adapter.                                       | One of `internal_only`, `tenant_credentials`, `approved_vendor`.                                                                                                                |
| `DNC_CREDENTIAL_REF`                | Optional                              | staging/prod            | `secret://tenant/dnc`                        |              Secret ref | Reference to tenant DNC credential.                      | Required for outbound calling where law/policy requires it.                                                                                                                     |
| `MLS_PROVIDER`                      | Optional                              | all                     | `disabled`                                   |                      No | MLS/RESO adapter.                                        | One of `disabled`, `reso`, `mls_grid`, `trestle`, `bridge`, `direct_feed`.                                                                                                      |
| `PROPERTY_DATA_PROVIDER`            | Required after property adapter setup | all                     | `csv_import`                                 |                      No | Property data source.                                    | One of `csv_import`, `attom`, `county_import`, `manual_import`.                                                                                                                 |
| `OTEL_EXPORTER_OTLP_ENDPOINT`       | Optional                              | all                     | `http://localhost:4318`                      |                      No | OpenTelemetry endpoint.                                  | Valid URL if telemetry export enabled.                                                                                                                                          |
| `LOG_LEVEL`                         | Required                              | all                     | `info`                                       |                      No | Logging level.                                           | One of `debug`, `info`, `warn`, `error`.                                                                                                                                        |
| `FEATURE_SMS_ENABLED`               | Required after channel setup          | all                     | `false`                                      |                      No | Enables SMS product surface.                             | Boolean; default false.                                                                                                                                                         |
| `FEATURE_AI_VOICE_OUTBOUND_ENABLED` | Required after voice setup            | all                     | `false`                                      |                      No | Enables outbound AI voice paths.                         | Boolean; default false and policy-gated.                                                                                                                                        |

## Secrets

Local secrets belong in `.env.local`, which must be gitignored. Staging/production secrets must live in a secret store or deployment platform secret mechanism. Do not commit `.env.local`, decrypted secrets, provider payloads, or generated secret examples with real values.

## Local Development Setup

1. Install required tools.
2. Copy `.env.example` to `.env.local` after EP-001 creates it.
3. Fill only local, fake, or development-safe values.
4. Run:

```sh
sh scripts/preflight.sh
sh scripts/install.sh
```

5. After EP-003:

```sh
pnpm db:setup
pnpm db:migrate
```

6. Start local development after EP-001:

```sh
pnpm dev
```

## Local Database Setup

Local database setup is created in EP-003. It must use synthetic data and disposable services. Do not connect local development to production databases.

## Test Environment Setup

Test environment must:

- Use synthetic fixtures.
- Use isolated databases or schema namespaces.
- Disable live paid-provider sends.
- Use mocked providers.
- Disable hosted LLM calls unless a specific opt-in integration test is documented.
- Use fake DNC/compliance fixtures without raw DNC data.

## Staging Environment Setup

Staging must:

- Use production-like infrastructure.
- Use non-production credentials.
- Use synthetic or approved test data.
- Enable observability.
- Run smoke tests after deploy.
- Exercise rollback path before production launch.

## Production Environment Setup

Production must:

- Use managed secrets.
- Use encrypted provider credentials.
- Use tenant-scoped data stores.
- Use backups and tested restore path.
- Use observability and alerting.
- Require explicit approval for deployment and migrations.
- Disable high-risk channels until compliance prerequisites are configured.
- Default hosted AI and SMS to disabled unless tenant enables them.

## Configuration Validation

Configuration validation must run at application startup and fail closed for:

- Missing required secrets.
- Default production secrets.
- Invalid provider enum values.
- Hosted AI enabled without tenant permission.
- SMS enabled without provider/compliance configuration.
- Outbound AI voice enabled without compliance prerequisites.
- DNC provider misconfigured for outbound calling.
- Object storage provider enabled without credentials.
- Production CORS/session misconfiguration.

## Environment Parity Rules

- Local, staging, and production must use the same validation code.
- Disabling optional providers must be explicit.
- Feature flags must default to safest mode.
- Production must not depend on local-only defaults.
- Test environment must not require paid providers.

## Troubleshooting

- If `sh scripts/preflight.sh` fails for missing `pnpm`, install pnpm and rerun.
- If placeholder scripts fail, complete EP-001 or update `COMMANDS.md` based on actual repository evidence.
- If database commands fail before EP-003, the persistence layer has not been created.
- If hosted provider tests fail due missing credentials, confirm whether the active ExecPlan permits live tests. Default is to use mocked providers.
- If a command is unknown, do not guess; update `COMMANDS.md` after repository inspection.
