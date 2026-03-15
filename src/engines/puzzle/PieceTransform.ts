import type { Point } from '@/types/puzzle.types';

/** Rotate a point around the origin by degrees (0, 90, 180, 270) */
export function rotatePoint(p: Point, degrees: number): Point {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.round(Math.cos(rad));
  const sin = Math.round(Math.sin(rad));
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
  };
}

/** Flip a point horizontally */
export function flipPoint(p: Point): Point {
  return { x: -p.x, y: p.y };
}

/** Apply rotation then flip to all points of a polygon */
export function transformPolygon(points: Point[], rotation: number, flipped: boolean): Point[] {
  let result = points.map((p) => rotatePoint(p, rotation));
  if (flipped) result = result.map((p) => flipPoint(p));
  return result;
}

/** Translate all points by (dx, dy) */
export function translatePolygon(points: Point[], dx: number, dy: number): Point[] {
  return points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}

/** Get bounding box of a polygon */
export function getBoundingBox(points: Point[]): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/** Normalize polygon so bounding box starts at (0,0) */
export function normalizePolygon(points: Point[]): Point[] {
  const { minX, minY } = getBoundingBox(points);
  return points.map((p) => ({ x: p.x - minX, y: p.y - minY }));
}

/** Convert points array to SVG polygon points string */
export function pointsToSvgString(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}
