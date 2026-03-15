import { PIECE_DEFINITIONS } from '@/data/pieces';
import { usePuzzleStore } from '@/stores/puzzleStore';
import { transformPolygon, pointsToSvgString, getBoundingBox } from '@/engines/puzzle/PieceTransform';

export default function PieceTray() {
  const { pieces, selectedPieceId, selectPiece } = usePuzzleStore();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: '12px 8px' }}>
      {pieces.map((piece) => {
        const def = PIECE_DEFINITIONS[piece.id];
        if (!def) return null;
        const pts = transformPolygon(def.points, 0, false);
        const bb = getBoundingBox(pts);
        const pad = 8;
        const isSelected = selectedPieceId === piece.id;

        return (
          <button
            key={piece.id}
            onClick={() => selectPiece(isSelected ? null : piece.id)}
            style={{
              width: 56,
              height: 56,
              background: isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
              border: isSelected ? '2px solid #3B82F6' : '2px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={def.label}
            title={def.label}
          >
            <svg
              width={44}
              height={44}
              viewBox={`${bb.minX - pad} ${bb.minY - pad} ${bb.width + pad * 2} ${bb.height + pad * 2}`}
            >
              <polygon
                points={pointsToSvgString(pts)}
                fill={def.color}
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.9}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
