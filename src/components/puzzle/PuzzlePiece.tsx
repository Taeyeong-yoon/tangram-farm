import { useRef, useCallback } from 'react';
import type { PieceState } from '@/types/puzzle.types';
import { PIECE_DEFINITIONS } from '@/data/pieces';
import { transformPolygon, translatePolygon, pointsToSvgString } from '@/engines/puzzle/PieceTransform';
import { usePuzzleStore } from '@/stores/puzzleStore';

interface PuzzlePieceProps {
  piece: PieceState;
  boardOffset: { x: number; y: number };
}

export default function PuzzlePiece({ piece }: PuzzlePieceProps) {
  const { selectPiece, movePiece, rotatePiece, selectedPieceId } = usePuzzleStore();
  const isSelected = selectedPieceId === piece.id;
  const dragStart = useRef<{ clientX: number; clientY: number; pieceX: number; pieceY: number } | null>(null);

  const def = PIECE_DEFINITIONS[piece.id];
  if (!def) return null;

  const transformed = transformPolygon(def.points, piece.rotation, piece.flipped);
  const translated = translatePolygon(transformed, piece.x, piece.y);
  const pointsStr = pointsToSvgString(translated);

  // Center of piece for rotation tap detection
  const cx = translated.reduce((s, p) => s + p.x, 0) / translated.length;
  const cy = translated.reduce((s, p) => s + p.y, 0) / translated.length;

  function getClientPos(e: React.MouseEvent | React.TouchEvent) {
    if ('touches' in e) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    selectPiece(piece.id);
    const { clientX, clientY } = getClientPos(e);
    dragStart.current = { clientX, clientY, pieceX: piece.x, pieceY: piece.y };
  }, [piece.id, piece.x, piece.y, selectPiece]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart.current) return;
    e.preventDefault();
    const { clientX, clientY } = getClientPos(e);
    const dx = clientX - dragStart.current.clientX;
    const dy = clientY - dragStart.current.clientY;
    movePiece(piece.id, dragStart.current.pieceX + dx, dragStart.current.pieceY + dy);
  }, [piece.id, movePiece]);

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
  }, []);

  const handleTap = useCallback((e: React.MouseEvent) => {
    if (isSelected) {
      rotatePiece(piece.id);
    }
    e.stopPropagation();
  }, [isSelected, piece.id, rotatePiece]);

  return (
    <g
      className="puzzle-piece"
      style={{ cursor: isSelected ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onClick={handleTap}
    >
      <polygon
        points={pointsStr}
        fill={def.color}
        stroke={isSelected ? '#3B82F6' : '#fff'}
        strokeWidth={isSelected ? 3 : 1.5}
        opacity={isSelected ? 0.9 : 0.85}
        transform={isSelected ? `scale(1.03, 1.03) translate(${-cx * 0.03}, ${-cy * 0.03})` : undefined}
      />
      {isSelected && (
        <circle cx={cx} cy={cy} r={4} fill="#3B82F6" opacity={0.7} pointerEvents="none" />
      )}
    </g>
  );
}
