import { describe, expect, it } from 'vitest';
import { tagMessage } from '../utils/tagger';

describe('tagMessage', () => {
  it('identifies Voter Registration category', () => {
    expect(tagMessage('How do I register to vote?')).toBe('Voter Registration');
    expect(tagMessage('Tell me about EPIC card')).toBe('Voter Registration');
    expect(tagMessage('Where is form 6?')).toBe('Voter Registration');
    expect(tagMessage('Check voter roll')).toBe('Voter Registration');
  });

  it('identifies EVM category', () => {
    expect(tagMessage('What is an EVM?')).toBe('EVM');
    expect(tagMessage('How does the ballot unit work?')).toBe('EVM');
    expect(tagMessage('control unit lights')).toBe('EVM');
  });

  it('identifies VVPAT category', () => {
    expect(tagMessage('What is VVPAT?')).toBe('VVPAT');
    expect(tagMessage('How to check paper slip?')).toBe('VVPAT');
  });

  it('identifies Model Code of Conduct category', () => {
    expect(tagMessage('What is MCC?')).toBe('Model Code of Conduct');
    expect(tagMessage('rules for model code')).toBe('Model Code of Conduct');
    expect(tagMessage('political conduct')).toBe('Model Code of Conduct');
  });

  it('identifies Vote Counting category', () => {
    expect(tagMessage('when is count?')).toBe('Vote Counting');
    expect(tagMessage('election result date')).toBe('Vote Counting');
    expect(tagMessage('vote tally process')).toBe('Vote Counting');
  });

  it('identifies NOTA category', () => {
    expect(tagMessage('What is NOTA?')).toBe('NOTA');
  });

  it('returns General for unknown keywords', () => {
    expect(tagMessage('hello')).toBe('General');
    expect(tagMessage('')).toBe('General');
  });

  it('is case insensitive', () => {
    expect(tagMessage('FORM 6')).toBe('Voter Registration');
    expect(tagMessage('evm')).toBe('EVM');
  });
});
