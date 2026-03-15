export const SESSION_SUGGESTION_MINUTES = 30;
export const MAX_REWARD_ANIMATION_DURATION_MS = 1500;
export const AVOID_FLASHING_EFFECTS = true;

export const BREAK_SUGGESTION_MESSAGES = [
  "많이 해냈어. 물 한 잔 마시고 다시 해도 좋아.",
  "집중을 오래 했네. 잠깐 눈을 쉬게 해 보자.",
];

export const FAILURE_MESSAGES = [
  "거의 다 왔어. 조각 방향을 한 번 더 살펴보자.",
  "힌트를 써도 괜찮아. 다음 단서를 보고 다시 해 보자.",
  "틀린 게 아니야. 아직 맞는 자리를 찾는 중이야.",
];

export function shouldSuggestBreak(sessionStartTime: number, now = Date.now()): boolean {
  const elapsedMinutes = (now - sessionStartTime) / 1000 / 60;
  return elapsedMinutes >= SESSION_SUGGESTION_MINUTES;
}

export function getBreakMessage(index = 0): string {
  return BREAK_SUGGESTION_MESSAGES[index % BREAK_SUGGESTION_MESSAGES.length];
}

export function getFailureMessage(index = 0): string {
  return FAILURE_MESSAGES[index % FAILURE_MESSAGES.length];
}
