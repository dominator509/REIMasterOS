import { describe, it, expect } from "vitest";
import { calculateDeal, createOfferLadder, isDealViable } from "../deal-math/deal-math.js";
import { moneyFromDollars } from "../value-objects/money.js";

const sampleAssumptions = {
  afterRepairValue: moneyFromDollars(300_000),
  repairCosts: moneyFromDollars(45_000),
  holdingCostsMonthly: moneyFromDollars(2_000),
  holdingMonths: 6,
  closingCostsPercent: 2,
  agentFeesPercent: 1,
  targetProfitPercent: 15,
};

describe("calculateDeal", () => {
  it("computes MAO correctly", () => {
    const result = calculateDeal(sampleAssumptions);
    // ARV=300k, Repairs=45k, Holding=12k, Closing=6k, Agent=3k, Profit=45k
    // Total deductions = 45+12+6+3+45 = 111k, MAO = 300-111 = 189k
    expect(result.maxAllowableOffer.amountCents).toBe(18_900_000);
    expect(result.targetOffer.amountCents).toBe(18_900_000);
  });

  it("calculates stretch above MAO", () => {
    const result = calculateDeal(sampleAssumptions);
    // stretch = MAO + 25% of target profit = 189k + 11.25k = 200.25k
    expect(result.stretchOffer.amountCents).toBeGreaterThan(result.targetOffer.amountCents);
  });

  it("walk away is below target", () => {
    const result = calculateDeal(sampleAssumptions);
    expect(result.walkAwayOffer.amountCents).toBeLessThan(result.targetOffer.amountCents);
  });

  it("computes ROI", () => {
    const result = calculateDeal(sampleAssumptions);
    // ROI = target profit / ARV = 45k/300k = 15%
    expect(result.estimatedRoi).toBeCloseTo(15, 0);
  });
});

describe("createOfferLadder", () => {
  it("creates ladder from max allowable", () => {
    const ladder = createOfferLadder({ maxAllowable: moneyFromDollars(200_000) });
    expect(ladder.opening.amountCents).toBe(140_000_00);
    expect(ladder.target.amountCents).toBe(170_000_00);
    expect(ladder.stretch.amountCents).toBe(200_000_00);
  });
});

describe("isDealViable", () => {
  it("viable deal passes", () => {
    const result = calculateDeal(sampleAssumptions);
    expect(isDealViable(result)).toBe(true);
  });
});
