import { describe, it, expect } from 'vitest';
import { rotatePoint, flipPoint, getBoundingBox, normalizePolygon } from '@/engines/puzzle/PieceTransform';

describe('PieceTransform', () => {
  it('rotatePoint 90 degrees', () => {
    const p = { x: 10, y: 0 };
    const r = rotatePoint(p, 90);
    expect(r.x).toBeCloseTo(0, 0);
    expect(r.y).toBeCloseTo(10, 0);
  });

  it('rotatePoint 180 degrees', () => {
    const p = { x: 10, y: 5 };
    const r = rotatePoint(p, 180);
    expect(r.x).toBeCloseTo(-10, 0);
    expect(r.y).toBeCloseTo(-5, 0);
  });

  it('flipPoint negates x', () => {
    const p = { x: 10, y: 5 };
    const r = flipPoint(p);
    expect(r.x).toBe(-10);
    expect(r.y).toBe(5);
  });

  it('getBoundingBox calculates correctly', () => {
    const points = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }];
    const bb = getBoundingBox(points);
    expect(bb.width).toBe(100);
    expect(bb.height).toBe(100);
    expect(bb.minX).toBe(0);
    expect(bb.minY).toBe(0);
  });

  it('normalizePolygon shifts to origin', () => {
    const points = [{ x: 50, y: 50 }, { x: 150, y: 50 }, { x: 50, y: 150 }];
    const norm = normalizePolygon(points);
    expect(norm[0]).toEqual({ x: 0, y: 0 });
  });
});
