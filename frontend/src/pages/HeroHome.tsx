import React, { useRef, useState } from 'react';
import {  UploadCloud, ShieldCheck, FileUp, Settings, Download, FolderOpen, Cloud } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroHomeProps {
  onSelectFiles: (files: FileList | File[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onSelectFiles, setActiveTab }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; 
  const validateFiles = (files: FileList | File[]) => {
  const selectedFiles = Array.from(files);
  if (selectedFiles.length === 0) return;
  const invalidFiles = selectedFiles.filter((file) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    return !isPdf || file.size > MAX_FILE_SIZE;
  });

  if (invalidFiles.length > 0) {
    const tooLarge = invalidFiles.some(
      (file) => file.size > MAX_FILE_SIZE
    );

    alert( tooLarge ? 'Ukuran setiap file PDF maksimal 50 MB.' : 'Format file tidak valid. Silakan pilih file PDF.' );
    return;
  }

  onSelectFiles(selectedFiles);
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
  if (e.dataTransfer.files.length > 0) {
    validateFiles(e.dataTransfer.files);
  }
};

const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
  if (e.target.files && e.target.files.length > 0) {
    validateFiles(e.target.files);
  }

  e.target.value = '';
};

const openFileDialog = () => {
  fileInputRef.current?.click();
};

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <input ref={fileInputRef} type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#141226]/90 border border-purple-500/20 shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Kelola Cerdas.{' '}
              <span className="block mt-1 font-serif italic font-medium bg-gradient-to-r from-pink-300 via-rose-300 to-red-400 bg-clip-text text-transparent"> Kerja Lebih Cepat. </span>
            </h1>
            <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Ucapkan selamat tinggal pada tugas berulang. Platform PDF kami memudahkan penggabungan,
              kompresi, dan konversi dokumen sehingga tim Anda bisa fokus pada hal yang penting.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button onClick={openFileDialog} className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <FileUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                <span>Pilih Dokumen PDF</span>
              </button>
            </div>
            <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-purple-200/80">
              <div className="flex items-center gap-1.5 text-purple-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">File Terenkripsi Otomatis</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={openFileDialog} className={`group relative rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer ${ isDragging ? 'border-pink-500 bg-pink-500/10 scale-[1.02]' : 'border-purple-500/30 hover:border-pink-500/60 bg-[#191632]/80 hover:bg-[#1f1b3d]/90' }`} >
              <div className="w-16 h-16 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-300 group-hover:text-pink-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/40">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1"> Tarik & Lepaskan File PDF </h2>
              <p className="text-xs text-purple-300/70 mb-4"> atau klik untuk memilih file dari perangkat Anda </p>
              <p className="text-xs text-purple-300/70 mb-4"> mengubah PDF ke WORD </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#231f45] text-purple-300 border border-purple-500/20"> PDF </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#231f45] text-purple-300/80 border border-purple-500/20"> Maks 50MB </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-purple-300/70 pt-2 border-t border-purple-500/15 w-full justify-center">
                <span>Dukungan:</span>
                <div className="flex items-center gap-1.5 font-medium text-purple-200">
                  <Cloud className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Drive</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-purple-200">
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dropbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-purple-500/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-10 h-10 rounded-xl bg-[#211d42] border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2">
                <FileUp className="w-5 h-5 text-pink-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-0.5">1. Upload</h4>
              <p className="text-[11px] text-purple-300/70">Pilih atau tarik file PDF Anda</p>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-10 h-10 rounded-xl bg-[#211d42] border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-0.5">2. Pilih Alat</h4>
              <p className="text-[11px] text-purple-300/70">Gabung, kompres, atau konversi</p>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-10 h-10 rounded-xl bg-[#211d42] border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-0.5">3. Download</h4>
              <p className="text-[11px] text-purple-300/70">Hasil siap diunduh dalam hitungan detik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
