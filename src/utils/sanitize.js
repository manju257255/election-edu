/**
 * Sanitizes chat messages by removing HTML tags and trimming whitespace.
 * @param {Array} messages - Array of message objects with 'content' field.
 * @returns {Array} - Array of sanitized message objects.
 */
export function sanitizeChatMessages(messages = []) {
  return messages.map((m) => ({
    ...m,
    content: sanitizeChatInput(m.content),
  }));
}

/**
 * Strips HTML tags from a string and trims whitespace.
 * @param {string} input - The raw input string.
 * @returns {string} - The sanitized string.
 */
export function sanitizeChatInput(input = '') {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Basic HTML strip
    .trim();
}
