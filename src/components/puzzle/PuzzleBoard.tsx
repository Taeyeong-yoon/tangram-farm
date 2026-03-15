import { useRef } from 'react';
import type { PuzzleLevel } from '@/types/puzzle.types';
import { usePuzzleStore } from '@/stores/puzzleStore';
import PuzzlePiece from './PuzzlePiece';

export const BOARD_W = 560;
export const BOARD_H = 560;
export const TRAY_H = 170;
export const TOTAL_H = BOARD_H + TRAY_H;

interface PuzzleBoardProps {
  level: PuzzleLevel;
}

export default function PuzzleBoard({ level }: PuzzleBoardProps) {
  const { pieces, selectPiece } = usePuzzleStore();
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div style={{ width: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${BOARD_W} ${TOTAL_H}`}
        style={{ display: 'block', borderRadius: 20, touchAction: 'none', background: '#0d1b2e' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) selectPiece(null); }}
      >
        <rect x={0} y={0} width={BOARD_W} height={BOARD_H} fill="#0d1b2e" />
        <rect x={4} y={4} width={BOARD_W - 8} height={BOARD_H - 8}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} rx={8} />
        <g transform={`translate(${BOARD_W / 2 - 100}, ${BOARD_H / 2 - 100})`}>
          <path d={level.targetShape.outline}
            fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.3)"
            strokeWidth={2} strokeDasharray="8,5" />
        </g>
        <line x1={0} y1={BOARD_H} x2={BOARD_W} y2={BOARD_H}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <rect x={0} y={BOARD_H} width={BOARD_W} height={TRAY_H} fill="rgba(0,0,0,0.25)" />
        <text x={BOARD_W / 2} y={BOARD_H + 20}
          textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={12}>
          드래그로 이동 · 탭으로 45° 회전
        </text>
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} svgRef={svgRef} />
        ))}
      </svg>
    </div>
  );
}
