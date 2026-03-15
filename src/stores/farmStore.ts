import { create } from "zustand";
import { breedAnimals, feedAnimalById } from "@/engines/farm/AnimalGrowth";
import { advanceCropsFromPuzzle, harvestCrop, plantCrop } from "@/engines/farm/CropGrowth";
import { getAnimalDefinition, getCropDefinition, getInitialFarmState } from "@/engines/farm/FarmEngine";
import { evaluateUnlocks } from "@/engines/farm/UnlockEngine";
import type {
  AnimalSpecies,
  AnimalState,
  CropSpecies,
  CropState,
  FarmResources,
  GrowthEvent,
  RewardPayload,
  UnlockEvent,
} from "@/types/farm.types";
import { loadData, saveData } from "@/utils/storage";

interface RewardContext {
  theme?: string;
}

interface FarmStore {
  resources: FarmResources;
  animals: AnimalState[];
  crops: CropState[];
  unlockedAnimals: AnimalSpecies[];
  unlockedCrops: CropSpecies[];
  farmLevel: number;
  decorations: string[];
  totalPuzzlesSolved: number;
  clearedThemes: string[];
  tutorialSeen: boolean;
  lastVisited: number;
  sessionStartedAt: number;
  recentGrowthEvents: GrowthEvent[];
  recentUnlocks: UnlockEvent[];
  receiveReward: (payload: RewardPayload, context?: RewardContext) => void;
  feedAnimal: (animalId: string, amount: number) => void;
  plantCrop: (species: CropSpecies, plotIndex?: number) => void;
  harvestCrop: (cropId: string) => void;
  breedAnimals: (species: AnimalSpecies) => boolean;
  checkUnlocks: () => void;
  dismissGrowthEvent: (id: string) => void;
  dismissUnlockEvent: (id: string) => void;
  markTutorialSeen: () => void;
  resetFarm: () => void;
}

function loadFarmState() {
  const fallback = getInitialFarmState();

  if (typeof window === "undefined") {
    return fallback;
  }

  const saved = loadData();
  if (!saved?.farm) {
    return fallback;
  }

  return {
    ...fallback,
    ...saved.farm,
    resources: {
      ...fallback.resources,
      ...saved.farm.resources,
    },
  };
}

function persistFarmState(state: FarmStore) {
  saveData({
    farm: {
      version: "1.0.0",
      resources: state.resources,
      animals: state.animals,
      crops: state.crops,
      unlockedAnimals: state.unlockedAnimals,
      unlockedCrops: state.unlockedCrops,
      farmLevel: state.farmLevel,
      decorations: state.decorations,
      totalPuzzlesSolved: state.totalPuzzlesSolved,
      clearedThemes: state.clearedThemes,
      lastVisited: state.lastVisited,
      tutorialSeen: state.tutorialSeen,
    },
  });
}

const initialState = loadFarmState();

export const useFarmStore = create<FarmStore>((set, get) => ({
  resources: initialState.resources,
  animals: initialState.animals,
  crops: initialState.crops,
  unlockedAnimals: initialState.unlockedAnimals,
  unlockedCrops: initialState.unlockedCrops,
  farmLevel: initialState.farmLevel,
  decorations: initialState.decorations,
  totalPuzzlesSolved: initialState.totalPuzzlesSolved,
  clearedThemes: initialState.clearedThemes,
  tutorialSeen: initialState.tutorialSeen,
  lastVisited: initialState.lastVisited,
  sessionStartedAt: Date.now(),
  recentGrowthEvents: [],
  recentUnlocks: [],

  receiveReward: (payload, context) => {
    set((state) => {
      const nextClearedThemes =
        context?.theme && !state.clearedThemes.includes(context.theme)
          ? [...state.clearedThemes, context.theme]
          : state.clearedThemes;

      const cropAdvance = advanceCropsFromPuzzle(state.crops);
      const evaluated = evaluateUnlocks({
        version: "1.0.0",
        resources: {
          seeds: state.resources.seeds + payload.seeds,
          feed: state.resources.feed + payload.feed,
          coins: state.resources.coins + payload.coins,
        },
        animals: state.animals,
        crops: cropAdvance.crops,
        unlockedAnimals: state.unlockedAnimals,
        unlockedCrops: state.unlockedCrops,
        farmLevel: state.farmLevel,
        decorations: payload.specialItem ? [...state.decorations, payload.specialItem] : state.decorations,
        totalPuzzlesSolved: state.totalPuzzlesSolved + 1,
        clearedThemes: nextClearedThemes,
        lastVisited: Date.now(),
        tutorialSeen: state.tutorialSeen,
      });

      const nextState = {
        ...state,
        resources: {
          seeds: state.resources.seeds + payload.seeds,
          feed: state.resources.feed + payload.feed,
          coins: state.resources.coins + payload.coins,
        },
        crops: cropAdvance.crops,
        unlockedAnimals: evaluated.unlockedAnimals,
        unlockedCrops: evaluated.unlockedCrops,
        farmLevel: evaluated.farmLevel,
        decorations: payload.specialItem ? [...state.decorations, payload.specialItem] : state.decorations,
        totalPuzzlesSolved: state.totalPuzzlesSolved + 1,
        clearedThemes: nextClearedThemes,
        recentGrowthEvents: cropAdvance.growthEvents,
        recentUnlocks: evaluated.unlockEvents,
        lastVisited: Date.now(),
      };

      persistFarmState(nextState);
      return nextState;
    });
  },

  feedAnimal: (animalId, amount) => {
    set((state) => {
      const result = feedAnimalById(state.animals, animalId, Math.min(amount, state.resources.feed));
      const nextState = {
        ...state,
        animals: result.animals,
        resources: {
          ...state.resources,
          feed: state.resources.feed - result.feedSpent,
        },
        recentGrowthEvents: result.growthEvents,
        lastVisited: Date.now(),
      };

      persistFarmState(nextState);
      return nextState;
    });
  },

  plantCrop: (species, plotIndex) => {
    set((state) => {
      const definition = getCropDefinition(species);

      if (state.resources.seeds < definition.seedCost) {
        return state;
      }

      const result = plantCrop(state.crops, species, plotIndex);
      if (!result.crop) {
        return state;
      }

      const nextState = {
        ...state,
        crops: [...state.crops, result.crop],
        resources: {
          ...state.resources,
          seeds: state.resources.seeds - definition.seedCost,
        },
        lastVisited: Date.now(),
      };

      persistFarmState(nextState);
      return nextState;
    });
  },

  harvestCrop: (cropId) => {
    set((state) => {
      const result = harvestCrop(state.crops, cropId);
      if (!result.reward) {
        return state;
      }

      const nextState = {
        ...state,
        crops: result.crops,
        resources: {
          seeds: state.resources.seeds + result.reward.seeds,
          feed: state.resources.feed + result.reward.feed,
          coins: state.resources.coins + result.reward.coins,
        },
        recentGrowthEvents: [
          {
            id: `harvest-${cropId}`,
            kind: "crop" as const,
            nameKo: "수확",
            description: "작물을 수확해서 씨앗과 코인을 받았어요.",
          },
        ],
        lastVisited: Date.now(),
      };

      persistFarmState(nextState);
      return nextState;
    });
  },

  breedAnimals: (species) => {
    const state = get();
    const definition = getAnimalDefinition(species);
    const result = breedAnimals(state.animals, species);

    if (!result.success || state.resources.feed < definition.breedCost) {
      return false;
    }

    const nextState = {
      ...state,
      animals: result.animals,
      resources: {
        ...state.resources,
        feed: state.resources.feed - definition.breedCost,
      },
      recentGrowthEvents: [
        {
          id: `breed-${species}-${Date.now()}`,
          kind: "animal" as const,
          nameKo: definition.nameKo,
          description: `새 ${definition.nameKo} 친구가 농장에 왔어요.`,
        },
      ],
      lastVisited: Date.now(),
    };

    set(nextState);
    persistFarmState(nextState);
    return true;
  },

  checkUnlocks: () => {
    set((state) => {
      const evaluated = evaluateUnlocks({
        version: "1.0.0",
        resources: state.resources,
        animals: state.animals,
        crops: state.crops,
        unlockedAnimals: state.unlockedAnimals,
        unlockedCrops: state.unlockedCrops,
        farmLevel: state.farmLevel,
        decorations: state.decorations,
        totalPuzzlesSolved: state.totalPuzzlesSolved,
        clearedThemes: state.clearedThemes,
        lastVisited: state.lastVisited,
        tutorialSeen: state.tutorialSeen,
      });

      const nextState = {
        ...state,
        unlockedAnimals: evaluated.unlockedAnimals,
        unlockedCrops: evaluated.unlockedCrops,
        farmLevel: evaluated.farmLevel,
        recentUnlocks: evaluated.unlockEvents,
      };

      persistFarmState(nextState);
      return nextState;
    });
  },

  dismissGrowthEvent: (id) =>
    set((state) => ({
      recentGrowthEvents: state.recentGrowthEvents.filter((event) => event.id !== id),
    })),

  dismissUnlockEvent: (id) =>
    set((state) => ({
      recentUnlocks: state.recentUnlocks.filter((event) => event.id !== id),
    })),

  markTutorialSeen: () =>
    set((state) => {
      const nextState = { ...state, tutorialSeen: true };
      persistFarmState(nextState);
      return nextState;
    }),

  resetFarm: () => {
    const reset = getInitialFarmState();
    const nextState = {
      ...get(),
      ...reset,
      sessionStartedAt: Date.now(),
      recentGrowthEvents: [],
      recentUnlocks: [],
    };
    set(nextState);
    persistFarmState(nextState);
  },
}));
