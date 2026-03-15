import { describe, expect, it } from "vitest";
import { SESSION_SUGGESTION_MINUTES, shouldSuggestBreak } from "@/utils/safetyGuards";

describe("safetyGuards", () => {
  it("suggests a break after the configured session length", () => {
    const now = Date.now();
    const start = now - SESSION_SUGGESTION_MINUTES * 60 * 1000;
    expect(shouldSuggestBreak(start, now)).toBe(true);
  });
});
