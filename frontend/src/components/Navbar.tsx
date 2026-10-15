
import React from 'react';
import { ActiveTab } from '../types';
import { DesktopNavbar } from '../components/DesktopNavbar';
import { MobileNavbar } from '../components/MobileNavbar';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenHelp: () => void;
  onOpenLaravelModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="relative z-30 w-full pt-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3">
        <DesktopNavbar {...props} />
        <MobileNavbar {...props} />
      </div>
    </header>
  );
};
