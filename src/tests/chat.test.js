import { describe, expect, it } from 'vitest';
import { createSessionId } from '../session';
import { filterGlossaryTerms } from '../data/glossaryTerms';
import { calculateQuizScore } from '../data/quizQuestions';

describe('chat helpers', () => {
  it('creates a unique session ID on every generation', () => {
    const ids = new Set(Array.from({ length: 25 }, () => createSessionId()));

    expect(ids.size).toBe(25);
    for (const id of ids) {
      expect(id).toMatch(/^session_\d+_[a-z0-9]{6}$/);
    }
  });

  it('filters glossary terms by search text', () => {
    expect(filterGlossaryTerms('vvpat')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ badge: 'VVPAT' }),
      ]),
    );

    expect(filterGlossaryTerms('model code')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ badge: 'MCC' }),
      ]),
    );
  });

  it('increments quiz score for correct answers', () => {
    const score = calculateQuizScore([
      { correct: true },
      { correct: false },
      { correct: true },
    ]);

    expect(score).toBe(2);
  });
});
