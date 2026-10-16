
import { ProcessedFile } from '../types';

const STORAGE_KEY = 'ilike_pdf_history_v1';
export function getFileHistory(): ProcessedFile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed as ProcessedFile[];
  } catch (error) {
    console.error('Gagal memuat riwayat file:', error);
    return [];
  }
}

export function saveFileHistoryItem(item: ProcessedFile): void {
  try {
    const list = getFileHistory();
    const updated = [
      item,
      ...list.filter((existing) => existing.id !== item.id),
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Gagal menyimpan riwayat file:', error);
  }
}

export function deleteFileHistoryItem(id: string): void {
  try {
    const updated = getFileHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Gagal menghapus riwayat file:', error);
  }
}

export function clearAllFileHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Gagal membersihkan riwayat file:', error);
  }
}

export function formatBytes(
  bytes: number,
  decimals: number = 2
): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const precision = Math.max(0, decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );

  return `${parseFloat(
    (bytes / Math.pow(k, i)).toFixed(precision)
  )} ${sizes[i]}`;
}
