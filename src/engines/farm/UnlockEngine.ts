import { UNLOCK_DEFINITIONS } from "@/engines/farm/FarmEngine";
import type { FarmSaveData, UnlockCondition, UnlockEvent } from "@/types/farm.types";

function isConditionMet(condition: UnlockCondition, farm: FarmSaveData): boolean {
  switch (condition.type) {
    case "puzzle_count":
      return farm.totalPuzzlesSolved >= condition.count;
    case "theme_clear":
      return farm.clearedThemes.includes(condition.theme);
    case "farm_level":
      return farm.farmLevel >= condition.level;
    default:
      return false;
  }
}

export function evaluateUnlocks(farm: FarmSaveData): {
  unlockedAnimals: FarmSaveData["unlockedAnimals"];
  unlockedCrops: FarmSaveData["unlockedCrops"];
  farmLevel: number;
  unlockEvents: UnlockEvent[];
} {
  const unlockedAnimals = [...farm.unlockedAnimals];
  const unlockedCrops = [...farm.unlockedCrops];
  let farmLevel = farm.farmLevel;
  const unlockEvents: UnlockEvent[] = [];

  for (const [species, condition] of Object.entries(UNLOCK_DEFINITIONS.animals)) {
    if (!unlockedAnimals.includes(species as never) && isConditionMet(condition, farm)) {
      unlockedAnimals.push(species as never);
      unlockEvents.push({
        id: `unlock-animal-${species}`,
        label: "새 동물 열림",
        description: `${species} 동물을 돌볼 수 있게 되었어요.`,
      });
    }
  }

  for (const [species, condition] of Object.entries(UNLOCK_DEFINITIONS.crops)) {
    if (!unlockedCrops.includes(species as never) && isConditionMet(condition, farm)) {
      unlockedCrops.push(species as never);
      unlockEvents.push({
        id: `unlock-crop-${species}`,
        label: "새 작물 열림",
        description: `${species} 씨앗을 심을 수 있게 되었어요.`,
      });
    }
  }

  for (const [key, condition] of Object.entries(UNLOCK_DEFINITIONS.farmExpansion)) {
    const level = Number(key.replace("level", ""));
    if (level > farmLevel && isConditionMet(condition, farm)) {
      farmLevel = level;
      unlockEvents.push({
        id: `unlock-farm-${level}`,
        label: "농장 확장",
        description: `농장이 ${level}단계로 넓어졌어요.`,
      });
    }
  }

  return {
    unlockedAnimals,
    unlockedCrops,
    farmLevel,
    unlockEvents,
  };
}
