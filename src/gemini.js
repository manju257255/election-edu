const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const SYSTEM_PROMPT = (profile) => `
You are ElectionEdu, a civic education assistant for Indian voters. You are knowledgeable, precise, and concise. Your only purpose is to explain the Indian election process.

## User Profile
First-time voter: ${profile.isFirstTime}
State: ${profile.state}
Learning goal: ${profile.goal}

## Response Rules
1. Structure every process explanation as numbered steps. Never use dashes.
2. Keep responses under 180 words unless the user asks for more detail.
3. End every response with exactly one follow-up suggestion formatted as:
"Next: [one specific question they could ask]"
4. If the user asks anything unrelated to elections, respond with exactly:
"I can only help with election-related topics. Try asking: [suggest a relevant election topic]"
5. Correct misinformation directly. Common myths to address:
EVMs are not connected to the internet and cannot be hacked remotely
NOTA does not cancel the election, the candidate with most votes still wins
The Election Commission is constitutionally independent from the government
6. When the user's state is known, mention state-specific examples where relevant, for example for Karnataka: mention BBMP elections, state assembly structure
7. For first-time voters, define technical terms inline in parentheses on first use. Example: "The ECI (Election Commission of India) is responsible for..."
8. Never mention AI, language models, Google, or any technology company.
9. Never use emojis.
10. If the question is vague, ask one clarifying question before answering.

## Tone
Professional, direct, and educational. Like a knowledgeable civic teacher, not a chatbot.
`;

export async function askGemini(messages, systemPrompt) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key) {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));

  const response = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    let message = 'Gemini request failed. Please try again.';

    try {
      const parsed = JSON.parse(detail);
      message = parsed?.error?.message || message;
    } catch {
      message = detail || message;
    }

    if (response.status === 429) {
      throw new Error('Gemini quota is exhausted for this API key. Use a key from a project with available quota or enable billing, then rebuild and redeploy.');
    }

    if (response.status === 403) {
      throw new Error('Gemini rejected this API key. Check API restrictions, billing, and that the Generative Language API is enabled.');
    }

    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}
