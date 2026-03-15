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

  // actions
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

function buildInitialPieces(level: PuzzleLevel): PieceState[] {
  // Place pieces in a tray area (below puzzle board, spread horizontally)
  const trayY = 500;
  return level.allowedPieces.map((id, i) => ({
    id,
    x: 40 + i * 80,
    y: trayY,
    rotation: 0,
    flipped: false,
    isPlaced: false,
    isSelected: false,
  }));
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
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
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
