import { useState } from 'react';
import { ActiveTab, User } from './types';
import { Header } from './components/Navbar';
import { HeroHome } from './pages/HeroHome';
import { PDFtoWord } from './pages/PDFtoWord';
import { WordtoPDF } from './pages/WordtoPDF';
import { Footer } from './components/Footer';
import { LaravelGuideModal } from './pages/LaravelGuideModal';
import { HelpModal } from './pages/HelpModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isLaravelGuideOpen, setIsLaravelGuideOpen] = useState<boolean>(false);
  const [currentUser] = useState<User | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const handleHeroFilesSelected = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (arr.length === 0) return;
    setStagedFiles(arr);
    setActiveTab('pdf-to-word');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${ darkMode ? 'bg-[#0b0c16] text-slate-100' : 'bg-slate-50 text-slate-900' }`} >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="fixed top-32 right-10 w-[400px] h-[300px] bg-pink-600/10 blur-[120px] pointer-events-none rounded-full" />
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenLaravelModal={() => setIsLaravelGuideOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className="flex-1 w-full py-2 sm:py-4">
        {activeTab === 'beranda' && (
          <HeroHome onSelectFiles={handleHeroFilesSelected} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'pdf-to-word' && (
          <PDFtoWord currentUser={currentUser} initialFile={stagedFiles[0]} />
        )}

        {activeTab === 'word-to-pdf' && (
          <WordtoPDF currentUser={currentUser} initialFile={stagedFiles[0]} />
        )}
      </main>
      <Footer />
      <LaravelGuideModal isOpen={isLaravelGuideOpen} onClose={() => setIsLaravelGuideOpen(false)}/>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}