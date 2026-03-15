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
  const { currentLevel, hintsUsed, startTime, tick, selectedPieceId, rotatePiece, flipPiece } = usePuzzleStore();
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
  const hasSelected = selectedPieceId !== null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      padding: '10px 14px', background: 'rgba(0,0,0,0.35)', borderRadius: 14, marginBottom: 10,
    }}>
      {/* 레벨 */}
      <div style={{ color: '#fff', fontSize: 13, minWidth: 80 }}>
        <div style={{ opacity: 0.5, fontSize: 10 }}>레벨</div>
        <div style={{ fontWeight: 700 }}>#{currentLevel?.id} {currentLevel?.nameKo}</div>
      </div>

      {/* 타이머 */}
      <div style={{ color: '#fff', fontSize: 13, textAlign: 'center', flex: 1 }}>
        <div style={{ opacity: 0.5, fontSize: 10 }}>시간</div>
        <div>{formatTime(elapsedMs)}</div>
      </div>

      {bestScore > 0 && (
        <div style={{ color: '#F5A623', fontSize: 13, textAlign: 'center' }}>
          <div style={{ opacity: 0.5, fontSize: 10, color: '#fff' }}>최고</div>
          <div>{bestScore}</div>
        </div>
      )}

      {/* 조각 조작 버튼 (선택된 조각이 있을 때) */}
      {hasSelected && (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => selectedPieceId && rotatePiece(selectedPieceId)}
            style={btnStyle('#4f86c6')}
            title="45° 회전"
          >↺ 회전</button>
          <button
            onClick={() => selectedPieceId && flipPiece(selectedPieceId)}
            style={btnStyle('#7ed321')}
            title="좌우 뒤집기"
          >⇌ 뒤집기</button>
        </div>
      )}

      {/* 힌트 / 초기화 */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onHint}
          disabled={hintsUsed >= maxHints}
          style={btnStyle('#F5A623', hintsUsed >= maxHints)}
        >💡 ({maxHints - hintsUsed})</button>
        <button onClick={onReset} style={btnStyle('rgba(255,255,255,0.3)')}>↺</button>
      </div>
    </div>
  );
}

function btnStyle(color: string, disabled = false): React.CSSProperties {
  return {
    background: `${color}22`,
    border: `1px solid ${color}66`,
    color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
    borderRadius: 10,
    padding: '7px 12px',
    fontSize: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };
}
