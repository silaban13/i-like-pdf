
import React from 'react';
import { ActiveTab } from '../types';
import { Sun, Moon, HelpCircle, Menu, X } from 'lucide-react';

interface MobileNavbarProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    onOpenHelp: () => void;
    onOpenLaravelModal: () => void;
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

const mobileTabs: { id: ActiveTab; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'pdf-to-word', label: 'PDF to Word' },
  { id: 'word-to-pdf', label: 'Word to PDF' },
];

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ activeTab, setActiveTab, onOpenHelp, darkMode, setDarkMode, }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const closeMenu = () => setMobileMenuOpen(false);
    const handleNavigation = (tab: ActiveTab) => {
        setActiveTab(tab);
        closeMenu();
    };

    return (
        <div className="relative w-full lg:hidden">
            <div className="flex w-full items-center gap-4">
                <button type="button" onClick={() => setActiveTab('beranda')} className="flex items-center gap-2 text-left shrink-0" aria-label="Kembali ke Beranda">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <span className="font-extrabold text-white text-lg tracking-tighter"> D </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className="font-extrabold text-lg tracking-tight text-white"> I-LIKE  </span>
                            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent"> PDF </span>
                        </div>
                    </div>
                </button>
                <div className="flex-1" />
                <button type="button" onClick={() => setMobileMenuOpen((previous) => !previous)} className="shrink-0 p-2 rounded-lg bg-[#1c1935] border border-purple-500/20 text-purple-200" aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileMenuOpen}>
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>
            {mobileMenuOpen && (
                <div className="absolute top-full right-0 left-0 mt-3 p-4 rounded-2xl bg-[#141226] border border-purple-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50">
                    <nav className="flex flex-col gap-1.5" aria-label="Navigasi mobile">
                        {mobileTabs.map((tab) => (
                            <button key={tab.id} type="button" onClick={() => handleNavigation(tab.id)} className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${ activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/5'}`} >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className="h-px bg-purple-500/20 my-3" />
                    <div className="flex flex-col gap-3">
                        <button type="button" onClick={() => { onOpenHelp(); closeMenu(); }} className="flex items-center gap-2 text-xs text-purple-200 hover:text-white" >
                            <HelpCircle className="w-4 h-4" />
                            <span>Bantuan</span>
                        </button>
                            <button type="button" onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 text-xs text-amber-300" aria-label="Ganti mode tampilan" >
                                {darkMode ? (
                                    <Sun className="w-4 h-4 fill-amber-400" />
                                ) : (
                                    <Moon className="w-4 h-4" />
                                )}
                            <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                        </button>
                    </div>
                    <div className="h-px bg-purple-500/20 my-3" />
                </div>
            )}
        </div>
    );
};
