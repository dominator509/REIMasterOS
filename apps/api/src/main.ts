import { NestFactory } from "@nestjs/core";
import { loadAuthConfig } from "@rei-os/config";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const security = loadAuthConfig();
  app.enableCors({
    origin: security.CORS_ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Request-ID"],
  });
  const port = process.env["API_PORT"] ?? 3001;
  await app.listen(port);
  console.log(`API listening on http://localhost:${String(port)}`);
}

void bootstrap();
