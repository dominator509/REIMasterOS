import { Injectable, NotFoundException } from "@nestjs/common";
import type { PropertyListQuery } from "@rei-os/contracts";
import { successResponse, paginatedResponse, errorResponse } from "../common/response.envelope.js";

@Injectable()
export class PropertiesService {
  // In-memory until persistence layer is wired
  private readonly store = new Map<string, any>();

  async list(query: PropertyListQuery) {
    const items = [...this.store.values()];
    return paginatedResponse(items.slice(0, query.limit), items.length, query.page, query.limit);
  }

  async getById(id: string) {
    const item = this.store.get(id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Property ${id} not found`));
    return successResponse(item);
  }

  async create(body: any) {
    const id = body.id ?? crypto.randomUUID();
    const property = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, property);
    return successResponse(property);
  }
}
