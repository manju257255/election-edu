import { describe, expect, it, vi } from 'vitest';
import { askGemini } from '../gemini';

// Mock global fetch
global.fetch = vi.fn();

describe('askGemini', () => {
  it('returns a string response from fetch', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Election Commission answer' }]
          }
        }
      ]
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await askGemini([{ role: 'user', content: 'What is ECI?' }], {
      isFirstTime: true,
      state: 'Karnataka',
      goal: 'General',
    });

    expect(response).toBe('Election Commission answer');
    expect(typeof response).toBe('string');
    expect(fetch).toHaveBeenCalled();
  });

  it('rejects empty input before calling fetch', async () => {
    fetch.mockClear();
    await expect(askGemini([], { state: 'Karnataka' })).rejects.toThrow('Gemini messages must include');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('throws error on non-ok response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: async () => ({ error: { message: 'Invalid API Key' } }),
    });

    await expect(askGemini([{ role: 'user', content: 'Hi' }], {})).rejects.toThrow('Gemini API returned 403: Invalid API Key');
  });
});
