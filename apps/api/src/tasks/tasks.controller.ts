import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  TaskCreateRequestSchema,
  TaskListQuerySchema,
  type TaskCreateRequest,
  type TaskListQuery,
} from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { TasksService } from "./tasks.service.js";

@Controller("tasks")
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(TaskListQuerySchema)) query: TaskListQuery,
  ) {
    return this.service.list(requireAuthContext(request), query);
  }

  @Get(":id")
  get(@Req() request: AuthenticatedRequest, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.service.get(requireAuthContext(request), id);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(TaskCreateRequestSchema)) body: TaskCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }
}
