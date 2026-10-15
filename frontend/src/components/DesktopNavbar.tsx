import React from 'react';
import { ActiveTab } from '../types';
import { Sun, Moon, HelpCircle, } from 'lucide-react';
import { Navigation } from './Navigation';

interface DesktopNavbarProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    onOpenHelp: () => void;
    onOpenLaravelModal: () => void;
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ activeTab, setActiveTab, onOpenHelp, darkMode, setDarkMode, }) => {
    return (
        <> 
            <button onClick={() => setActiveTab('beranda')} className="hidden lg:flex items-center gap-3 text-left group transition-transform hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                    <span className="font-extrabold text-white text-xl tracking-tighter"> D </span>
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xl tracking-tight text-white"> I-LIKE </span>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent"> PDF </span>
                    </div>
                </div>
            </button>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="hidden lg:flex items-center gap-2.5">
                <button onClick={onOpenHelp} className="flex items-center gap-1 text-xs text-purple-200/80 hover:text-white px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span>Bantuan</span>
                </button>
                <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-full bg-[#1c1935] border border-purple-500/20 hover:border-purple-400/40 text-amber-300 transition-colors" title={darkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}>
                    {darkMode ? (
                        <Sun className="w-4 h-4 fill-amber-400" />
                    ) : (
                        <Moon className="w-4 h-4 text-slate-300" />
                    )}
                </button>
            </div>
        </>
    );
};
