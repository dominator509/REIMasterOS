import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  PropertiesView,
  type PropertyListEnvelope,
} from "../src/features/properties/properties-view";
import { LeadListsView, type LeadListEnvelope } from "../src/features/lead-lists/lead-lists-view";
import { TasksView, type TaskListEnvelope } from "../src/features/tasks/tasks-view";
import { ActivityView, type ActivityListEnvelope } from "../src/features/activity/activity-view";

const meta = { requestId: "request-test", tenantId: "tenant-test" };
const page = { total: 1, page: 1, limit: 20, totalPages: 1 };

describe("core workspace screen acceptance", () => {
  it("renders loading, empty, populated, and error property states with a table alternative", () => {
    const empty: PropertyListEnvelope = {
      data: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      meta,
    };
    const populated: PropertyListEnvelope = {
      data: {
        items: [
          {
            id: "00000000-0000-4000-8000-000000000101",
            tenantId: "00000000-0000-4000-8000-000000000001",
            address: { street: "123 Synthetic Way", city: "Austin", state: "TX", zip: "78701" },
            characteristics: { propertyType: "single_family" },
            status: "active",
            createdAt: "2026-07-18T12:00:00.000Z",
            updatedAt: "2026-07-18T12:00:00.000Z",
          },
        ],
        ...page,
      },
      meta,
    };

    expect(renderToStaticMarkup(<PropertiesView state={{ status: "loading" }} />)).toContain(
      "Loading workspace data",
    );
    expect(
      renderToStaticMarkup(<PropertiesView state={{ status: "ready", data: empty }} />),
    ).toContain("No properties match");
    const populatedHtml = renderToStaticMarkup(
      <PropertiesView state={{ status: "ready", data: populated }} />,
    );
    expect(populatedHtml).toContain("123 Synthetic Way");
    expect(populatedHtml).toContain("Property results table alternative");
    expect(
      renderToStaticMarkup(
        <PropertiesView
          state={{ status: "error", code: "FORBIDDEN", message: "Access denied." }}
        />,
      ),
    ).toContain('role="alert"');
  });

  it("renders lead-list stacking and deduplication status", () => {
    const data: LeadListEnvelope = {
      data: {
        items: [
          {
            id: "00000000-0000-4000-8000-000000000201",
            tenantId: "tenant-test",
            name: "Synthetic absentee owners",
            description: "Acceptance fixture",
            sources: ["synthetic-csv"],
            tags: [],
            stage: "ready",
            createdAt: "2026-07-18T12:00:00.000Z",
            updatedAt: "2026-07-18T12:00:00.000Z",
          },
        ],
        ...page,
      },
      meta,
    };
    const html = renderToStaticMarkup(<LeadListsView state={{ status: "ready", data }} />);
    expect(html).toContain("Synthetic absentee owners");
    expect(html).toContain("Deduplication status");
  });

  it("renders follow-up and universal timeline records without enabling unauthenticated writes", () => {
    const tasks: TaskListEnvelope = {
      data: {
        items: [
          {
            id: "00000000-0000-4000-8000-000000000301",
            tenantId: "tenant-test",
            title: "Review synthetic lead",
            description: "",
            priority: "high",
            status: "todo",
            tags: [],
            createdAt: "2026-07-18T12:00:00.000Z",
            updatedAt: "2026-07-18T12:00:00.000Z",
          },
        ],
        ...page,
      },
      meta,
    };
    const activity: ActivityListEnvelope = {
      data: {
        items: [
          {
            id: "00000000-0000-4000-8000-000000000401",
            tenantId: "tenant-test",
            actorId: "user-test",
            action: "task.created",
            targetType: "task",
            targetId: "00000000-0000-4000-8000-000000000301",
            metadata: {},
            timestamp: "2026-07-18T12:00:00.000Z",
          },
        ],
        ...page,
      },
      meta,
    };
    const taskHtml = renderToStaticMarkup(<TasksView state={{ status: "ready", data: tasks }} />);
    const activityHtml = renderToStaticMarkup(
      <ActivityView state={{ status: "ready", data: activity }} />,
    );
    expect(taskHtml).toContain("Review synthetic lead");
    expect(taskHtml).toContain("Create task");
    expect(taskHtml).toContain("disabled");
    expect(activityHtml).toContain("Universal activity timeline");
    expect(activityHtml).toContain("task.created");
  });
});
