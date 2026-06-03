export const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://api-blog.incrivel.tech/api/';
const ADMIN_TOKEN_KEY = process.env.NEXT_PUBLIC_ADMIN_TOKEN_KEY || process.env.ADMIN_TOKEN_KEY || 'blog-incrivel-admin-token';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function adminHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...adminAuthHeaders(),
  };
}

export function adminAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function readJsonOrThrow<T>(res: Response, message: string): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.error ? `: ${data.error}` : '';
    } catch {
      // Keep the original message when the API returns an empty body.
    }
    throw new Error(`${message}${detail}`);
  }
  return res.json();
}
