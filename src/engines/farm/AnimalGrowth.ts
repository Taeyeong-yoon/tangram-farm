import { createFarmId, getAnimalDefinition, getStageLabel } from "@/engines/farm/FarmEngine";
import type { AnimalSpecies, AnimalState, GrowthEvent } from "@/types/farm.types";

interface FeedResult {
  animals: AnimalState[];
  growthEvents: GrowthEvent[];
  feedSpent: number;
}

interface BreedResult {
  animals: AnimalState[];
  success: boolean;
}

export function feedAnimalById(animals: AnimalState[], animalId: string, amount: number): FeedResult {
  if (amount <= 0) {
    return { animals, growthEvents: [], feedSpent: 0 };
  }

  const target = animals.find((animal) => animal.id === animalId);

  if (!target) {
    return { animals, growthEvents: [], feedSpent: 0 };
  }

  const definition = getAnimalDefinition(target.species);
  const targetIndex = animals.findIndex((animal) => animal.id === animalId);
  const updatedAnimals = [...animals];
  const growthEvents: GrowthEvent[] = [];

  let nextAnimal = { ...target };
  let remainingFeed = amount;
  let spent = 0;

  while (remainingFeed > 0 && nextAnimal.stage !== "adult") {
    const needed = Math.max(0, nextAnimal.feedRequired - nextAnimal.feedProgress);
    const feedNow = Math.min(remainingFeed, needed);
    nextAnimal.feedProgress += feedNow;
    remainingFeed -= feedNow;
    spent += feedNow;

    if (nextAnimal.feedProgress >= nextAnimal.feedRequired) {
      const stageIndex = definition.stages.indexOf(nextAnimal.stage);
      const nextStage = definition.stages[stageIndex + 1];

      if (!nextStage) {
        nextAnimal = {
          ...nextAnimal,
          stage: "adult",
          feedProgress: 0,
          feedRequired: 0,
        };
        break;
      }

      const nextFeedRequired = definition.feedPerStage[stageIndex + 1] ?? 0;
      nextAnimal = {
        ...nextAnimal,
        stage: nextStage,
        feedProgress: 0,
        feedRequired: nextFeedRequired,
      };

      growthEvents.push({
        id: createFarmId("growth"),
        kind: "animal",
        nameKo: definition.nameKo,
        description: `${definition.nameKo}이(가) ${getStageLabel(
          definition.stageNames,
          stageIndex + 1,
          nextStage,
        )} 단계가 되었어요.`,
      });
    }
  }

  updatedAnimals[targetIndex] = nextAnimal;

  return {
    animals: updatedAnimals,
    growthEvents,
    feedSpent: spent,
  };
}

export function breedAnimals(animals: AnimalState[], species: AnimalSpecies, now = Date.now()): BreedResult {
  const definition = getAnimalDefinition(species);

  if (!definition.canBreed) {
    return { animals, success: false };
  }

  const adults = animals.filter((animal) => animal.species === species && animal.stage === "adult");
  const sameSpecies = animals.filter((animal) => animal.species === species);

  if (adults.length < 2 || sameSpecies.length >= definition.maxCount) {
    return { animals, success: false };
  }

  const firstStage = definition.stages[0];
  const firstFeedRequired = definition.feedPerStage[0] ?? 0;

  return {
    animals: [
      ...animals,
      {
        id: createFarmId("animal"),
        species,
        stage: firstStage,
        feedProgress: 0,
        feedRequired: firstFeedRequired,
        acquiredAt: now,
      },
    ],
    success: true,
  };
}
