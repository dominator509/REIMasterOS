import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env["API_PORT"] ?? 3001;
  await app.listen(port);
  console.log(`API listening on http://localhost:${String(port)}`);
}

void bootstrap();
