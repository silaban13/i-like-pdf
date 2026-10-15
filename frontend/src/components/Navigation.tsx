import React from 'react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const navItems: { id: ActiveTab; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'pdf-to-word', label: 'PDF to Word' },
  { id: 'word-to-pdf', label: 'Word to PDF' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => (
        <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${ activeTab === item.id ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white' }`}>
          {item.label}
          {activeTab === item.id && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </nav>
  );
};