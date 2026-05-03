/**
 * Generates a unique session ID in the format: session_timestamp_random
 * @returns {string} - A unique session ID.
 */
export function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
