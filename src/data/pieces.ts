import type { PieceDefinition } from '@/types/puzzle.types';

export const PIECE_DEFINITIONS: Record<string, PieceDefinition> = {
  big_tri_1: {
    id: 'big_tri_1',
    label: '큰 삼각형 1',
    color: '#4F86C6',
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
    ],
  },
  big_tri_2: {
    id: 'big_tri_2',
    label: '큰 삼각형 2',
    color: '#E25D5D',
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ],
  },
  mid_tri: {
    id: 'mid_tri',
    label: '중간 삼각형',
    color: '#F5A623',
    points: [
      { x: 0, y: 0 },
      { x: 71, y: 0 },
      { x: 0, y: 71 },
    ],
  },
  sm_tri_1: {
    id: 'sm_tri_1',
    label: '작은 삼각형 1',
    color: '#7ED321',
    points: [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 0, y: 50 },
    ],
  },
  sm_tri_2: {
    id: 'sm_tri_2',
    label: '작은 삼각형 2',
    color: '#9B59B6',
    points: [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ],
  },
  square: {
    id: 'square',
    label: '정사각형',
    color: '#E67E22',
    points: [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ],
  },
  parallelogram: {
    id: 'parallelogram',
    label: '평행사변형',
    color: '#1ABC9C',
    points: [
      { x: 25, y: 0 },
      { x: 75, y: 0 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ],
  },
};

export const ALL_PIECE_IDS = Object.keys(PIECE_DEFINITIONS) as Array<keyof typeof PIECE_DEFINITIONS>;
