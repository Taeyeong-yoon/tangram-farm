import { create } from 'zustand';
import type { PieceState, PuzzleLevel, HintStep } from '@/types/puzzle.types';
import { checkSolution } from '@/engines/puzzle/PuzzleEngine';

interface PuzzleStore {
  currentLevel: PuzzleLevel | null;
  pieces: PieceState[];
  selectedPieceId: string | null;
  isComplete: boolean;
  hintsUsed: number;
  startTime: number;
  elapsedMs: number;

  loadLevel: (level: PuzzleLevel) => void;
  selectPiece: (id: string | null) => void;
  movePiece: (id: string, x: number, y: number) => void;
  rotatePiece: (id: string) => void;
  flipPiece: (id: string) => void;
  checkSolution: () => boolean;
  useHint: () => HintStep | null;
  resetPuzzle: () => void;
  tick: (ms: number) => void;
}

// BOARD_H=560, TRAY_H=170 → 트레이 y 범위: 560~730
function buildInitialPieces(level: PuzzleLevel): PieceState[] {
  const n = level.allowedPieces.length;
  const cols = Math.ceil(n / 2);
  return level.allowedPieces.map((id, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const spacing = cols > 1 ? 460 / (cols - 1) : 0;
    return {
      id,
      x: 50 + col * spacing,
      y: 590 + row * 70,
      rotation: 0,
      flipped: false,
      isPlaced: false,
      isSelected: false,
    };
  });
}

export const usePuzzleStore = create<PuzzleStore>((set, get) => ({
  currentLevel: null,
  pieces: [],
  selectedPieceId: null,
  isComplete: false,
  hintsUsed: 0,
  startTime: 0,
  elapsedMs: 0,

  loadLevel: (level) => {
    set({
      currentLevel: level,
      pieces: buildInitialPieces(level),
      selectedPieceId: null,
      isComplete: false,
      hintsUsed: 0,
      startTime: Date.now(),
      elapsedMs: 0,
    });
  },

  selectPiece: (id) => {
    set((state) => ({
      selectedPieceId: id,
      pieces: state.pieces.map((p) => ({ ...p, isSelected: p.id === id })),
    }));
  },

  movePiece: (id, x, y) => {
    set((state) => {
      const newPieces = state.pieces.map((p) =>
        p.id === id ? { ...p, x, y } : p
      );
      const isComplete = state.currentLevel
        ? checkSolution(newPieces, state.currentLevel)
        : false;
      return { pieces: newPieces, isComplete };
    });
  },

  rotatePiece: (id) => {
    set((state) => {
      const newPieces = state.pieces.map((p) =>
        // 45도씩 회전
        p.id === id ? { ...p, rotation: (p.rotation + 45) % 360 } : p
      );
      const isComplete = state.currentLevel
        ? checkSolution(newPieces, state.currentLevel)
        : false;
      return { pieces: newPieces, isComplete };
    });
  },

  flipPiece: (id) => {
    set((state) => ({
      pieces: state.pieces.map((p) =>
        p.id === id ? { ...p, flipped: !p.flipped } : p
      ),
    }));
  },

  checkSolution: () => {
    const { pieces, currentLevel } = get();
    if (!currentLevel) return false;
    const result = checkSolution(pieces, currentLevel);
    if (result) set({ isComplete: true });
    return result;
  },

  useHint: () => {
    const { currentLevel, hintsUsed } = get();
    if (!currentLevel) return null;
    const hint = currentLevel.hints[hintsUsed] ?? null;
    if (hint) set({ hintsUsed: hintsUsed + 1 });
    return hint;
  },

  resetPuzzle: () => {
    const { currentLevel } = get();
    if (!currentLevel) return;
    set({
      pieces: buildInitialPieces(currentLevel),
      selectedPieceId: null,
      isComplete: false,
      hintsUsed: 0,
      startTime: Date.now(),
      elapsedMs: 0,
    });
  },

  tick: (ms) => set({ elapsedMs: ms }),
}));
