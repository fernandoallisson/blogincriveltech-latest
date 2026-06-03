// Legacy stub — actual data access is now handled directly via Supabase client in each api*.ts file.
// Kept for any remaining imports that may still reference these symbols.
export const API_URL = '';

export function adminHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

export function adminAuthHeaders(): HeadersInit {
  return {};
}

export async function readJsonOrThrow<T>(res: Response, message: string): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.error ? `: ${data.error}` : '';
    } catch {
      // ignore
    }
    throw new Error(`${message}${detail}`);
  }
  return res.json();
}
