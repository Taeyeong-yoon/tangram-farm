import type { FarmSaveData } from '@/types/farm.types';

const STORAGE_VERSION = 'v1';
const BACKUP_KEY = 'tangram-farm-backup';

export interface SaveData {
  version: string;
  progress: {
    clearedLevels: number[];
    bestScores: Record<number, number>;
    hintsUsedTotal: number;
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: string;
    language: string;
  };
  farm?: FarmSaveData;
  lastSaved: number;
}

function isValidSaveData(data: unknown): data is SaveData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return d.version === STORAGE_VERSION && typeof d.lastSaved === 'number';
}

export function saveData(data: Partial<SaveData>): boolean {
  const payload: SaveData = {
    version: STORAGE_VERSION,
    progress: { clearedLevels: [], bestScores: {}, hintsUsedTotal: 0 },
    settings: { soundEnabled: true, musicEnabled: false, difficulty: 'normal', language: 'ko' },
    lastSaved: Date.now(),
    ...data,
  };

  let attempts = 0;
  while (attempts < 3) {
    try {
      const serialized = JSON.stringify(payload);
      localStorage.setItem('tangram-farm-save', serialized);
      // Keep rolling backup
      localStorage.setItem(BACKUP_KEY, serialized);
      return true;
    } catch {
      attempts++;
    }
  }
  return false;
}

export function loadData(): SaveData | null {
  try {
    const raw = localStorage.getItem('tangram-farm-save');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValidSaveData(parsed)) return parsed;

    // Try backup
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      const parsedBackup = JSON.parse(backup);
      if (isValidSaveData(parsedBackup)) return parsedBackup;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearData(): void {
  localStorage.removeItem('tangram-farm-save');
  localStorage.removeItem(BACKUP_KEY);
}

export function migrateData(data: Record<string, unknown>): SaveData | null {
  // Future migration logic here
  if (data.version === STORAGE_VERSION) return data as unknown as SaveData;
  return null;
}
