import { describe, it, expect } from 'vitest'
import { sanitizeChatInput as sanitizeInput } from '../utils/sanitize'
import { createSessionId as generateSessionId } from '../session'
import { tagMessage } from '../utils/tagger'

describe('Gemini utility checks', () => {
  it('sanitizeInput removes HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>hello')).toBe('hello')
  })
  it('sanitizeInput trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })
  it('generateSessionId returns a string', () => {
    expect(typeof generateSessionId()).toBe('string')
  })
  it('generateSessionId is unique each call', () => {
    expect(generateSessionId()).not.toBe(generateSessionId())
  })
  it('tagMessage returns General for unknown input', () => {
    expect(tagMessage('random unknown text')).toBe('General')
  })
})
