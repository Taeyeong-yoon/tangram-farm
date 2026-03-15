import { getCropDefinition } from "@/engines/farm/FarmEngine";
import type { CropSpecies, CropState } from "@/types/farm.types";

const cropEmoji: Record<string, string> = {
  wheat: "🌾",
  corn: "🌽",
  carrot: "🥕",
  potato: "🥔",
};

interface CropPlotProps {
  crop: CropState | undefined;
  plotIndex: number;
  unlockedCrops: CropSpecies[];
  onPlant: (species: CropSpecies, plotIndex: number) => void;
  onHarvest: (cropId: string) => void;
}

export function CropPlot({ crop, plotIndex, unlockedCrops, onPlant, onHarvest }: CropPlotProps) {
  if (!crop) {
    return (
      <article className="farm-card crop-plot empty-plot">
        <div className="farm-card-top">
          <div>
            <p className="eyebrow">밭 {plotIndex + 1}</p>
            <h3>비어 있는 칸</h3>
          </div>
          <div className="emoji-stage">🟫</div>
        </div>
        <p className="muted">씨앗을 골라 심어 보세요.</p>
        <div className="crop-actions">
          {unlockedCrops.map((species) => (
            <button key={species} className="secondary-button" onClick={() => onPlant(species, plotIndex)}>
              {cropEmoji[species]} {getCropDefinition(species).nameKo}
            </button>
          ))}
        </div>
      </article>
    );
  }

  const definition = getCropDefinition(crop.species);

  return (
    <article className="farm-card crop-plot">
      <div className="farm-card-top">
        <div>
          <p className="eyebrow">밭 {plotIndex + 1}</p>
          <h3>{definition.nameKo}</h3>
        </div>
        <div className="emoji-stage">{cropEmoji[crop.species]}</div>
      </div>
      <p className="muted">{definition.stageNames[definition.stages.indexOf(crop.stage)] ?? crop.stage}</p>
      <div className="progress-track" aria-label="작물 성장">
        <div className="progress-fill crop-fill" style={{ width: `${crop.growthProgress}%` }} />
      </div>
      <p className="small-copy">퍼즐을 하나 풀면 25%씩 자라요.</p>
      <button className="primary-button" onClick={() => onHarvest(crop.id)} disabled={crop.stage !== "ready"}>
        수확하기
      </button>
    </article>
  );
}
