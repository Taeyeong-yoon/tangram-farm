import { describe, it, expect } from 'vitest';
import { isPositionMatch, isAngleMatch, normalizeAngle, snapToAngle } from '@/engines/puzzle/SnapLogic';

describe('SnapLogic', () => {
  it('position within tolerance passes', () => {
    expect(isPositionMatch({ x: 100, y: 100 }, { x: 108, y: 112 })).toBe(true);
  });

  it('position outside tolerance fails', () => {
    expect(isPositionMatch({ x: 100, y: 100 }, { x: 120, y: 100 })).toBe(false);
  });

  it('angle match within tolerance', () => {
    expect(isAngleMatch(5, 0)).toBe(true);
    expect(isAngleMatch(89, 90)).toBe(true);
  });

  it('angle match handles 360/0 wraparound', () => {
    expect(isAngleMatch(355, 0)).toBe(true);
    expect(isAngleMatch(5, 360)).toBe(true);
  });

  it('normalizeAngle keeps in 0-360', () => {
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(-10)).toBe(350);
  });

  it('snapToAngle rounds to nearest step', () => {
    expect(snapToAngle(22, 45)).toBe(0);   // 22 < 22.5 → 0
    expect(snapToAngle(25, 45)).toBe(45);  // 25 >= 22.5 → 45
    expect(snapToAngle(67, 45)).toBe(45);  // 67/45≈1.49 → 45
  });
});
