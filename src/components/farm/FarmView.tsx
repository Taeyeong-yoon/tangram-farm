import { ANIMAL_DEFINITIONS, MAX_PLOTS, getAnimalDefinition } from "@/engines/farm/FarmEngine";
import { useFarmStore } from "@/stores/farmStore";
import { getBreakMessage, shouldSuggestBreak } from "@/utils/safetyGuards";
import type { AnimalSpecies } from "@/types/farm.types";
import { AnimalCard } from "./AnimalCard";
import { CropPlot } from "./CropPlot";
import { FarmTutorial } from "./FarmTutorial";
import { GrowthModal } from "./GrowthModal";
import { ResourceBar } from "./ResourceBar";
import { UnlockNotice } from "./UnlockNotice";

export function FarmView() {
  const {
    resources,
    animals,
    crops,
    unlockedAnimals,
    unlockedCrops,
    farmLevel,
    totalPuzzlesSolved,
    tutorialSeen,
    sessionStartedAt,
    recentGrowthEvents,
    recentUnlocks,
    feedAnimal,
    plantCrop,
    harvestCrop,
    breedAnimals,
    dismissGrowthEvent,
    dismissUnlockEvent,
    markTutorialSeen,
  } = useFarmStore();

  const breakSuggestion = shouldSuggestBreak(sessionStartedAt);

  return (
    <section className="farm-shell">
      <div className="farm-header">
        <div>
          <p className="eyebrow">Codex Farm System</p>
          <h2>농장 성장 보드</h2>
          <p className="muted">퍼즐 결과가 들어오면 여기서 작물과 동물이 함께 자라요.</p>
        </div>
      </div>

      <ResourceBar resources={resources} totalPuzzlesSolved={totalPuzzlesSolved} farmLevel={farmLevel} />

      {breakSuggestion ? <div className="break-banner">{getBreakMessage(totalPuzzlesSolved)}</div> : null}

      <div className="farm-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">동물 존</p>
            <h3>먹이를 줘서 키우기</h3>
          </div>
        </div>
        <div className="animal-grid">
          {unlockedAnimals.flatMap((species) => {
            const definition = getAnimalDefinition(species);
            const owned = animals.filter((animal) => animal.species === species);

            const cards = owned.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} feedAvailable={resources.feed} onFeed={(id) => feedAnimal(id, 1)} />
            ));

            if (definition.canBreed) {
              cards.push(
                <article className="farm-card" key={`${species}-breed`}>
                  <div className="farm-card-top">
                    <div>
                      <p className="eyebrow">확장</p>
                      <h3>{definition.nameKo}</h3>
                    </div>
                    <div className="emoji-stage">✨</div>
                  </div>
                  <p className="muted">어른 {definition.nameKo} 두 마리가 있으면 새 친구를 맞이할 수 있어요.</p>
                  <button className="secondary-button" onClick={() => breedAnimals(species as AnimalSpecies)}>
                    새 {definition.nameKo} 맞이하기
                  </button>
                </article>,
              );
            }

            return cards;
          })}

          {ANIMAL_DEFINITIONS.filter((animal) => !unlockedAnimals.includes(animal.species)).map((animal) => (
            <article className="farm-card locked-card" key={animal.species}>
              <p className="eyebrow">잠김</p>
              <h3>{animal.nameKo}</h3>
              <p className="muted">퍼즐을 더 풀면 열려요.</p>
            </article>
          ))}
        </div>
      </div>

      <div className="farm-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">작물 존</p>
            <h3>퍼즐로 자라는 밭</h3>
          </div>
        </div>
        <div className="crop-grid">
          {Array.from({ length: MAX_PLOTS }, (_, plotIndex) => (
            <CropPlot
              key={plotIndex}
              crop={crops.find((crop) => crop.plotIndex === plotIndex)}
              plotIndex={plotIndex}
              unlockedCrops={unlockedCrops}
              onPlant={plantCrop}
              onHarvest={harvestCrop}
            />
          ))}
        </div>
      </div>

      <FarmTutorial open={!tutorialSeen} onClose={markTutorialSeen} />
      <GrowthModal events={recentGrowthEvents} onDismiss={dismissGrowthEvent} />
      <UnlockNotice events={recentUnlocks} onDismiss={dismissUnlockEvent} />
    </section>
  );
}
