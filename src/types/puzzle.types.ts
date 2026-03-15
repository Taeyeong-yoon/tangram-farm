export type PieceId = 'big_tri_1' | 'big_tri_2' | 'mid_tri' | 'sm_tri_1' | 'sm_tri_2' | 'square' | 'parallelogram';

export interface Point {
  x: number;
  y: number;
}

export interface PiecePlacement {
  pieceId: PieceId;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  flipped: boolean;
}

export interface HintStep {
  level: 1 | 2 | 3;
  description: string;
  data?: string; // SVG path or highlight info
}

export interface PuzzleLevel {
  id: number;
  theme: 'animal' | 'vehicle' | 'nature' | 'object';
  name: string;
  nameKo: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  gradeGroup: 'low' | 'high' | 'both';
  targetShape: {
    outline: string; // SVG path data
    viewBox: string;
  };
  solution: PiecePlacement[];
  allowedPieces: PieceId[];
  hints: HintStep[];
  reward: {
    seeds: number;
    feed: number;
    special?: string;
  };
}

export interface PieceDefinition {
  id: PieceId;
  label: string;
  color: string;
  points: Point[]; // polygon points in local space (100x100 grid)
}

export interface PieceState {
  id: PieceId;
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
  isPlaced: boolean;
  isSelected: boolean;
}
