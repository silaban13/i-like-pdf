<?php

$soffice = 'C:\Program Files\LibreOffice\program\soffice.com';

$input = __DIR__ .
    '\storage\app\private\temporary\BjVN2Xx76cBBoLrFzJKhlIZzP75PFJU47j0Sn61g.docx';

$output = __DIR__ . '\storage\app\private\converted';

$command = '"' . $soffice . '" --headless --convert-to pdf --outdir "' .
    $output . '" "' . $input . '"';

exec($command . ' 2>&1', $result, $code);

echo "Exit code: " . $code . PHP_EOL;
echo implode(PHP_EOL, $result);