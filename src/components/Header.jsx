import { BarChart3, BookOpenText, GraduationCap, Map, MessageSquareText, Timer } from 'lucide-react';

const tabs = [
  { id: 'chat', label: 'Assistant', icon: MessageSquareText },
  { id: 'journey', label: 'Journey', icon: Map },
  { id: 'timeline', label: 'Timeline', icon: Timer },
  { id: 'glossary', label: 'Glossary', icon: BookOpenText },
  { id: 'quiz', label: 'Quiz', icon: GraduationCap },
  { id: 'dashboard', label: 'Progress', icon: BarChart3 },
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#4ade80]">Indian civic learning</p>
            <h1 className="font-serif text-4xl leading-none text-[#e8e8e8] sm:text-5xl">ElectionEdu</h1>
          </div>
          <div className="hidden max-w-md text-right text-sm leading-6 text-[#888] md:block">
            Learn the process, test your understanding, and ask election questions with state-aware guidance.
          </div>
        </div>

        <nav aria-label="Primary" className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#4ade80] text-[#0a0a0a]'
                      : 'bg-[#161616] text-[#e8e8e8] hover:bg-[#1f1f1f]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon aria-hidden="true" size={17} />
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
