import { describe, expect, it } from 'vitest';
import { filterGlossaryTerms } from '../data/glossaryTerms';

const mockTerms = [
  { term: 'Electronic Voting Machine', badge: 'EVM', definition: 'Records votes electronically.' },
  { term: 'Voter Verifiable Paper Audit Trail', badge: 'VVPAT', definition: 'Prints paper slip.' },
];

describe('filterGlossaryTerms', () => {
  it('returns all terms when query is empty', () => {
    expect(filterGlossaryTerms('', mockTerms)).toHaveLength(2);
  });

  it('filters terms correctly by term name', () => {
    const results = filterGlossaryTerms('Voting', mockTerms);
    expect(results).toHaveLength(1);
    expect(results[0].term).toBe('Electronic Voting Machine');
  });

  it('filters terms correctly by badge', () => {
    const results = filterGlossaryTerms('VVPAT', mockTerms);
    expect(results).toHaveLength(1);
    expect(results[0].badge).toBe('VVPAT');
  });

  it('filters terms correctly by definition', () => {
    const results = filterGlossaryTerms('paper slip', mockTerms);
    expect(results).toHaveLength(1);
    expect(results[0].term).toBe('Voter Verifiable Paper Audit Trail');
  });

  it('returns empty array when no match is found', () => {
    expect(filterGlossaryTerms('Zebra', mockTerms)).toHaveLength(0);
  });

  it('is case insensitive', () => {
    expect(filterGlossaryTerms('evm', mockTerms)).toHaveLength(1);
  });
});
