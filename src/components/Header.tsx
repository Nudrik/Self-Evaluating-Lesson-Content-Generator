import React from 'react';
import { BookOpen } from 'lucide-react';

export type ActiveTab = 'studio' | 'rejections' | 'memory' | 'architecture';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isRunning,
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'studio', label: 'Lesson Studio' },
    { id: 'rejections', label: 'Review Notes' },
    { id: 'memory', label: 'Style Guide' },
    { id: 'architecture', label: 'System Design' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-shadow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Lockup */}
        <button
          onClick={() => onTabChange('studio')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4 text-slate-100" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors whitespace-nowrap">
            Self-Evaluating Lesson Content Generator
          </span>
        </button>

        {/* Navigation Tabs with stylish active pills */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-slate-950 font-semibold bg-slate-100/90 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
