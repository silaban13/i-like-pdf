
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

interface ApiResponse {
  success: boolean;
  message: string;
  file_name?: string;
  file_path?: string;
  detail?: string;
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.message || data.detail || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}: Terjadi kesalahan pada server`;
  }
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<T>;
}

export async function uploadWordFile(file: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return requestJson<ApiResponse>(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
}

export async function convertWordToPdf(
  filePath: string,
  fileName: string
): Promise<ApiResponse> {
  return requestJson<ApiResponse>(`${API_BASE_URL}/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      file_path: filePath,
      file_name: fileName,
    }),
  });
}

export async function convertPdfToWordOnServer(
  file: File
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return requestJson<ApiResponse>(`${API_BASE_URL}/pdf-to-word`, {
    method: 'POST',
    body: formData,
  });
}

export async function downloadConvertedFile(
  filename: string
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE_URL}/download/${encodeURIComponent(filename)}`,
    { headers: { Accept: '*/*' } }
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.blob();
}

export async function deleteConvertedFile(
  filename: string
): Promise<ApiResponse> {
  return requestJson<ApiResponse>(
    `${API_BASE_URL}/delete/${encodeURIComponent(filename)}`,
    { method: 'DELETE' }
  );
}

export async function deleteTemporaryFile(
  filename: string
): Promise<ApiResponse> {
  return requestJson<ApiResponse>(
    `${API_BASE_URL}/delete-temp/${encodeURIComponent(filename)}`,
    { method: 'DELETE' }
  );
}
