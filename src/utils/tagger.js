/**
 * Simple keyword-based topic tagger for Indian election process questions.
 * Detects categories like Voter Registration, EVM, VVPAT, MCC, etc.
 * @param {string} text - The user message to tag.
 * @returns {string} - The detected topic tag.
 */
export function tagMessage(text = '') {
  const input = String(text || '').toLowerCase();

  if (input.includes('register') || input.includes('epic') || input.includes('form 6') || input.includes('roll')) {
    return 'Voter Registration';
  }
  
  if (input.includes('evm') || input.includes('ballot unit') || input.includes('control unit')) {
    return 'EVM';
  }
  
  if (input.includes('vvpat') || input.includes('paper slip')) {
    return 'VVPAT';
  }
  
  if (input.includes('mcc') || input.includes('model code') || input.includes('conduct')) {
    return 'Model Code of Conduct';
  }
  
  if (input.includes('count') || input.includes('result') || input.includes('tally')) {
    return 'Vote Counting';
  }
  
  if (input.includes('nota')) {
    return 'NOTA';
  }

  return 'General';
}
