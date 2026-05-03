import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { journeySteps } from '../data/journeySteps';
import { trackEvent } from '../firebase';

/**
 * JourneyMap component for tracking election learning progress.
 */
export default function JourneyMap({ learnedSteps, onToggleStep, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-[#111] ring-1 ring-white/10" />
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Journey map</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">Follow the step-by-step process of an Indian election.</p>
      </div>
      <div className="space-y-4">
        {journeySteps.map((step, index) => (
          <JourneyStep
            key={step.id}
            step={step}
            index={index}
            isLearned={learnedSteps.includes(step.id)}
            onToggle={() => onToggleStep(step.id)}
          />
        ))}
      </div>
    </section>
  );
}

JourneyMap.propTypes = {
  learnedSteps: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleStep: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

/**
 * Memoized Journey Step component.
 */
const JourneyStep = React.memo(({ step, index, isLearned, onToggle }) => (
  <article
    className={`group relative rounded-lg p-5 transition ring-1 ${
      isLearned ? 'bg-[#111] ring-[#4ade80]/30' : 'bg-[#111] ring-white/10 hover:ring-white/20'
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
          isLearned ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#888]'
        }`}
      >
        {isLearned ? <CheckCircle2 size={20} /> : index + 1}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-[#e8e8e8]">{step.title}</h3>
          <button
            type="button"
            onClick={onToggle}
            className={`rounded-md px-3 py-1 text-xs font-bold transition ${
              isLearned ? 'bg-[#1a1a1a] text-[#4ade80]' : 'bg-[#4ade80] text-[#0a0a0a]'
            }`}
          >
            {isLearned ? 'Learned' : 'Mark as learned'}
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#bdbdbd]">{step.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {step.tags.map((tag) => (
            <span key={tag} className="rounded-sm bg-[#1a1a1a] px-2 py-1 text-[10px] uppercase tracking-wider text-[#666]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </article>
));

JourneyStep.displayName = 'JourneyStep';
JourneyStep.propTypes = {
  step: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isLearned: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
