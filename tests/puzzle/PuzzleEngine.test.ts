import { describe, it, expect } from 'vitest';
import { isPieceCorrect, checkSolution, calculateScore } from '@/engines/puzzle/PuzzleEngine';
import type { PieceState, PuzzleLevel } from '@/types/puzzle.types';

const mockLevel: PuzzleLevel = {
  id: 1, theme: 'object', name: 'Square', nameKo: '사각형', difficulty: 1, gradeGroup: 'low',
  targetShape: { outline: 'M0,0 L100,0 L100,100 L0,100 Z', viewBox: '0 0 100 100' },
  solution: [
    { pieceId: 'sm_tri_1', x: 100, y: 100, rotation: 0, flipped: false },
    { pieceId: 'sm_tri_2', x: 150, y: 100, rotation: 90, flipped: false },
  ],
  allowedPieces: ['sm_tri_1', 'sm_tri_2'],
  hints: [
    { level: 1, description: '두 삼각형을 붙여보세요' },
    { level: 2, description: '작은 삼각형들이 마주보게 배치하세요' },
    { level: 3, description: '왼쪽 위에 첫 번째, 오른쪽에 두 번째' },
  ],
  reward: { seeds: 2, feed: 1 },
};

describe('PuzzleEngine', () => {
  it('passes when piece is within tolerance', () => {
    const piece: PieceState = {
      id: 'sm_tri_1', x: 105, y: 108, rotation: 5, flipped: false,
      isPlaced: false, isSelected: false,
    };
    expect(isPieceCorrect(piece, mockLevel)).toBe(true);
  });

  it('fails when piece is outside position tolerance', () => {
    const piece: PieceState = {
      id: 'sm_tri_1', x: 150, y: 100, rotation: 0, flipped: false,
      isPlaced: false, isSelected: false,
    };
    expect(isPieceCorrect(piece, mockLevel)).toBe(false);
  });

  it('fails when rotation is off', () => {
    const piece: PieceState = {
      id: 'sm_tri_1', x: 100, y: 100, rotation: 45, flipped: false,
      isPlaced: false, isSelected: false,
    };
    expect(isPieceCorrect(piece, mockLevel)).toBe(false);
  });

  it('checkSolution returns true when all pieces match', () => {
    const pieces: PieceState[] = [
      { id: 'sm_tri_1', x: 100, y: 100, rotation: 0, flipped: false, isPlaced: true, isSelected: false },
      { id: 'sm_tri_2', x: 150, y: 100, rotation: 90, flipped: false, isPlaced: true, isSelected: false },
    ];
    expect(checkSolution(pieces, mockLevel)).toBe(true);
  });

  it('calculates score correctly', () => {
    expect(calculateScore(0, 0)).toBe(1000);
    expect(calculateScore(30000, 0)).toBe(970);  // 30s → -30
    expect(calculateScore(0, 2)).toBe(900);       // 2 hints → -100
    expect(calculateScore(100000, 5)).toBe(650);  // 100s→-100, 5 hints→-250
  });
});
