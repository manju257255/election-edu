import { describe, expect, it } from 'vitest';
import { createSessionId } from '../session';

describe('createSessionId', () => {
  it('returns a string in the expected format', () => {
    const id = createSessionId();
    expect(typeof id).toBe('string');
    expect(id).toMatch(/^session_\d+_[a-z0-9]{6}$/);
  });

  it('generates unique IDs on every call', () => {
    const id1 = createSessionId();
    const id2 = createSessionId();
    expect(id1).not.toBe(id2);
  });
});
