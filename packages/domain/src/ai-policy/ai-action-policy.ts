export type AiActionCategory =
  | "read_only_query"
  | "draft_content"
  | "suggest_action"
  | "modify_data"
  | "execute_action"
  | "send_communication";

export type AiActionPolicyVerdict = "auto" | "needs_approval" | "blocked";

export interface AiActionPolicy {
  readonly category: AiActionCategory;
  readonly verdict: AiActionPolicyVerdict;
  readonly requiresMfa: boolean;
  readonly requiresHumanReview: boolean;
  readonly maxAutoTokens?: number;
}

const AI_POLICY_MATRIX: Record<AiActionCategory, AiActionPolicy> = {
  read_only_query: {
    category: "read_only_query",
    verdict: "auto",
    requiresMfa: false,
    requiresHumanReview: false,
    maxAutoTokens: 50_000,
  },
  draft_content: {
    category: "draft_content",
    verdict: "auto",
    requiresMfa: false,
    requiresHumanReview: true,
    maxAutoTokens: 25_000,
  },
  suggest_action: {
    category: "suggest_action",
    verdict: "needs_approval",
    requiresMfa: false,
    requiresHumanReview: true,
    maxAutoTokens: 10_000,
  },
  modify_data: {
    category: "modify_data",
    verdict: "needs_approval",
    requiresMfa: true,
    requiresHumanReview: true,
  },
  execute_action: {
    category: "execute_action",
    verdict: "needs_approval",
    requiresMfa: true,
    requiresHumanReview: true,
  },
  send_communication: {
    category: "send_communication",
    verdict: "blocked",
    requiresMfa: true,
    requiresHumanReview: true,
  },
};

export function classifyAiAction(actionDescription: string): AiActionCategory {
  const lower = actionDescription.toLowerCase();

  if (
    /\b(search|query|find|look\.?up|read|get|list|fetch|retrieve)\b/i.test(lower) &&
    !/\b(create|update|delete|send|execute|modify)\b/i.test(lower)
  ) {
    return "read_only_query";
  }

  if (
    /\b(draft|compose|write|generate|create).*\b(email|message|letter|text|note|content|copy)\b/i.test(
      lower,
    )
  ) {
    return "draft_content";
  }

  if (
    /\b(send|transmit|dispatch|broadcast|deliver).*\b(email|sms|message|campaign|mail)\b/i.test(
      lower,
    )
  ) {
    return "send_communication";
  }

  if (/\b(suggest|recommend|propose|advise)\b/i.test(lower)) {
    return "suggest_action";
  }

  if (/\b(create|update|delete|modify|change|edit|save|store)\b/i.test(lower)) {
    return "modify_data";
  }

  if (/\b(execute|run|process|trigger|perform|apply)\b/i.test(lower)) {
    return "execute_action";
  }

  return "suggest_action"; // conservative default
}

export function getAiPolicy(category: AiActionCategory): AiActionPolicy {
  return AI_POLICY_MATRIX[category];
}

export function checkAiAction(actionDescription: string, tokenCount?: number): AiActionPolicy {
  const category = classifyAiAction(actionDescription);
  const policy = getAiPolicy(category);

  if (
    tokenCount !== undefined &&
    policy.maxAutoTokens !== undefined &&
    tokenCount > policy.maxAutoTokens
  ) {
    return { ...policy, verdict: "needs_approval" };
  }

  return policy;
}

/** AI outputs cannot alter authoritative values without explicit approval. */
export function canAiModifyField(fieldName: string): boolean {
  const authoritativeFields = [
    "propertyAddress",
    "ownerName",
    "salePrice",
    "legalDescription",
    "parcelNumber",
    "deedRecording",
    "contractDate",
    "earnestMoneyAmount",
  ];
  return !authoritativeFields.includes(fieldName);
}
