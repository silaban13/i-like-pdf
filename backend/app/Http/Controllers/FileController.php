<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:doc,docx|max:10240',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $filePath = $file->storeAs(
            'temporary',
            $fileName
        );

        return response()->json([
            'success' => true,
            'message' => 'File berhasil diupload',
            'file_name' => $fileName,
            'file_path' => $filePath,
        ]);
    }

    public function convert(Request $request)
    {
        $request->validate([
            'file_path' => [
                'required',
                'string',
                'regex:/^temporary\/[A-Za-z0-9._ -]+\.(doc|docx)$/i',
            ],
            'file_name' => 'required|string|max:255',
        ]);

        $filePath = $request->input('file_path');
        $originalName = $request->input('file_name');
        if (!Storage::exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan',
                'file_path' => $filePath,
            ], 404);
        }

        $inputPath = Storage::path($filePath);
        $outputDir = storage_path('app/private/converted');
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $soffice = 'C:\Program Files\LibreOffice\program\soffice.com';
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $baseName = preg_replace(
            '/[<>:"\/\\\\|?*\x00-\x1F]/',
            '_',
            $baseName
        );
        $baseName = trim($baseName, ". ");
        if ($baseName === '') {
            $baseName = 'Dokumen';
        }

        $pdfName = $baseName . '.pdf';
        $counter = 1;
        while (file_exists($outputDir . DIRECTORY_SEPARATOR . $pdfName)) {
            $pdfName = $baseName . '(' . $counter . ').pdf';
            $counter++;
        }

        $pdfPath = $outputDir . DIRECTORY_SEPARATOR . $pdfName;
        $generatedName = pathinfo($inputPath, PATHINFO_FILENAME) . '.pdf';
        $generatedPath = $outputDir . DIRECTORY_SEPARATOR . $generatedName;
        $command = '"' . $soffice . '" --headless --convert-to pdf --outdir "'
            . $outputDir . '" "' . $inputPath . '"';

        $result = [];
        $code = 0;
        exec($command . ' 2>&1', $result, $code);
        if (
            $code !== 0 ||
            !file_exists($generatedPath) ||
            filesize($generatedPath) === 0
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Konversi gagal',
                'exit_code' => $code,
                'detail' => implode(PHP_EOL, $result),
            ], 500);
        }

        if (!rename($generatedPath, $pdfPath)) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan nama file PDF',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Konversi berhasil',
            'file_name' => $pdfName,
            'file_path' => 'converted/' . $pdfName,
        ]);
    }

    public function pdfToWord(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $file = $request->file('file');
        $inputPath = $file->store('temporary');
        $fullInputPath = storage_path('app/private/' . $inputPath);
        $outputDir = storage_path('app/private/converted');
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $outputName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . uniqid() . '.docx';
        $outputPath = $outputDir . DIRECTORY_SEPARATOR . $outputName;
        $scriptPath = base_path('convert_pdf.py');
        $python = 'python';

        $command = escapeshellarg($python) . ' '
            . escapeshellarg($scriptPath) . ' '
            . escapeshellarg($fullInputPath) . ' '
            . escapeshellarg($outputPath) . ' 2>&1';

        exec($command, $result, $code);

        if ($code !== 0 || !file_exists($outputPath) || filesize($outputPath) === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Konversi PDF ke Word gagal',
                'detail' => implode(PHP_EOL, $result),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Konversi PDF ke Word berhasil',
            'file_name' => $outputName,
            'file_path' => 'converted/' . $outputName,
        ]);
    }

    public function download($filename)
    {
        $filename = basename($filename);
        $filePath = storage_path(
            'app/private/converted/' . $filename
        );

        if (!is_file($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan',
            ], 404);
        }

        return response()
            ->download($filePath, $filename)
            ->deleteFileAfterSend(true);
    }

    public function delete($filename)
    {
        $filename = basename($filename);
        $filePath = storage_path(
            'app/private/converted/' . $filename
        );

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan',
            ], 404);
        }

        unlink($filePath);
        return response()->json([
            'success' => true,
            'message' => 'File berhasil dihapus',
        ]);
    }

    public function deleteTemp($filename)
    {
        $filename = basename($filename);
        $filePath = storage_path(
            'app/private/temporary/' . $filename
        );

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak ditemukan',
            ], 404);
        }

        unlink($filePath);
        return response()->json([
            'success' => true,
            'message' => 'File PDF sementara berhasil dihapus',
        ]);
    }
    
}