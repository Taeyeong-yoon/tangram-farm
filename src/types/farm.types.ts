export interface RewardPayload {
  seeds: number;
  feed: number;
  coins: number;
  specialItem?: string;
}

export type AnimalSpecies = "chicken" | "goat" | "pig" | "cow" | "horse";
export type AnimalStage = "egg" | "baby" | "young" | "adult";
export type CropSpecies = "wheat" | "corn" | "carrot" | "potato";
export type CropStage = "seed" | "sprout" | "growing" | "ready";

export type UnlockCondition =
  | { type: "puzzle_count"; count: number }
  | { type: "theme_clear"; theme: string }
  | { type: "farm_level"; level: number };

export interface AnimalDefinition {
  species: AnimalSpecies;
  nameKo: string;
  unlockCondition: UnlockCondition;
  stages: AnimalStage[];
  stageNames: string[];
  feedPerStage: number[];
  canBreed: boolean;
  breedCost: number;
  maxCount: number;
}

export interface AnimalState {
  id: string;
  species: AnimalSpecies;
  stage: AnimalStage;
  feedProgress: number;
  feedRequired: number;
  acquiredAt: number;
}

export interface CropDefinition {
  species: CropSpecies;
  nameKo: string;
  unlockCondition: UnlockCondition;
  stages: CropStage[];
  stageNames: string[];
  seedCost: number;
  growthSteps: number;
  harvestReward: RewardPayload;
}

export interface CropState {
  id: string;
  species: CropSpecies;
  stage: CropStage;
  growthProgress: number;
  plantedAt: number;
  plotIndex: number;
}

export interface FarmResources {
  seeds: number;
  feed: number;
  coins: number;
}

export interface FarmSaveData {
  version: string;
  resources: FarmResources;
  animals: AnimalState[];
  crops: CropState[];
  unlockedAnimals: AnimalSpecies[];
  unlockedCrops: CropSpecies[];
  farmLevel: number;
  decorations: string[];
  totalPuzzlesSolved: number;
  clearedThemes: string[];
  lastVisited: number;
  tutorialSeen: boolean;
}

export interface UnlockDefinition {
  animals: Record<AnimalSpecies, UnlockCondition>;
  crops: Record<CropSpecies, UnlockCondition>;
  farmExpansion: Record<string, UnlockCondition>;
}

export interface RewardRule {
  levelDifficulty: 1 | 2 | 3 | 4 | 5;
  hintsUsed: 0 | 1 | 2 | 3;
  baseReward: RewardPayload;
}

export interface GrowthEvent {
  id: string;
  kind: "animal" | "crop";
  nameKo: string;
  description: string;
}

export interface UnlockEvent {
  id: string;
  label: string;
  description: string;
}
