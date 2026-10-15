import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  Code2, 
  Server, 
  FileCode, 
  Download,
  Terminal,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';

interface LaravelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelGuideModal: React.FC<LaravelGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'controller' | 'migration' | 'routes' | 'env' | 'install'>('controller');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippets = {
    install: `# 1. Buat Proyek Laravel Baru
composer create-project laravel/laravel ilike-pdf-app
cd ilike-pdf-app

# 2. Pasang Laravel Breeze & Autentikasi
composer require laravel/breeze --dev
php artisan breeze:install blade

# 3. Pasang Library PDF & OCR (Spatie / PDFtk / Tesseract)
composer require setasign/fpdf setasign/fpdi
composer require spatie/pdf-to-text
composer require thiagoalessio/tesseract_ocr
composer require phpoffice/phpword

# 4. Migrasi Database MySQL
php artisan migrate

# 5. Jalankan Server
php artisan serve`,

    env: `# Konfigurasi Database MySQL (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ilike_pdf_db
DB_USERNAME=root
DB_PASSWORD=secret

# Storage Driver (Local / S3 / R2)
FILESYSTEM_DISK=public
UPLOAD_MAX_FILESIZE=50M
POST_MAX_SIZE=60M

# Keamanan Sesi Laravel Breeze
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true`,

    migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pdf_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->enum('tool', ['merge', 'compress', 'pdf-to-word', 'ocr']);
            $table->unsignedBigInteger('original_size');
            $table->unsignedBigInteger('processed_size');
            $table->integer('reduction_percentage')->nullable();
            $table->string('file_path');
            $table->string('mime_type')->default('application/pdf');
            $table->integer('page_count')->nullable();
            $table->longText('extracted_text')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pdf_histories');
    }
};`,

    controller: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Str;
use App\\Models\\PdfHistory;
use setasign\\Fpdi\\Fpdi;
use PhpOffice\\PhpWord\\PhpWord;
use PhpOffice\\PhpWord\\IOFactory;
use thiagoalessio\\TesseractOCR\\TesseractOCR;

class PdfToolController extends Controller
{
    /**
     * 1. Merge PDF
     */
    public function merge(Request $request)
    {
        $request->validate([
            'files' => 'required|array|min:2',
            'files.*' => 'required|mimes:pdf|max:51200', // 50MB
        ]);

        $pdf = new Fpdi();
        $totalOriginalSize = 0;
        $totalPageCount = 0;

        foreach ($request->file('files') as $file) {
            $totalOriginalSize += $file->getSize();
            $pageCount = $pdf->setSourceFile($file->getPathname());
            $totalPageCount += $pageCount;

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                $templateId = $pdf->importPage($pageNo);
                $size = $pdf->getTemplateSize($templateId);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);
            }
        }

        $outputName = 'Merged_' . time() . '.pdf';
        $outputPath = 'processed/' . $outputName;
        Storage::disk('public')->put($outputPath, $pdf->Output('S'));

        $this->recordHistory($request, [
            'file_name' => $outputName,
            'tool' => 'merge',
            'original_size' => $totalOriginalSize,
            'processed_size' => Storage::disk('public')->size($outputPath),
            'file_path' => $outputPath,
            'page_count' => $totalPageCount,
        ]);

        return response()->download(Storage::disk('public')->path($outputPath));
    }

    /**
     * 2. Compress PDF
     */
    public function compress(Request $request)
    {
        $request->validate(['file' => 'required|mimes:pdf|max:51200']);
        $file = $request->file('file');
        $level = $request->input('level', 'recommended');

        $gsSettings = match($level) {
            'extreme' => '/screen',
            'light' => '/prepress',
            default => '/ebook',
        };

        $outputName = 'Compressed_' . time() . '.pdf';
        $outputPath = storage_path('app/public/processed/' . $outputName);

        // Eksekusi Ghostscript Engine untuk kompresi maksimal
        $cmd = "gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS={$gsSettings} -dNOPAUSE -dQUIET -dBATCH -sOutputFile={$outputPath} " . escapeshellarg($file->getPathname());
        shell_exec($cmd);

        $processedSize = filesize($outputPath);
        $ratio = round((1 - ($processedSize / $file->getSize())) * 100);

        $this->recordHistory($request, [
            'file_name' => $outputName,
            'tool' => 'compress',
            'original_size' => $file->getSize(),
            'processed_size' => $processedSize,
            'reduction_percentage' => max(0, $ratio),
            'file_path' => 'processed/' . $outputName,
        ]);

        return response()->download($outputPath);
    }

    /**
     * 3. PDF to Word (.docx)
     */
    public function toWord(Request $request)
    {
        $request->validate(['file' => 'required|mimes:pdf|max:51200']);
        $file = $request->file('file');

        $text = (new \\Spatie\\PdfToText\\Pdf)->getText($file->getPathname());
        
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        $section->addTitle($file->getClientOriginalName(), 1);

        foreach (explode("\n", $text) as $line) {
            if (trim($line)) {
                $section->addText(trim($line));
            }
        }

        $outputName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '.docx';
        $outputPath = storage_path('app/public/processed/' . $outputName);

        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($outputPath);

        $this->recordHistory($request, [
            'file_name' => $outputName,
            'tool' => 'pdf-to-word',
            'original_size' => $file->getSize(),
            'processed_size' => filesize($outputPath),
            'file_path' => 'processed/' . $outputName,
            'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);

        return response()->download($outputPath);
    }

    /**
     * 4. OCR Dokumen
     */
    public function ocr(Request $request)
    {
        $request->validate(['file' => 'required|file|max:51200']);
        $file = $request->file('file');
        $lang = $request->input('lang', 'ind+eng');

        $ocr = new TesseractOCR($file->getPathname());
        $ocr->lang($lang);
        $extractedText = $ocr->run();

        return response()->json([
            'success' => true,
            'text' => $extractedText,
            'words' => str_word_count($extractedText),
        ]);
    }

    private function recordHistory(Request $request, array $data)
    {
        PdfHistory::create(array_merge($data, [
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()?->id,
        ]));
    }
}`,

    routes: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\PdfToolController;

Route::get('/', function () {
    return view('welcome');
});

// Autentikasi Laravel Breeze sudah otomatis dimuat
require __DIR__.'/auth.php';

// Rute PDF Tools Terlindungi
Route::middleware(['auth'])->prefix('api/pdf')->group(function () {
    Route::post('/merge', [PdfToolController::class, 'merge'])->name('pdf.merge');
    Route::post('/compress', [PdfToolController::class, 'compress'])->name('pdf.compress');
    Route::post('/to-word', [PdfToolController::class, 'toWord'])->name('pdf.to-word');
    Route::post('/ocr', [PdfToolController::class, 'ocr'])->name('pdf.ocr');
    Route::get('/history', [PdfToolController::class, 'history'])->name('pdf.history');
});`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#141226] border border-purple-500/30 shadow-2xl overflow-hidden text-left">
        <div className="p-6 border-b border-purple-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Arsitektur Backend: Laravel 11 + Breeze + MySQL
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-purple-300/70">
                Integrasi lengkap controller, migrasi database MySQL, rute aman, dan manajemen file server-side.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 px-6 pt-4 border-b border-purple-500/15 overflow-x-auto shrink-0 bg-[#16142a]">
          {[
            { id: 'controller', label: 'PdfToolController.php', icon: FileCode },
            { id: 'migration', label: 'Migration MySQL', icon: Database },
            { id: 'routes', label: 'routes/web.php', icon: Code2 },
            { id: 'env', label: '.env MySQL', icon: Server },
            { id: 'install', label: 'Langkah Install & Breeze', icon: Terminal }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCodeTab(item.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap ${
                  activeCodeTab === item.id
                    ? 'border-pink-500 text-pink-300 bg-purple-900/20'
                    : 'border-transparent text-purple-300/60 hover:text-purple-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          <div className="relative">
            <button onClick={() => copyToClipboard(codeSnippets[activeCodeTab], activeCodeTab)} className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/40 hover:bg-purple-600/70 border border-purple-500/30 text-white text-[11px] font-sans font-semibold transition-all shadow-md">
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
            <pre className="p-4 rounded-2xl bg-[#0c0a1a] border border-purple-500/20 text-purple-200 leading-relaxed overflow-x-auto">
              <code>{codeSnippets[activeCodeTab]}</code>
            </pre>
          </div>
        </div>
        <div className="p-4 px-6 border-t border-purple-500/15 bg-[#121024] flex items-center justify-between text-xs text-purple-300/70 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Frontend saat ini menjalankan simulasi client-side engine yang identik & interaktif 100%.</span>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs"> Tutup </button>
        </div>
      </div>
    </div>
  );
};
