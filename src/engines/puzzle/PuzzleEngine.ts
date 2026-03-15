import type { PuzzleLevel, PieceState } from '@/types/puzzle.types';
import type { RewardPayload } from '@/types/farm.types';
import { transformPolygon, translatePolygon } from './PieceTransform';
import { isPositionMatch, isAngleMatch } from './SnapLogic';
import { PIECE_DEFINITIONS } from '@/data/pieces';

export const POSITION_TOLERANCE = 15;
export const ANGLE_TOLERANCE = 10;

/** Check if a single piece matches its solution placement */
export function isPieceCorrect(piece: PieceState, level: PuzzleLevel): boolean {
  const sol = level.solution.find((s) => s.pieceId === piece.id);
  if (!sol) return true; // piece not in this puzzle, ignore
  return (
    isPositionMatch({ x: piece.x, y: piece.y }, { x: sol.x, y: sol.y }, POSITION_TOLERANCE) &&
    isAngleMatch(piece.rotation, sol.rotation, ANGLE_TOLERANCE) &&
    piece.flipped === sol.flipped
  );
}

/** Check if all pieces in current level are correctly placed */
export function checkSolution(pieces: PieceState[], level: PuzzleLevel): boolean {
  return level.solution.every((sol) => {
    const piece = pieces.find((p) => p.id === sol.pieceId);
    if (!piece) return false;
    return isPieceCorrect(piece, level);
  });
}

/** Get piece definition polygon points in world space */
export function getPieceWorldPoints(piece: PieceState): { x: number; y: number }[] {
  const def = PIECE_DEFINITIONS[piece.id];
  if (!def) return [];
  const transformed = transformPolygon(def.points, piece.rotation, piece.flipped);
  return translatePolygon(transformed, piece.x, piece.y);
}

/** Calculate score based on time and hints used */
export function calculateScore(timeMs: number, hintsUsed: number): number {
  const baseScore = 1000;
  const timePenalty = Math.floor(timeMs / 10000) * 10; // -10 per 10 seconds
  const hintPenalty = hintsUsed * 50;
  return Math.max(0, baseScore - timePenalty - hintPenalty);
}

/** Build reward payload from level (called on puzzle success) */
export function buildReward(level: PuzzleLevel, score: number): RewardPayload {
  const multiplier = score >= 800 ? 2 : score >= 500 ? 1.5 : 1;
  return {
    seeds: Math.floor(level.reward.seeds * multiplier),
    feed: Math.floor(level.reward.feed * multiplier),
    coins: Math.floor(score / 100),
    specialItem: level.reward.special,
  };
}
