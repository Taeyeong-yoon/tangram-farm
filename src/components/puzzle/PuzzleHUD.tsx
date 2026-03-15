import { useEffect, useRef } from 'react';
import { usePuzzleStore } from '@/stores/puzzleStore';
import { useProgressStore } from '@/stores/progressStore';

interface PuzzleHUDProps {
  onHint: () => void;
  onReset: () => void;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function PuzzleHUD({ onHint, onReset }: PuzzleHUDProps) {
  const { currentLevel, hintsUsed, startTime, tick } = usePuzzleStore();
  const { getBestScore } = useProgressStore();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function update() {
      tick(Date.now() - startTime);
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [startTime, tick]);

  const { elapsedMs } = usePuzzleStore.getState();
  const bestScore = currentLevel ? getBestScore(currentLevel.id) : 0;
  const maxHints = currentLevel?.hints.length ?? 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, marginBottom: 8,
    }}>
      <div style={{ color: '#fff', fontSize: 13 }}>
        <div style={{ opacity: 0.6, fontSize: 10 }}>레벨</div>
        <div style={{ fontWeight: 700 }}>#{currentLevel?.id ?? '-'} {currentLevel?.nameKo}</div>
      </div>
      <div style={{ color: '#fff', fontSize: 13, textAlign: 'center' }}>
        <div style={{ opacity: 0.6, fontSize: 10 }}>시간</div>
        <div>{formatTime(elapsedMs)}</div>
      </div>
      {bestScore > 0 && (
        <div style={{ color: '#F5A623', fontSize: 13, textAlign: 'center' }}>
          <div style={{ opacity: 0.6, fontSize: 10, color: '#fff' }}>최고</div>
          <div>{bestScore}</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onHint}
          disabled={hintsUsed >= maxHints}
          style={{
            background: hintsUsed >= maxHints ? 'rgba(255,255,255,0.05)' : 'rgba(245,166,35,0.2)',
            border: '1px solid rgba(245,166,35,0.4)',
            color: hintsUsed >= maxHints ? 'rgba(255,255,255,0.3)' : '#F5A623',
            borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: hintsUsed >= maxHints ? 'not-allowed' : 'pointer',
          }}
        >
          💡 힌트 ({maxHints - hintsUsed})
        </button>
        <button
          onClick={onReset}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer',
          }}
        >
          ↺ 초기화
        </button>
      </div>
    </div>
  );
}
