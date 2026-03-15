import type { Point } from '@/types/puzzle.types';

export const POSITION_TOLERANCE = 15; // px
export const ANGLE_TOLERANCE = 10;    // degrees

/** Check if two numbers are within tolerance */
export function withinTolerance(a: number, b: number, tolerance: number): boolean {
  return Math.abs(a - b) <= tolerance;
}

/** Check if a position is close enough to target */
export function isPositionMatch(
  pos: Point,
  target: Point,
  tolerance = POSITION_TOLERANCE
): boolean {
  return withinTolerance(pos.x, target.x, tolerance) && withinTolerance(pos.y, target.y, tolerance);
}

/** Normalize angle to 0-360 range */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/** Check if angle is close enough to target (handles 0/360 wraparound) */
export function isAngleMatch(angle: number, target: number, tolerance = ANGLE_TOLERANCE): boolean {
  const a = normalizeAngle(angle);
  const b = normalizeAngle(target);
  const diff = Math.abs(a - b);
  return diff <= tolerance || diff >= (360 - tolerance);
}

/** Snap a position to grid (returns nearest grid point) */
export function snapToGrid(pos: Point, gridSize: number): Point {
  return {
    x: Math.round(pos.x / gridSize) * gridSize,
    y: Math.round(pos.y / gridSize) * gridSize,
  };
}

/** Snap angle to nearest allowed angle (0, 45, 90, 135, ...) */
export function snapToAngle(angle: number, step = 45): number {
  const normalized = normalizeAngle(angle);
  return Math.round(normalized / step) * step;
}
