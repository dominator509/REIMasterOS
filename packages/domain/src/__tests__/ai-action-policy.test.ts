import { describe, it, expect } from "vitest";
import {
  classifyAiAction,
  checkAiAction,
  canAiModifyField,
} from "../ai-policy/ai-action-policy.js";

describe("classifyAiAction", () => {
  it("classifies read queries", () => {
    expect(classifyAiAction("find properties in Austin")).toBe("read_only_query");
    expect(classifyAiAction("get lead details")).toBe("read_only_query");
  });
  it("classifies draft content", () => {
    expect(classifyAiAction("draft an email to the owner")).toBe("draft_content");
    expect(classifyAiAction("compose a letter")).toBe("draft_content");
  });
  it("classifies send as blocked", () => {
    expect(classifyAiAction("send email campaign to leads")).toBe("send_communication");
  });
  it("classifies suggestions", () => {
    expect(classifyAiAction("suggest an offer price")).toBe("suggest_action");
  });
  it("classifies data modification", () => {
    expect(classifyAiAction("update property status")).toBe("modify_data");
  });
});

describe("checkAiAction", () => {
  it("auto-approves read queries", () => {
    const policy = checkAiAction("find properties");
    expect(policy.verdict).toBe("auto");
  });
  it("blocks send communication", () => {
    const policy = checkAiAction("send email to leads");
    expect(policy.verdict).toBe("blocked");
  });
  it("needs approval for large token queries", () => {
    const policy = checkAiAction("find all properties", 60_000);
    expect(policy.verdict).toBe("needs_approval");
  });
});

describe("canAiModifyField", () => {
  it("blocks AI modification of authoritative fields", () => {
    expect(canAiModifyField("salePrice")).toBe(false);
    expect(canAiModifyField("parcelNumber")).toBe(false);
  });
  it("allows AI modification of non-authoritative fields", () => {
    expect(canAiModifyField("notes")).toBe(true);
    expect(canAiModifyField("tags")).toBe(true);
  });
});
