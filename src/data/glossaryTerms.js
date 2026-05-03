export const glossaryTerms = [
  { term: 'Electronic Voting Machine', badge: 'EVM', definition: 'An EVM records votes electronically at the polling station. It is used with procedural safeguards, mock polls, sealing, candidate presence, and counting controls.' },
  { term: 'Voter Verifiable Paper Audit Trail', badge: 'VVPAT', definition: 'VVPAT prints a paper slip showing the selected candidate for brief voter verification. The slip drops into a sealed box and can be used for prescribed verification checks.' },
  { term: 'None of the Above', badge: 'NOTA', definition: 'NOTA lets a voter reject all listed candidates. It does not cancel the election or automatically eliminate candidates if it receives the highest votes.' },
  { term: 'Electors Photo Identity Card', badge: 'EPIC', definition: 'EPIC is the voter identity card issued to registered electors. A voter still needs their name on the electoral roll to vote.' },
  { term: 'Model Code of Conduct', badge: 'MCC', definition: 'The MCC is a set of conduct rules that applies after election dates are announced. It guides parties, candidates, and governments during the election period.' },
  { term: 'Returning Officer', badge: 'RO', definition: 'The Returning Officer manages the election process in a constituency. The RO handles nominations, scrutiny, counting, and result declaration.' },
  { term: 'Electoral Roll', badge: 'Roll', definition: 'The electoral roll is the official list of eligible voters in a constituency. Only people listed in the roll can vote there.' },
  { term: 'Constituency', badge: 'Seat', definition: 'A constituency is a defined electoral area that chooses one representative. Voters vote for candidates contesting from their constituency.' },
  { term: 'First Past the Post', badge: 'FPTP', definition: 'FPTP means the candidate with the most valid votes wins. A candidate does not need more than half the votes unless the law specifically requires it.' },
  { term: 'National Voters Service Portal', badge: 'NVSP', definition: 'NVSP is an online voter service portal for registration and roll-related services. Voters can use it to check details or access voter forms.' },
  { term: 'Affidavit', badge: 'Form 26', definition: 'A candidate affidavit discloses information such as assets, liabilities, education, and criminal cases. It helps voters compare candidates before polling.' },
  { term: 'Postal Ballot', badge: 'PB', definition: 'Postal ballot allows certain voters to vote without visiting a polling station. It is commonly used for eligible service voters, officials on election duty, and other notified categories.' },
  { term: 'Silent Period', badge: '48H', definition: 'The silent period restricts campaigning before polling begins. It gives voters time to decide without last-minute campaign pressure.' },
  { term: 'Anti-defection Law', badge: 'Tenth', definition: 'The anti-defection law discourages elected members from switching parties in specified situations. It can lead to disqualification under the Tenth Schedule.' },
  { term: 'By-election', badge: 'Bypoll', definition: 'A by-election fills a seat that becomes vacant before the normal term ends. It is held for that constituency rather than the whole state or country.' },
];

export function filterGlossaryTerms(query, terms = glossaryTerms) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return terms;
  }

  return terms.filter((item) => {
    const text = `${item.term} ${item.badge} ${item.definition}`.toLowerCase();
    return text.includes(normalizedQuery);
  });
}
