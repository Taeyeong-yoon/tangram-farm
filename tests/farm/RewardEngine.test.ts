import { describe, expect, it } from "vitest";
import { calculatePuzzleReward, getRepeatMultiplier } from "@/engines/farm/RewardEngine";

describe("RewardEngine", () => {
  it("returns the full reward for a first clear", () => {
    expect(calculatePuzzleReward(2, 0, 1)).toEqual({
      seeds: 3,
      feed: 3,
      coins: 8,
      specialItem: undefined,
    });
  });

  it("applies a repeat penalty but never drops below half", () => {
    expect(getRepeatMultiplier(2)).toBe(0.8);
    expect(getRepeatMultiplier(3)).toBe(0.6);
    expect(getRepeatMultiplier(7)).toBe(0.5);
  });
});
