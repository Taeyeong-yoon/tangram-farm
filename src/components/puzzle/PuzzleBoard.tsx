import { useRef, useEffect } from 'react';
import type { PuzzleLevel } from '@/types/puzzle.types';
import { usePuzzleStore } from '@/stores/puzzleStore';
import PuzzlePiece from './PuzzlePiece';

const BOARD_SIZE = 400;

interface PuzzleBoardProps {
  level: PuzzleLevel;
}

export default function PuzzleBoard({ level }: PuzzleBoardProps) {
  const { pieces, selectPiece } = usePuzzleStore();
  const boardRef = useRef<SVGSVGElement>(null);
  const boardOffset = { x: 0, y: 0 };

  useEffect(() => {
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      boardOffset.x = rect.left;
      boardOffset.y = rect.top;
    }
  });

  return (
    <div className="puzzle-board-container" style={{ width: '100%', maxWidth: BOARD_SIZE, margin: '0 auto' }}>
      <svg
        ref={boardRef}
        width="100%"
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE + 160}`}
        style={{ display: 'block', background: '#1a1a2e', borderRadius: 16, touchAction: 'none' }}
        onClick={() => selectPiece(null)}
      >
        {/* Board background */}
        <rect x={0} y={0} width={BOARD_SIZE} height={BOARD_SIZE} fill="#16213e" rx={12} />

        {/* Target silhouette */}
        <g transform={`translate(${BOARD_SIZE / 2 - 100}, ${BOARD_SIZE / 2 - 100})`}>
          <path
            d={level.targetShape.outline}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={2}
            strokeDasharray="6,4"
          />
        </g>

        {/* Puzzle pieces */}
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} boardOffset={boardOffset} />
        ))}

        {/* Tray separator */}
        <line x1={0} y1={BOARD_SIZE + 10} x2={BOARD_SIZE} y2={BOARD_SIZE + 10} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x={BOARD_SIZE / 2} y={BOARD_SIZE + 28} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11}>
          조각을 드래그하거나 탭하여 회전하세요
        </text>
      </svg>
    </div>
  );
}
