import type { FarmResources } from "@/types/farm.types";

interface ResourceBarProps {
  resources: FarmResources;
  totalPuzzlesSolved: number;
  farmLevel: number;
}

export function ResourceBar({ resources, totalPuzzlesSolved, farmLevel }: ResourceBarProps) {
  return (
    <div className="resource-bar">
      <div className="resource-pill">
        <span className="resource-icon">🌾</span>
        <div>
          <strong>{resources.seeds}</strong>
          <span>씨앗</span>
        </div>
      </div>
      <div className="resource-pill">
        <span className="resource-icon">🧺</span>
        <div>
          <strong>{resources.feed}</strong>
          <span>먹이</span>
        </div>
      </div>
      <div className="resource-pill">
        <span className="resource-icon">🪙</span>
        <div>
          <strong>{resources.coins}</strong>
          <span>코인</span>
        </div>
      </div>
      <div className="resource-pill">
        <span className="resource-icon">🧩</span>
        <div>
          <strong>{totalPuzzlesSolved}</strong>
          <span>푼 퍼즐</span>
        </div>
      </div>
      <div className="resource-pill">
        <span className="resource-icon">🏡</span>
        <div>
          <strong>Lv.{farmLevel}</strong>
          <span>농장</span>
        </div>
      </div>
    </div>
  );
}
