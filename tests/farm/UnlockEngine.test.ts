import { describe, expect, it } from "vitest";
import { evaluateUnlocks } from "@/engines/farm/UnlockEngine";
import { getInitialFarmState } from "@/engines/farm/FarmEngine";

describe("UnlockEngine", () => {
  it("unlocks the next crop after enough puzzles are solved", () => {
    const farm = getInitialFarmState();
    const result = evaluateUnlocks({
      ...farm,
      totalPuzzlesSolved: 8,
    });

    expect(result.unlockedCrops).toContain("corn");
  });
});
