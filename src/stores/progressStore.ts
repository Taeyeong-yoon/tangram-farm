import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LevelRecord {
  cleared: boolean;
  bestScore: number;
  hintsUsed: number;
  clearedAt: number;
  clearCount: number;
}

interface ProgressStore {
  records: Record<number, LevelRecord>;
  totalHintsUsed: number;
  recordClear: (levelId: number, score: number, hintsUsed: number) => number;
  isCleared: (levelId: number) => boolean;
  getBestScore: (levelId: number) => number;
  getClearCount: (levelId: number) => number;
  getUnlockedLevels: () => number[];
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      records: {},
      totalHintsUsed: 0,

      recordClear: (levelId, score, hintsUsed) => {
        const existing = get().records[levelId];
        const bestScore = existing ? Math.max(existing.bestScore, score) : score;
        const clearCount = (existing?.clearCount ?? 0) + 1;
        set((state) => ({
          records: {
            ...state.records,
            [levelId]: { cleared: true, bestScore, hintsUsed, clearedAt: Date.now(), clearCount },
          },
          totalHintsUsed: state.totalHintsUsed + hintsUsed,
        }));
        return clearCount;
      },

      isCleared: (levelId) => Boolean(get().records[levelId]?.cleared),

      getBestScore: (levelId) => get().records[levelId]?.bestScore ?? 0,

      getClearCount: (levelId) => get().records[levelId]?.clearCount ?? 0,

      getUnlockedLevels: () => {
        const { records } = get();
        const clearedIds = Object.entries(records)
          .filter(([, r]) => r.cleared)
          .map(([id]) => Number(id));
        const maxCleared = clearedIds.length > 0 ? Math.max(...clearedIds) : 0;
        // Unlock up to 3 levels ahead
        const unlocked: number[] = [];
        for (let i = 1; i <= maxCleared + 3; i++) unlocked.push(i);
        return unlocked;
      },
    }),
    { name: 'tangram-farm-progress-v1' }
  )
);
