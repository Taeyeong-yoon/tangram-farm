import { useRef, useCallback, type RefObject } from 'react';
import type { PieceState } from '@/types/puzzle.types';
import { PIECE_DEFINITIONS } from '@/data/pieces';
import { transformPolygon, translatePolygon, pointsToSvgString } from '@/engines/puzzle/PieceTransform';
import { usePuzzleStore } from '@/stores/puzzleStore';

interface PuzzlePieceProps {
  piece: PieceState;
  svgRef: RefObject<SVGSVGElement | null>;
}

function toSvgCoords(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };
  return pt.matrixTransform(ctm.inverse());
}

export default function PuzzlePiece({ piece, svgRef }: PuzzlePieceProps) {
  const { selectPiece, movePiece, rotatePiece, selectedPieceId } = usePuzzleStore();
  const isSelected = selectedPieceId === piece.id;
  const dragStart = useRef<{ svgX: number; svgY: number; pieceX: number; pieceY: number } | null>(null);
  const didMove = useRef(false);

  const def = PIECE_DEFINITIONS[piece.id];
  if (!def) return null;

  const transformed = transformPolygon(def.points, piece.rotation, piece.flipped);
  const translated = translatePolygon(transformed, piece.x, piece.y);
  const pointsStr = pointsToSvgString(translated);

  const cx = translated.reduce((s, p) => s + p.x, 0) / translated.length;
  const cy = translated.reduce((s, p) => s + p.y, 0) / translated.length;

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    selectPiece(piece.id);
    didMove.current = false;
    if (!svgRef.current) return;
    const { x, y } = toSvgCoords(svgRef.current, e.clientX, e.clientY);
    dragStart.current = { svgX: x, svgY: y, pieceX: piece.x, pieceY: piece.y };
  }, [piece.id, piece.x, piece.y, selectPiece, svgRef]);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGGElement>) => {
    if (!dragStart.current || !svgRef.current) return;
    e.preventDefault();
    const { x, y } = toSvgCoords(svgRef.current, e.clientX, e.clientY);
    const dx = x - dragStart.current.svgX;
    const dy = y - dragStart.current.svgY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didMove.current = true;
    movePiece(piece.id, dragStart.current.pieceX + dx, dragStart.current.pieceY + dy);
  }, [piece.id, movePiece, svgRef]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGGElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    // 드래그 없이 탭만 했으면 → 회전
    if (!didMove.current) {
      rotatePiece(piece.id);
    }
    dragStart.current = null;
  }, [piece.id, rotatePiece]);

  return (
    <g
      style={{ cursor: isSelected ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* 넓은 투명 히트 영역 */}
      <polygon points={pointsStr} fill="transparent" stroke="transparent" strokeWidth={16} />
      {/* 시각적 조각 */}
      <polygon
        points={pointsStr}
        fill={def.color}
        stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.4)'}
        strokeWidth={isSelected ? 3 : 1.5}
        opacity={isSelected ? 1 : 0.9}
        filter={isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : undefined}
      />
      {isSelected && (
        <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.95)" pointerEvents="none" />
      )}
    </g>
  );
}
