import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { filterGlossaryTerms } from '../data/glossaryTerms';
import { trackEvent } from '../firebase';

/**
 * Glossary component for searching election terms.
 */
export default function Glossary() {
  const [query, setQuery] = useState('');
  
  const terms = useMemo(() => {
    if (query.trim().length >= 3) {
      trackEvent('glossary_searched', { query_length: query.trim().length });
    }
    return filterGlossaryTerms(query);
  }, [query]);

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl text-[#e8e8e8]">Glossary</h2>
          <p className="mt-2 text-sm leading-6 text-[#888]">Search key election terms and common abbreviations.</p>
        </div>
        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">Search glossary</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" size={18} aria-hidden="true" />
          <input
            id="glossary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms"
            className="h-11 w-full rounded-md border border-white/10 bg-[#111] pl-10 pr-3 text-sm text-[#e8e8e8] placeholder:text-[#888]"
          />
        </label>
      </div>

      {terms.length === 0 ? (
        <div className="rounded-lg bg-[#111] p-8 text-center text-sm text-[#888] ring-1 ring-white/10" role="status">
          No glossary terms match your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((item) => (
            <GlossaryCard key={item.term} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Memoized Glossary Card component.
 */
const GlossaryCard = React.memo(({ item }) => (
  <article className="rounded-lg bg-[#111] p-5 ring-1 ring-white/10">
    <div className="mb-3 flex items-start justify-between gap-3">
      <h3 className="text-base font-semibold leading-6 text-[#e8e8e8]">{item.term}</h3>
      <span className="rounded bg-[#4ade80] px-2 py-1 text-xs font-bold text-[#0a0a0a]">{item.badge}</span>
    </div>
    <p className="text-sm leading-6 text-[#bdbdbd]">{item.definition}</p>
  </article>
));

GlossaryCard.displayName = 'GlossaryCard';
GlossaryCard.propTypes = {
  item: PropTypes.shape({
    term: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  }).isRequired,
};
