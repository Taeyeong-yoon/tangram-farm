import { describe, expect, it } from "vitest";
import { feedAnimalById } from "@/engines/farm/AnimalGrowth";
import { getInitialAnimals } from "@/engines/farm/FarmEngine";

describe("AnimalGrowth", () => {
  it("advances the animal stage after enough feed is spent", () => {
    const [animal] = getInitialAnimals(0);
    const result = feedAnimalById([animal], animal.id, 3);

    expect(result.feedSpent).toBe(3);
    expect(result.animals[0].stage).toBe("baby");
    expect(result.growthEvents).toHaveLength(1);
  });
});
