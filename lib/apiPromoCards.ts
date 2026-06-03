import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiPromoCard, type DashboardPeriod, type PromoCardMetrics, type PromoCardPayload } from './apiTypes';

export async function fetchPromoCards(): Promise<ApiPromoCard[]> {
  const res = await fetch(`${API_URL}/promo-cards`, { headers: adminHeaders() });
  return readJsonOrThrow<ApiPromoCard[]>(res, 'Falha ao buscar cards promocionais');
}

export async function fetchPublicPromoCards(postId?: number | string): Promise<ApiPromoCard[]> {
  const query = postId ? `?post_id=${postId}` : '';
  const res = await fetch(`${API_URL}/promo-cards/public${query}`);
  return readJsonOrThrow<ApiPromoCard[]>(res, 'Falha ao buscar cards promocionais');
}

export async function createPromoCard(data: PromoCardPayload): Promise<ApiPromoCard> {
  const res = await fetch(`${API_URL}/promo-cards`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiPromoCard>(res, 'Falha ao criar card promocional');
}

export async function updatePromoCard(id: number | string, data: Partial<PromoCardPayload>) {
  const res = await fetch(`${API_URL}/promo-cards/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar card promocional');
}

export async function deletePromoCard(id: number | string) {
  const res = await fetch(`${API_URL}/promo-cards/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao excluir card promocional');
}

export async function fetchPromoCardMetrics(id: number | string, period: DashboardPeriod = '30d'): Promise<PromoCardMetrics> {
  const res = await fetch(`${API_URL}/promo-cards/${id}/metrics?period=${period}`, { headers: adminHeaders() });
  return readJsonOrThrow<PromoCardMetrics>(res, 'Falha ao buscar metricas do card');
}

export async function trackPromoCardEvent(id: number | string, event_type: 'impression' | 'click', post_id?: number | string) {
  const res = await fetch(`${API_URL}/promo-cards/${id}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type, post_id: post_id ? Number(post_id) : null }),
  });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao registrar evento do card');
}
