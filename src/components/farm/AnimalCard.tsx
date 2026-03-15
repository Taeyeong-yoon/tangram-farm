import { getAnimalDefinition } from "@/engines/farm/FarmEngine";
import type { AnimalState } from "@/types/farm.types";

const stageEmoji: Record<string, string> = {
  egg: "🥚",
  baby: "🐣",
  young: "🐥",
  adult: "🐔",
};

interface AnimalCardProps {
  animal: AnimalState;
  feedAvailable: number;
  onFeed: (animalId: string) => void;
}

export function AnimalCard({ animal, feedAvailable, onFeed }: AnimalCardProps) {
  const definition = getAnimalDefinition(animal.species);
  const stageIndex = definition.stages.indexOf(animal.stage);
  const progressPercent =
    animal.feedRequired > 0 ? Math.min(100, Math.round((animal.feedProgress / animal.feedRequired) * 100)) : 100;

  return (
    <article className="farm-card animal-card">
      <div className="farm-card-top">
        <div>
          <p className="eyebrow">동물 친구</p>
          <h3>{definition.nameKo}</h3>
        </div>
        <div className="emoji-stage">{stageEmoji[animal.stage] ?? "🐾"}</div>
      </div>
      <p className="muted">{definition.stageNames[stageIndex] ?? animal.stage}</p>
      <div className="progress-track" aria-label="동물 성장">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="small-copy">
        먹이 {animal.feedProgress} / {animal.feedRequired || "완료"}
      </p>
      <button className="primary-button" onClick={() => onFeed(animal.id)} disabled={feedAvailable <= 0 || animal.stage === "adult"}>
        먹이 1 주기
      </button>
    </article>
  );
}
