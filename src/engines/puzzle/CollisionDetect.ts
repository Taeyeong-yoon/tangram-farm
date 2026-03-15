import type { Point } from '@/types/puzzle.types';

/** Calculate cross product of vectors (B-A) and (C-A) */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** Check if point P is inside polygon (ray casting) */
export function pointInPolygon(p: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;
  let j = n - 1;
  for (let i = 0; i < n; i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect =
      yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
    j = i;
  }
  return inside;
}

/** Check if two line segments (A->B) and (C->D) intersect */
function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  if ((d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0)) return true;
  return false;
}

/** Check if two polygons overlap */
export function polygonsOverlap(polyA: Point[], polyB: Point[]): boolean {
  // Check if any edge of A intersects any edge of B
  const nA = polyA.length;
  const nB = polyB.length;
  for (let i = 0; i < nA; i++) {
    for (let j = 0; j < nB; j++) {
      if (segmentsIntersect(polyA[i], polyA[(i + 1) % nA], polyB[j], polyB[(j + 1) % nB])) {
        return true;
      }
    }
  }
  // Check containment
  if (pointInPolygon(polyA[0], polyB)) return true;
  if (pointInPolygon(polyB[0], polyA)) return true;
  return false;
}
