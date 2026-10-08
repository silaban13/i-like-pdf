<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class FileController extends Controller
{
    // Upload file
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:doc,docx|max:10240',
        ]);

        $file = $request->file('file');

        $fileName = $file->getClientOriginalName();
        $filePath = $file->store('temporary');

        return response()->json([
            'success' => true,
            'message' => 'File berhasil diupload',
            'file_name' => $fileName,
            'file_path' => $filePath,
        ]);
    }

// Convert Word ke PDF
public function convert(Request $request)
{
    $request->validate([
        'file_path' => [
            'required',
            'string',
            'regex:/^temporary\/[A-Za-z0-9._-]+\.(doc|docx)$/i',
        ],
    ]);

    $filePath = $request->input('file_path');

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

$pdfName = pathinfo($inputPath, PATHINFO_FILENAME) . '.pdf';
$pdfPath = $outputDir . DIRECTORY_SEPARATOR . $pdfName;

// Hapus PDF lama agar tidak dianggap hasil konversi baru
if (file_exists($pdfPath)) {
    unlink($pdfPath);
}

$command = '"' . $soffice . '" --headless --convert-to pdf --outdir "' .
    $outputDir . '" "' . $inputPath . '"';

$result = [];
$code = 0;

exec($command . ' 2>&1', $result, $code);

if (!file_exists($pdfPath) || filesize($pdfPath) === 0) {
    return response()->json([
        'success' => false,
        'message' => 'Konversi gagal',
        'exit_code' => $code,
        'detail' => implode(PHP_EOL, $result),
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

    $outputName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        . '_' . uniqid() . '.docx';

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

    if (!file_exists($filePath)) {
        return response()->json([
            'success' => false,
            'message' => 'File tidak ditemukan',
        ], 404);
    }

    return response()->download($filePath);
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