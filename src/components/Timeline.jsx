import { Calendar, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { timelineEvents } from '../data/timelineEvents';

/**
 * Timeline component for visualizing the election schedule. Memoized for performance.
 */
function Timeline() {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-[#e8e8e8]">Election timeline</h2>
        <p className="mt-2 text-sm leading-6 text-[#888]">Standard sequence of events from announcement to results.</p>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-white/5">
        {timelineEvents.map((event) => (
          <TimelineEvent key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

/**
 * Timeline Event component.
 */
const TimelineEvent = React.memo(({ event }) => {
  return (
    <article className="relative pl-12">
      <div className="absolute left-0 top-1.5 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#0a0a0a] ring-1 ring-white/10">
        <Calendar className="text-[#4ade80]" size={18} aria-hidden="true" />
      </div>
      <div className="rounded-lg bg-[#111] p-5 ring-1 ring-white/10 transition hover:ring-white/20">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">{event.period}</span>
          <div className="flex items-center gap-1.5 text-xs text-[#666]">
            <Clock size={12} aria-hidden="true" />
            <span>{event.duration}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[#e8e8e8]">{event.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#bdbdbd]">{event.description}</p>
      </div>
    </article>
  );
});

TimelineEvent.displayName = 'TimelineEvent';
TimelineEvent.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const MemoizedTimeline = React.memo(Timeline);
export default MemoizedTimeline;
