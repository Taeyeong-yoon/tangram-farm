import { useEffect, useState } from 'react';
import { calculatePuzzleReward } from '@/engines/farm/RewardEngine';
import { calculateScore } from '@/engines/puzzle/PuzzleEngine';
import { useFarmStore } from '@/stores/farmStore';
import { usePuzzleStore } from '@/stores/puzzleStore';
import { useProgressStore } from '@/stores/progressStore';

interface SuccessModalProps {
  onNext: () => void;
  onReplay: () => void;
}

function StarRating({ score }: { score: number }) {
  const stars = score >= 800 ? 3 : score >= 500 ? 2 : 1;
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ fontSize: 36, filter: i <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function SuccessModal({ onNext, onReplay }: SuccessModalProps) {
  const { currentLevel, hintsUsed, elapsedMs } = usePuzzleStore();
  const { recordClear } = useProgressStore();
  const { receiveReward } = useFarmStore();
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reward, setReward] = useState({ seeds: 0, feed: 0, coins: 0 });

  useEffect(() => {
    const s = calculateScore(elapsedMs, hintsUsed);
    setScore(s);

    if (currentLevel) {
      const clearCount = recordClear(currentLevel.id, s, hintsUsed);
      const nextReward = calculatePuzzleReward(
        currentLevel.difficulty,
        Math.min(hintsUsed, 3) as 0 | 1 | 2 | 3,
        clearCount,
      );
      setReward(nextReward);
      receiveReward(nextReward, { theme: currentLevel.theme });
    }

    const timer = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(timer);
  }, []);

  if (!currentLevel) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: 20,
          padding: 32,
          maxWidth: 360,
          width: '100%',
          border: '2px solid rgba(255,255,255,0.1)',
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48 }}>🎉</div>
        <h2 style={{ color: '#fff', fontSize: 22, margin: '8px 0 4px' }}>완성!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{currentLevel.nameKo}</p>

        <StarRating score={score} />

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#F5A623', fontSize: 20, fontWeight: 700 }}>{score}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>점수</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#7ED321', fontSize: 20, fontWeight: 700 }}>+{reward.seeds}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>씨앗</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4F86C6', fontSize: 20, fontWeight: 700 }}>+{reward.feed}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>먹이</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#F472B6', fontSize: 20, fontWeight: 700 }}>+{reward.coins}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>코인</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onReplay}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: 10,
              padding: '12px 0',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            다시 하기
          </button>
          <button
            onClick={onNext}
            style={{
              flex: 2,
              background: 'linear-gradient(135deg, #4F86C6, #7ED321)',
              border: 'none',
              color: '#fff',
              borderRadius: 10,
              padding: '12px 0',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            다음 레벨
          </button>
        </div>
      </div>
    </div>
  );
}
