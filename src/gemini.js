import { sanitizeChatMessages } from './utils/sanitize';

export const MAX_USER_MESSAGES_PER_SESSION = 20;

/**
 * Calls the Gemini API via fetch() to get a response for the chat messages.
 * Includes user profile context in the system instructions.
 * @param {Array} messages - Chat message history.
 * @param {Object} profile - User onboarding profile (state, goal, etc).
 * @returns {Promise<string>} - The assistant's text response.
 */
export async function askGemini(messages, profile) {
  const sanitizedMessages = sanitizeChatMessages(messages);

  if (sanitizedMessages.length === 0 || sanitizedMessages.every((message) => !message.content)) {
    throw new Error('Gemini messages must include at least one non-empty user message.');
  }

  const userMessageCount = sanitizedMessages.filter((message) => message.role === 'user').length;

  if (userMessageCount > MAX_USER_MESSAGES_PER_SESSION) {
    throw new Error('Message limit reached for this session.');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const systemPrompt = `You are an election assistant specializing in the Indian election process.
User profile: ${JSON.stringify(sanitizeProfile(profile))}.
Keep answers clear, educational, and neutral.
If you suggest a follow-up, format it as "Next: <question>".`;

  const contents = sanitizedMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { 
            temperature: 0.6, 
            maxOutputTokens: 1000 
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error response:', errorData);
      throw new Error(`Gemini API returned ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return text;
  } catch (error) {
    console.error('Gemini integration error:', error);
    throw error;
  }
}

/**
 * Normalizes user profile data for the system prompt.
 * @param {Object} profile - Raw profile data.
 * @returns {Object} - Sanitized profile data.
 */
function sanitizeProfile(profile = {}) {
  return {
    isFirstTime: Boolean(profile.isFirstTime),
    state: String(profile.state || 'India').replace(/[<>]/g, '').slice(0, 80),
    goal: String(profile.goal || 'General').replace(/[<>]/g, '').slice(0, 80),
  };
}
