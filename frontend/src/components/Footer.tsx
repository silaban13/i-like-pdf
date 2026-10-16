
import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
    return (
        <footer className="mt-auto border-t border-white/10 bg-[#0D0B1C] text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 shadow-lg shadow-pink-600/20">
                            <p className="text-xl font-extrabold text-white">D</p>
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold tracking-wide text-white"> I-LIKE<span className="text-pink-400">PDF</span> </h3>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-3 text-xs sm:text-sm">
                        <a href="#" className="transition-colors hover:text-pink-400" > Beranda </a>
                        <a href="#" className="transition-colors hover:text-pink-400" > PDF to Word </a>
                        <a href="#" className="transition-colors hover:text-pink-400" > Word to PDF </a>
                    </div>
                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' }) } className="flex items-center gap-2 rounded-xl border border-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400">
                        Kembali ke atas
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-7 border-t border-white/10 pt-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                        <p> © {currentYear} I-LIKE PDF. All rights reserved. </p>
                        <p className="flex items-center gap-1.5">
                            Dibuat dengan
                            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            untuk memudahkan pengelolaan PDF.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
