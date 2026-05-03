export const fallbackQuizQuestions = [
  {
    question: 'What decides whether a voter can vote at a polling station?',
    options: ['Their name in the electoral roll', 'Only having an EPIC card', 'Knowing the booth officer', 'Having a party slip'],
    answerIndex: 0,
    explanation: 'The electoral roll is the official voter list. EPIC helps with identity, but the roll confirms eligibility.',
  },
  {
    question: 'What is the main purpose of VVPAT?',
    options: ['To count campaign expenses', 'To let voters verify their selected vote briefly', 'To replace the electoral roll', 'To announce results faster'],
    answerIndex: 1,
    explanation: 'VVPAT shows a printed slip for a few seconds so voters can verify the candidate they selected.',
  },
  {
    question: 'When does the Model Code of Conduct usually come into force?',
    options: ['After oath taking', 'When election dates are announced', 'Only on counting day', 'After candidate withdrawal'],
    answerIndex: 1,
    explanation: 'The MCC applies once the Election Commission announces the election schedule.',
  },
  {
    question: 'What happens if NOTA receives many votes?',
    options: ['All candidates are eliminated automatically', 'The election is always cancelled', 'Votes are recorded as voter rejection of listed candidates', 'The runner-up becomes NOTA representative'],
    answerIndex: 2,
    explanation: 'NOTA records rejection but does not automatically cancel the election or remove candidates.',
  },
  {
    question: 'Who declares the result in a constituency?',
    options: ['Returning Officer', 'Chief Minister', 'Any polling officer', 'District police chief'],
    answerIndex: 0,
    explanation: 'The Returning Officer is responsible for declaring the constituency result.',
  },
  {
    question: 'What does FPTP mean in Indian elections?',
    options: ['Every winner needs 50 percent votes', 'The candidate with the most valid votes wins', 'Only postal ballots are counted first', 'Parties rotate seats'],
    answerIndex: 1,
    explanation: 'First Past the Post means the candidate with the highest number of valid votes wins.',
  },
  {
    question: 'What is an affidavit used for during nominations?',
    options: ['Disclosing candidate details to voters', 'Issuing voter ID cards', 'Printing VVPAT slips', 'Selecting polling dates'],
    answerIndex: 0,
    explanation: 'Candidate affidavits disclose important background information for voter awareness.',
  },
  {
    question: 'What is a by-election?',
    options: ['A full national election', 'An election to fill a vacant seat', 'A mock poll before voting', 'A recount after every result'],
    answerIndex: 1,
    explanation: 'A by-election is held when a seat becomes vacant before the normal term ends.',
  },
];

export function normalizeQuizQuestions(items) {
  const questionItems = Array.isArray(items) ? items : items?.questions;

  if (!Array.isArray(questionItems)) {
    return fallbackQuizQuestions;
  }

  const normalized = questionItems
    .map((item) => {
      const answerIndex = Number(item.answerIndex);
      if (!item.question || !Array.isArray(item.options) || item.options.length !== 4 || Number.isNaN(answerIndex)) {
        return null;
      }

      return {
        question: String(item.question),
        options: item.options.map(String),
        answerIndex: Math.max(0, Math.min(3, answerIndex)),
        explanation: String(item.explanation || 'Review the election concept and try again.'),
      };
    })
    .filter(Boolean)
    .slice(0, 8);

  return normalized.length === 8 ? normalized : fallbackQuizQuestions;
}

export function parseQuizQuestions(text) {
  const candidates = [
    text,
    text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1],
    text.match(/\[[\s\S]*\]/)?.[0],
    text.match(/\{[\s\S]*\}/)?.[0],
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate.trim());
      const normalized = normalizeQuizQuestions(parsed);
      if (normalized !== fallbackQuizQuestions) {
        return normalized;
      }
    } catch {
      // Try the next extraction pattern.
    }
  }

  return fallbackQuizQuestions;
}
