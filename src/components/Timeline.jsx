const phases = [
  { name: 'Schedule review', start: 0, span: 10, detail: 'Administrative review, dates, phases, and security planning.' },
  { name: 'Announcement', start: 9, span: 5, detail: 'Election dates are announced and the MCC begins.' },
  { name: 'Roll updates', start: 4, span: 28, detail: 'Voter list checks, claims, objections, and corrections continue.' },
  { name: 'Nomination filing', start: 23, span: 12, detail: 'Candidates file forms, affidavits, and deposits.' },
  { name: 'Scrutiny', start: 34, span: 5, detail: 'Officials review nomination papers and eligibility.' },
  { name: 'Campaigning', start: 36, span: 46, detail: 'Manifestos, public meetings, outreach, and voter awareness.' },
  { name: 'Silent period', start: 78, span: 4, detail: 'Campaigning pauses shortly before polling.' },
  { name: 'Polling phases', start: 82, span: 32, detail: 'Voting happens across scheduled phases and constituencies.' },
  { name: 'Counting and results', start: 120, span: 14, detail: 'Postal ballots, EVM totals, VVPAT checks, and result declaration.' },
];

export default function Timeline() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Election timeline</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">A five-month cycle showing how major phases overlap.</p>
      </div>

      <div className="overflow-x-auto rounded-lg bg-[#111] p-4 ring-1 ring-white/10">
        <div className="min-w-[820px]">
          <div className="mb-4 grid grid-cols-5 text-xs font-semibold uppercase text-[#888]">
            {['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'].map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>
          <div className="space-y-3">
            {phases.map((phase) => (
              <div key={phase.name} className="grid grid-cols-[170px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-[#cfcfcf]">{phase.name}</span>
                <div className="relative h-9 rounded-md bg-[#1a1a1a]">
                  <div
                    tabIndex={0}
                    role="img"
                    aria-label={`${phase.name}: ${phase.detail}`}
                    className="group absolute top-1/2 h-5 -translate-y-1/2 rounded bg-[#4ade80] transition hover:brightness-110 focus-visible:brightness-110"
                    style={{ left: `${phase.start / 1.5}%`, width: `${phase.span / 1.5}%` }}
                  >
                    <span className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden w-56 -translate-x-1/2 rounded-md bg-[#0a0a0a] p-3 text-xs leading-5 text-[#e8e8e8] ring-1 ring-white/10 group-hover:block group-focus-visible:block">
                      {phase.detail}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
