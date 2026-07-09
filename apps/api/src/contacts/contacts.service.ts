import { Injectable, NotFoundException } from "@nestjs/common";
import { successResponse, paginatedResponse, errorResponse } from "../common/response.envelope.js";

@Injectable()
export class ContactsService {
  private readonly store = new Map<string, any>();

  async list(query: any) {
    const items = [...this.store.values()];
    return paginatedResponse(items.slice(0, query.limit), items.length, query.page, query.limit);
  }

  async getById(id: string) {
    const item = this.store.get(id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Contact ${id} not found`));
    return successResponse(item);
  }

  async create(body: any) {
    const id = body.id ?? crypto.randomUUID();
    const contact = {
      id,
      ...body,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, contact);
    return successResponse(contact);
  }
}
