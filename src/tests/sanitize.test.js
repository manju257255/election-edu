import { describe, expect, it } from 'vitest';
import { sanitizeChatInput } from '../utils/sanitize';

describe('sanitizeChatInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeChatInput('<script>alert("hi")</script>Hello')).toBe('alert("hi")Hello');
    expect(sanitizeChatInput('<div><b>Bold</b></div>')).toBe('Bold');
  });

  it('trims whitespace', () => {
    expect(sanitizeChatInput('  hello world  ')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(sanitizeChatInput('')).toBe('');
  });

  it('handles non-string input', () => {
    expect(sanitizeChatInput(null)).toBe('');
    expect(sanitizeChatInput(undefined)).toBe('');
  });
});
