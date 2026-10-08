<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanTemporaryFiles extends Command
{
    protected $signature = 'files:clean';
    protected $description = 'Menghapus file sementara yang sudah lebih dari 1 jam';

    public function handle()
    {
        $directories = [
            storage_path('app/private/temporary'),
            storage_path('app/private/converted'),
        ];

        $deleted = 0;
        $cutoff = time() - 3600; // 1 jam

        foreach ($directories as $directory) {
            if (!is_dir($directory)) {
                continue;
            }

            foreach (glob($directory . DIRECTORY_SEPARATOR . '*') as $file) {
                if (!is_file($file)) {
                    continue;
                }

                if (filemtime($file) < $cutoff) {
                    if (unlink($file)) {
                        $deleted++;
                    }
                }
            }
        }

        $this->info("$deleted file lama berhasil dihapus.");

        return Command::SUCCESS;
    }
}