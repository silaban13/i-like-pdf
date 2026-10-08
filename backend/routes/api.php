<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FileController;

Route::post('/upload', [FileController::class, 'upload']);
Route::post('/convert', [FileController::class, 'convert']);
Route::post('/pdf-to-word', [FileController::class, 'pdfToWord']);
Route::get('/download/{filename}', [FileController::class, 'download']);
Route::delete('/delete/{filename}', [FileController::class, 'delete']);
Route::delete('/delete-temp/{filename}', [FileController::class, 'deleteTemp']);