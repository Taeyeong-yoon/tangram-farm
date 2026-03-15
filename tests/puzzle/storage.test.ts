import { describe, it, expect, beforeEach } from 'vitest';
import { saveData, loadData, clearData } from '@/utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('storage', () => {
  beforeEach(() => localStorageMock.clear());

  it('saveData and loadData round trip', () => {
    const data = {
      progress: { clearedLevels: [1, 2, 3], bestScores: { 1: 900 }, hintsUsedTotal: 2 },
    };
    expect(saveData(data)).toBe(true);
    const loaded = loadData();
    expect(loaded).not.toBeNull();
    expect(loaded?.progress.clearedLevels).toEqual([1, 2, 3]);
    expect(loaded?.progress.bestScores[1]).toBe(900);
  });

  it('loadData returns null when nothing saved', () => {
    expect(loadData()).toBeNull();
  });

  it('clearData removes save', () => {
    saveData({});
    clearData();
    expect(loadData()).toBeNull();
  });
});
