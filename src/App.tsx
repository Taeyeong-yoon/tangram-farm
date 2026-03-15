import { useEffect, useState } from 'react';
import { FarmView } from '@/components/farm/FarmView';
import HintOverlay from '@/components/puzzle/HintOverlay';
import PieceTray from '@/components/puzzle/PieceTray';
import PuzzleBoard from '@/components/puzzle/PuzzleBoard';
import PuzzleHUD from '@/components/puzzle/PuzzleHUD';
import SuccessModal from '@/components/puzzle/SuccessModal';
import levelsData from '@/data/puzzles/level_001_050.json';
import { useProgressStore } from '@/stores/progressStore';
import { usePuzzleStore } from '@/stores/puzzleStore';
import type { HintStep, PuzzleLevel } from '@/types/puzzle.types';
import './App.css';

const levels = levelsData as PuzzleLevel[];

export default function App() {
  const { loadLevel, currentLevel, isComplete, useHint, resetPuzzle } = usePuzzleStore();
  const { isCleared } = useProgressStore();
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [activeHint, setActiveHint] = useState<HintStep | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  useEffect(() => {
    const level = levels.find((item) => item.id === currentLevelId);
    if (level) {
      loadLevel(level);
      setShowSuccess(false);
      setActiveHint(null);
    }
  }, [currentLevelId, loadLevel]);

  useEffect(() => {
    if (isComplete && !showSuccess) {
      const timer = window.setTimeout(() => setShowSuccess(true), 400);
      return () => window.clearTimeout(timer);
    }
  }, [isComplete, showSuccess]);

  function handleHint() {
    const hint = useHint();
    if (hint) {
      setActiveHint(hint);
    }
  }

  function handleNextLevel() {
    setShowSuccess(false);
    setCurrentLevelId((prev) => Math.min(prev + 1, levels.length));
  }

  function handleReplay() {
    setShowSuccess(false);
    resetPuzzle();
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div>
          <p className="eyebrow">Tangram Farm</p>
          <h1>칠교 퍼즐과 성장 농장</h1>
          <p className="topbar-copy">Claude는 퍼즐 진행을, Codex는 보상과 농장 성장을 맡는 구조입니다.</p>
        </div>
        <button className="level-button" onClick={() => setShowLevelSelect((value) => !value)}>
          레벨 {currentLevelId} / {levels.length}
        </button>
      </header>

      {showLevelSelect ? (
        <section className="level-select-panel">
          {levels.map((level) => {
            const cleared = isCleared(level.id);
            const isCurrent = level.id === currentLevelId;

            return (
              <button
                key={level.id}
                className={`level-tile${isCurrent ? ' active' : ''}${cleared ? ' cleared' : ''}`}
                onClick={() => {
                  setCurrentLevelId(level.id);
                  setShowLevelSelect(false);
                }}
              >
                <strong>{level.id}</strong>
                <span>{level.nameKo}</span>
                <small>{'★'.repeat(level.difficulty)}</small>
              </button>
            );
          })}
        </section>
      ) : null}

      <main className="app-grid">
        <section className="puzzle-shell">
          {currentLevel ? (
            <>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Puzzle Board</p>
                  <h2>{currentLevel.nameKo}</h2>
                </div>
              </div>
              <PuzzleHUD onHint={handleHint} onReset={resetPuzzle} />
              <PuzzleBoard level={currentLevel} />
              <PieceTray />
            </>
          ) : null}
        </section>

        <aside className="farm-panel">
          <FarmView />
        </aside>
      </main>

      <HintOverlay hint={activeHint} onClose={() => setActiveHint(null)} />
      {showSuccess && currentLevel ? <SuccessModal onNext={handleNextLevel} onReplay={handleReplay} /> : null}
    </div>
  );
}
