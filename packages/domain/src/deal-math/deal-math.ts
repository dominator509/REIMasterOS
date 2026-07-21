import { usd, addMoney, subtractMoney, multiplyMoney, type Money } from "../value-objects/money.js";

export interface DealAssumptions {
  readonly afterRepairValue: Money;
  readonly repairCosts: Money;
  readonly holdingCostsMonthly: Money;
  readonly holdingMonths: number;
  readonly closingCostsPercent: number;
  readonly agentFeesPercent: number;
  readonly targetProfitPercent: number;
}

export interface DealResult {
  readonly maxAllowableOffer: Money;
  readonly targetOffer: Money;
  readonly stretchOffer: Money;
  readonly walkAwayOffer: Money;
  readonly estimatedProfit: Money;
  readonly estimatedRoi: number;
  readonly breakdown: DealBreakdown;
}

export interface DealBreakdown {
  readonly arv: Money;
  readonly repairs: Money;
  readonly holdingCosts: Money;
  readonly closingCosts: Money;
  readonly agentFees: Money;
  readonly totalCosts: Money;
  readonly profit: Money;
}

/**
 * Calculate the Maximum Allowable Offer (MAO):
 * MAO = ARV - Repairs - Holding Costs - Closing Costs - Agent Fees - Target Profit
 */
export function calculateDeal(params: DealAssumptions): DealResult {
  for (const [name, value] of [
    ["holdingMonths", params.holdingMonths],
    ["closingCostsPercent", params.closingCostsPercent],
    ["agentFeesPercent", params.agentFeesPercent],
    ["targetProfitPercent", params.targetProfitPercent],
  ] as const) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be non-negative`);
  }
  const arv = params.afterRepairValue;
  const repairs = params.repairCosts;
  const holdingCosts = multiplyMoney(params.holdingCostsMonthly, params.holdingMonths);
  const closingCosts = multiplyMoney(arv, params.closingCostsPercent / 100);
  const agentFees = multiplyMoney(arv, params.agentFeesPercent / 100);
  const targetProfit = multiplyMoney(arv, params.targetProfitPercent / 100);

  const totalCosts = [repairs, holdingCosts, closingCosts, agentFees].reduce(addMoney, usd(0));
  const totalDeductions = addMoney(totalCosts, targetProfit);
  const mao = subtractMoney(arv, totalDeductions);

  const breakdown: DealBreakdown = {
    arv,
    repairs,
    holdingCosts,
    closingCosts,
    agentFees,
    totalCosts,
    profit: targetProfit,
  };

  return {
    maxAllowableOffer: mao,
    targetOffer: mao,
    stretchOffer: addMoney(mao, multiplyMoney(targetProfit, 0.25)),
    walkAwayOffer: subtractMoney(mao, multiplyMoney(targetProfit, 0.5)),
    estimatedProfit: targetProfit,
    estimatedRoi: arv.amountCents > 0 ? (targetProfit.amountCents / arv.amountCents) * 100 : 0,
    breakdown,
  };
}

export interface OfferLadder {
  readonly opening: Money;
  readonly target: Money;
  readonly stretch: Money;
  readonly walkAway: Money;
}

export function createOfferLadder(params: {
  readonly maxAllowable: Money;
  readonly targetPercent?: number;
  readonly openingPercent?: number;
}): OfferLadder {
  const targetPercent = params.targetPercent ?? 85;
  const openingPercent = params.openingPercent ?? 70;
  if (openingPercent < 0 || targetPercent < openingPercent || targetPercent > 100) {
    throw new Error("Offer ladder percentages must satisfy 0 <= opening <= target <= 100");
  }
  return {
    opening: multiplyMoney(params.maxAllowable, openingPercent / 100),
    target: multiplyMoney(params.maxAllowable, targetPercent / 100),
    stretch: params.maxAllowable,
    walkAway: usd(0),
  };
}

export function estimateRoi(profit: Money, totalInvested: Money): number {
  if (totalInvested.amountCents === 0) return 0;
  return Math.round((profit.amountCents / totalInvested.amountCents) * 10000) / 100;
}

export function isDealViable(deal: DealResult, minRoi: number = 10): boolean {
  return deal.estimatedRoi >= minRoi && deal.maxAllowableOffer.amountCents > 0;
}
