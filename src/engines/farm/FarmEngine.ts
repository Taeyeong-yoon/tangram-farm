import animalsData from "@/data/farm/animals.json";
import cropsData from "@/data/farm/crops.json";
import rewardsData from "@/data/farm/rewards.json";
import unlocksData from "@/data/farm/unlocks.json";
import type {
  AnimalDefinition,
  AnimalSpecies,
  AnimalState,
  CropDefinition,
  CropSpecies,
  CropState,
  FarmResources,
  FarmSaveData,
  RewardRule,
  UnlockDefinition,
} from "@/types/farm.types";

const SAVE_VERSION = "1.0.0";
export const MAX_PLOTS = 8;

export const ANIMAL_DEFINITIONS = (animalsData.animals as AnimalDefinition[]).map((animal) => ({
  ...animal,
  stageNames: animal.stageNames.length ? animal.stageNames : animal.stages,
}));

export const CROP_DEFINITIONS = (cropsData.crops as CropDefinition[]).map((crop) => ({
  ...crop,
  stageNames: crop.stageNames.length ? crop.stageNames : crop.stages,
}));

export const REWARD_RULES = rewardsData.rules as RewardRule[];
export const UNLOCK_DEFINITIONS = unlocksData as UnlockDefinition;

export const animalDefinitionMap = new Map<AnimalSpecies, AnimalDefinition>(
  ANIMAL_DEFINITIONS.map((animal) => [animal.species, animal]),
);

export const cropDefinitionMap = new Map<CropSpecies, CropDefinition>(
  CROP_DEFINITIONS.map((crop) => [crop.species, crop]),
);

let idCounter = 0;

export function createFarmId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function getInitialResources(): FarmResources {
  return {
    seeds: 6,
    feed: 8,
    coins: 12,
  };
}

export function getInitialAnimals(now = Date.now()): AnimalState[] {
  const chicken = animalDefinitionMap.get("chicken");

  if (!chicken) {
    return [];
  }

  return [
    {
      id: createFarmId("animal"),
      species: "chicken",
      stage: chicken.stages[0],
      feedProgress: 0,
      feedRequired: chicken.feedPerStage[0] ?? 0,
      acquiredAt: now,
    },
  ];
}

export function getInitialFarmState(now = Date.now()): FarmSaveData {
  return {
    version: SAVE_VERSION,
    resources: getInitialResources(),
    animals: getInitialAnimals(now),
    crops: [],
    unlockedAnimals: ["chicken"],
    unlockedCrops: ["wheat"],
    farmLevel: 1,
    decorations: [],
    totalPuzzlesSolved: 0,
    clearedThemes: [],
    lastVisited: now,
    tutorialSeen: false,
  };
}

export function getAnimalDefinition(species: AnimalSpecies): AnimalDefinition {
  const definition = animalDefinitionMap.get(species);

  if (!definition) {
    throw new Error(`Unknown animal species: ${species}`);
  }

  return definition;
}

export function getCropDefinition(species: CropSpecies): CropDefinition {
  const definition = cropDefinitionMap.get(species);

  if (!definition) {
    throw new Error(`Unknown crop species: ${species}`);
  }

  return definition;
}

export function getStageLabel(stageNames: string[], index: number, fallback: string): string {
  return stageNames[index] ?? fallback;
}

export function getNextEmptyPlot(crops: CropState[]): number | null {
  for (let plotIndex = 0; plotIndex < MAX_PLOTS; plotIndex += 1) {
    if (!crops.some((crop) => crop.plotIndex === plotIndex)) {
      return plotIndex;
    }
  }

  return null;
}
