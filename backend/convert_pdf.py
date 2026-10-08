import sys
from pdf2docx import Converter

if len(sys.argv) != 3:
    print("Penggunaan: python convert_pdf.py input.pdf output.docx")
    sys.exit(1)

pdf_file = sys.argv[1]
docx_file = sys.argv[2]

try:
    cv = Converter(pdf_file)
    cv.convert(docx_file)
    cv.close()
    print("Konversi berhasil:", docx_file)
except Exception as e:
    print("Konversi gagal:", e)
    sys.exit(1)