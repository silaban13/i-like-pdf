import React from 'react';
import { X, HelpCircle, ShieldCheck, Zap, Layers, ScanText, FileSpreadsheet, Lock } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Bagaimana cara menggabungkan (Merge) beberapa PDF?',
      a: 'Pilih tab Merge PDF, unggah minimal 2 file PDF, Anda bisa mengatur urutan file menggunakan tombol panah atas/bawah, lalu klik Gabungkan PDF Sekarang.'
    },
    {
      q: 'Seberapa besar kompresi file yang bisa dicapai?',
      a: 'Tergantung opsi yang dipilih: Ekstrem (hingga ~80%), Rekomendasi (hingga ~50%), atau Ringan (hingga ~20%). Dokumen teks tetap dapat dibaca dengan jelas.'
    },
    {
      q: 'Apakah file hasil konversi Word (.docx) bisa diedit?',
      a: 'Ya, file yang diunduh berformat .docx standar yang kompatibel dengan Microsoft Office, Google Docs, WPS, dan aplikasi pengolah kata lainnya.'
    },
    {
      q: 'Bagaimana cara kerja OCR Dokumen?',
      a: 'OCR (Optical Character Recognition) memindai piksel karakter huruf dalam file PDF scan atau foto dokumen, mengekstraknya menjadi teks yang dapat dicopy atau diunduh sebagai file .txt.'
    },
    {
      q: 'Apakah dokumen saya aman dan terjaga privasinya?',
      a: 'Sangat aman! Pemrosesan dilakukan dengan standar enkripsi tinggi dan file riwayat dapat Anda hapus kapan saja dari menu Manajemen File.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-[#141226] border border-purple-500/30 p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Pusat Bantuan & Panduan Penggunaan</h3>
            <p className="text-xs text-purple-300/70">I-LIKE PDF Tools Suite</p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 my-2 flex-1">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#1a1735] border border-purple-500/20">
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">{faq.q}</h4>
              <p className="text-xs text-purple-300/80 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-purple-500/15 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
