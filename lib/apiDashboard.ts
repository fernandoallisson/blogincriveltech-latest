import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type DashboardMetrics, type DashboardPeriod } from './apiTypes';

export async function fetchDashboardMetrics(period: DashboardPeriod = '30d'): Promise<DashboardMetrics> {
  const res = await fetch(`${API_URL}/dashboard/metrics?period=${period}`, { headers: adminHeaders() });
  return readJsonOrThrow<DashboardMetrics>(res, 'Falha ao buscar metricas do dashboard');
}
