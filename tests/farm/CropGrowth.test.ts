import { describe, expect, it } from "vitest";
import { advanceCropsFromPuzzle } from "@/engines/farm/CropGrowth";

describe("CropGrowth", () => {
  it("moves crop progress by 25 percent per puzzle", () => {
    const result = advanceCropsFromPuzzle([
      {
        id: "crop-1",
        species: "wheat",
        stage: "seed",
        growthProgress: 0,
        plantedAt: 0,
        plotIndex: 0,
      },
    ]);

    expect(result.crops[0].growthProgress).toBe(25);
    expect(result.crops[0].stage).toBe("sprout");
  });
});
