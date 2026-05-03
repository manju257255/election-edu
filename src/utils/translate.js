/**
 * Translates text using the Google Translate API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'hi' for Hindi).
 * @returns {Promise<string>} - The translated text.
 */
export async function translateText(text, targetLang = 'hi') {
  if (!text || targetLang === 'en') {
    return text;
  }

  const apiKey = import.meta.env.VITE_TRANSLATE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Translation API error:', error);
      return text; // Fallback to original text
    }

    const data = await response.json();
    return data.data?.translations?.[0]?.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
