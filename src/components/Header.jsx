import { BarChart3, BookOpen, Calendar, Layout, Map, MessageSquare } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { trackEvent } from '../firebase';

const tabs = [
  { id: 'chat', label: 'Assistant', icon: MessageSquare },
  { id: 'journey', label: 'Journey', icon: Map },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'glossary', label: 'Glossary', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: Layout },
  { id: 'dashboard', label: 'Progress', icon: BarChart3 },
];

/**
 * Header component with navigation tabs. Memoized for performance.
 */
function Header({ activeTab, onTabChange }) {
  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    trackEvent('tab_switched', { tab_id: tabId });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#4ade80] font-serif text-xl font-black text-[#0a0a0a]">
            E
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#e8e8e8]">ElectionEdu</h1>
        </div>
        <nav className="scrollbar-thin flex max-w-full gap-1 overflow-x-auto pb-2 sm:pb-0" aria-label="Main navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-[#161616] text-[#4ade80]' : 'text-[#888] hover:bg-[#111] hover:text-[#cfcfcf]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

const MemoizedHeader = React.memo(Header);
export default MemoizedHeader;
