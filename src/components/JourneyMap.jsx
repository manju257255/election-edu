import { Check, ChevronDown } from 'lucide-react';
import { journeySteps } from '../data/journeySteps';

export default function JourneyMap({ learnedSteps, onToggleStep, loading }) {
  if (loading) {
    return <SkeletonRows count={4} />;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Election journey</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">Expand each stage and mark the parts you understand.</p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-white/10" aria-hidden="true" />
        <div className="space-y-4">
          {journeySteps.map((step, index) => {
            const learned = learnedSteps.includes(step.id);
            return (
              <details key={step.id} className="group relative rounded-lg bg-[#111] p-4 pl-14 ring-1 ring-white/10 open:bg-[#161616]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="absolute left-2 top-4 grid h-7 w-7 place-items-center rounded-full bg-[#1a1a1a] ring-1 ring-white/10">
                    {learned ? <Check className="text-[#4ade80]" size={16} aria-label="Learned" /> : <span className="text-xs text-[#888]">{index + 1}</span>}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-[#e8e8e8]">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#888]">{step.summary}</span>
                  </span>
                  <ChevronDown className="mt-1 shrink-0 text-[#888] transition group-open:rotate-180" size={18} aria-hidden="true" />
                </summary>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-sm leading-6 text-[#cfcfcf]">{step.detail}</p>
                  <button
                    type="button"
                    onClick={() => onToggleStep(step.id)}
                    className={`mt-4 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
                      learned ? 'bg-[#1a1a1a] text-[#4ade80] ring-1 ring-[#4ade80]/40' : 'bg-[#4ade80] text-[#0a0a0a]'
                    }`}
                  >
                    <Check size={16} aria-hidden="true" />
                    {learned ? 'Learned' : 'Mark as learned'}
                  </button>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkeletonRows({ count }) {
  return (
    <div className="mx-auto max-w-4xl space-y-4" aria-label="Loading journey">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-lg bg-[#111] ring-1 ring-white/10" />
      ))}
    </div>
  );
}
