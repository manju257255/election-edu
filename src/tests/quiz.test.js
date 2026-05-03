import { describe, expect, it } from 'vitest';
import { calculateQuizScore } from '../data/quizQuestions';

describe('calculateQuizScore', () => {
  it('score increments on correct answer', () => {
    const answers = [
      { index: 0, correct: true },
      { index: 1, correct: false },
      { index: 2, correct: true },
    ];
    expect(calculateQuizScore(answers)).toBe(2);
  });

  it('score does not increment on wrong answer', () => {
    const answers = [
      { index: 1, correct: false },
      { index: 2, correct: false },
    ];
    expect(calculateQuizScore(answers)).toBe(0);
  });

  it('handles empty answers array', () => {
    expect(calculateQuizScore([])).toBe(0);
  });

  it('handles non-array input', () => {
    expect(calculateQuizScore(null)).toBe(0);
  });
});
