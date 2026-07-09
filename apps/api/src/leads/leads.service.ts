import { Injectable, NotFoundException } from "@nestjs/common";
import type { LeadListQuery } from "@rei-os/contracts";
import { successResponse, paginatedResponse, errorResponse } from "../common/response.envelope.js";

@Injectable()
export class LeadsService {
  private readonly store = new Map<string, any>();

  async list(query: LeadListQuery) {
    const items = [...this.store.values()];
    const filtered = query.status ? items.filter((i: any) => i.status === query.status) : items;
    return paginatedResponse(
      filtered.slice(0, query.limit),
      filtered.length,
      query.page,
      query.limit,
    );
  }

  async getById(id: string) {
    const item = this.store.get(id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Lead ${id} not found`));
    return successResponse(item);
  }

  async create(body: any) {
    const id = body.id ?? crypto.randomUUID();
    const lead = {
      id,
      ...body,
      score: 0,
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, lead);
    return successResponse(lead);
  }
}
