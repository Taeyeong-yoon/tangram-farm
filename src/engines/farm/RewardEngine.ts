import { REWARD_RULES } from "@/engines/farm/FarmEngine";
import type { RewardPayload } from "@/types/farm.types";

const MIN_REPEAT_MULTIPLIER = 0.5;

export function getRepeatMultiplier(completionCount: number): number {
  if (completionCount <= 1) return 1;
  if (completionCount === 2) return 0.8;
  if (completionCount === 3) return 0.6;
  return MIN_REPEAT_MULTIPLIER;
}

export function calculatePuzzleReward(
  difficulty: 1 | 2 | 3 | 4 | 5,
  hintsUsed: 0 | 1 | 2 | 3,
  completionCount = 1,
): RewardPayload {
  const rule =
    REWARD_RULES.find((entry) => entry.levelDifficulty === difficulty && entry.hintsUsed === hintsUsed) ??
    REWARD_RULES.find((entry) => entry.levelDifficulty === difficulty && entry.hintsUsed === 3);

  if (!rule) {
    return { seeds: 1, feed: 1, coins: 1 };
  }

  const multiplier = getRepeatMultiplier(completionCount);

  return {
    seeds: Math.max(1, Math.round(rule.baseReward.seeds * multiplier)),
    feed: Math.max(1, Math.round(rule.baseReward.feed * multiplier)),
    coins: Math.max(1, Math.round(rule.baseReward.coins * multiplier)),
    specialItem: multiplier === 1 ? rule.baseReward.specialItem : undefined,
  };
}

export function addRewards(base: RewardPayload, incoming: RewardPayload): RewardPayload {
  return {
    seeds: base.seeds + incoming.seeds,
    feed: base.feed + incoming.feed,
    coins: base.coins + incoming.coins,
    specialItem: incoming.specialItem ?? base.specialItem,
  };
}
