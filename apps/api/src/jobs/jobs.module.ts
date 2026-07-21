import { Global, Module } from "@nestjs/common";
import { InMemoryJobQueue } from "./in-memory-job-queue.service.js";

@Global()
@Module({ providers: [InMemoryJobQueue], exports: [InMemoryJobQueue] })
export class JobsModule {}
