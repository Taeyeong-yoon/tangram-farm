import type { HintStep } from '@/types/puzzle.types';

interface HintOverlayProps {
  hint: HintStep | null;
  onClose: () => void;
}

export default function HintOverlay({ hint, onClose }: HintOverlayProps) {
  if (!hint) return null;

  const levelColor = hint.level === 1 ? '#7ED321' : hint.level === 2 ? '#F5A623' : '#E25D5D';
  const levelLabel = hint.level === 1 ? '기본 힌트' : hint.level === 2 ? '구역 힌트' : '위치 힌트';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1a2e', borderRadius: 16, padding: 24, maxWidth: 320, width: '100%',
          border: `2px solid ${levelColor}40`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <span style={{ color: levelColor, fontWeight: 700, fontSize: 14 }}>{levelLabel}</span>
        </div>
        <p style={{ color: '#e0e0e0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{hint.description}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: 16, width: '100%', background: levelColor + '22', border: `1px solid ${levelColor}66`,
            color: levelColor, borderRadius: 8, padding: '10px 0', fontSize: 14, cursor: 'pointer',
          }}
        >
          알겠어요!
        </button>
      </div>
    </div>
  );
}
