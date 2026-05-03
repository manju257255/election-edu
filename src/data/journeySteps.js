export const journeySteps = [
  {
    id: 'announcement',
    title: 'Election Announcement',
    summary: 'The Election Commission announces dates, phases, constituencies, and the Model Code of Conduct.',
    detail: 'This starts the formal election period. Parties, candidates, officials, media, and voters now follow the published schedule and conduct rules.',
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    summary: 'Eligible citizens check, add, or correct their names in the electoral roll.',
    detail: 'A voter must be listed in the electoral roll for their constituency. EPIC helps identify the voter, but the roll decides eligibility at the polling station.',
  },
  {
    id: 'nomination',
    title: 'Nomination',
    summary: 'Candidates file nomination papers and required affidavits before the deadline.',
    detail: 'Election officials scrutinize nominations, allow withdrawals, and publish the final candidate list with symbols.',
  },
  {
    id: 'campaigning',
    title: 'Campaigning',
    summary: 'Candidates and parties present promises, records, and manifestos to voters.',
    detail: 'Campaigning must follow spending limits, speech rules, and MCC restrictions. The silent period begins before polling.',
  },
  {
    id: 'polling',
    title: 'Polling Day',
    summary: 'Voters verify identity and cast votes using EVM and VVPAT systems.',
    detail: 'Polling staff check the roll, mark the voter, and enable the ballot unit. VVPAT lets voters briefly verify the printed slip.',
  },
  {
    id: 'counting',
    title: 'Vote Counting',
    summary: 'Votes are counted under supervision with candidate representatives present.',
    detail: 'Counting follows constituency-wise procedures. EVM totals, postal ballots, and required VVPAT checks are handled under official rules.',
  },
  {
    id: 'result-oath',
    title: 'Result & Oath',
    summary: 'Winning candidates are declared and later take oath before assuming office.',
    detail: 'The returning officer declares results. Elected representatives then complete oath requirements for their legislature or office.',
  },
];
