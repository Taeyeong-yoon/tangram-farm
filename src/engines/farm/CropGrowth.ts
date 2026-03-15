import { createFarmId, getCropDefinition, getNextEmptyPlot, getStageLabel } from "@/engines/farm/FarmEngine";
import type { CropSpecies, CropState, GrowthEvent, RewardPayload } from "@/types/farm.types";

const PUZZLE_GROWTH_STEP = 25;

interface CropAdvanceResult {
  crops: CropState[];
  growthEvents: GrowthEvent[];
}

interface PlantCropResult {
  crop: CropState | null;
  plotIndex: number | null;
}

export function advanceCropsFromPuzzle(crops: CropState[]): CropAdvanceResult {
  const growthEvents: GrowthEvent[] = [];

  const nextCrops = crops.map((crop) => {
    if (crop.stage === "ready") {
      return crop;
    }

    const definition = getCropDefinition(crop.species);
    const nextProgress = Math.min(100, crop.growthProgress + PUZZLE_GROWTH_STEP);
    const stageIndex = Math.min(
      definition.stages.length - 1,
      Math.floor((nextProgress / 100) * definition.stages.length),
    );
    const nextStage = definition.stages[stageIndex] ?? "ready";
    const stageChanged = nextStage !== crop.stage;

    if (stageChanged) {
      growthEvents.push({
        id: createFarmId("growth"),
        kind: "crop",
        nameKo: definition.nameKo,
        description:
          nextStage === "ready"
            ? `${definition.nameKo}이(가) 수확 준비를 마쳤어요.`
            : `${definition.nameKo}이(가) ${getStageLabel(
                definition.stageNames,
                stageIndex,
                nextStage,
              )} 단계로 자랐어요.`,
      });
    }

    return {
      ...crop,
      growthProgress: nextProgress,
      stage: nextStage,
    };
  });

  return {
    crops: nextCrops,
    growthEvents,
  };
}

export function plantCrop(
  crops: CropState[],
  species: CropSpecies,
  requestedPlotIndex?: number,
  now = Date.now(),
): PlantCropResult {
  const definition = getCropDefinition(species);
  const plotIndex =
    requestedPlotIndex !== undefined && !crops.some((crop) => crop.plotIndex === requestedPlotIndex)
      ? requestedPlotIndex
      : getNextEmptyPlot(crops);

  if (plotIndex === null) {
    return { crop: null, plotIndex: null };
  }

  return {
    plotIndex,
    crop: {
      id: createFarmId("crop"),
      species,
      stage: definition.stages[0],
      growthProgress: 0,
      plantedAt: now,
      plotIndex,
    },
  };
}

export function harvestCrop(crops: CropState[], cropId: string): { crops: CropState[]; reward: RewardPayload | null } {
  const target = crops.find((crop) => crop.id === cropId);

  if (!target || target.stage !== "ready") {
    return { crops, reward: null };
  }

  const definition = getCropDefinition(target.species);

  return {
    crops: crops.filter((crop) => crop.id !== cropId),
    reward: definition.harvestReward,
  };
}
