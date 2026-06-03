import { supabase } from './supabase';
import { type ApiPromoCard, type DashboardPeriod, type PromoCardMetrics, type PromoCardPayload } from './apiTypes';

function periodToDate(period: DashboardPeriod): string | null {
  if (period === 'all') return null;
  const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[period];
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

async function mapCard(row: Record<string, unknown>): Promise<ApiPromoCard> {
  const author = row.author as { name?: string } | null;
  const cardPosts = (row.promo_card_posts as Array<{ posts: { id: string; title: string; slug: string } }> | null) ?? [];

  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string | null,
    image_url: row.image_url as string | null,
    cta_label: row.cta_label as string | null,
    cta_url: row.cta_url as string | null,
    status: row.status as 'active' | 'inactive',
    background_color: row.background_color as string,
    text_color: row.text_color as string,
    cta_color: row.cta_color as string,
    author_id: row.author_id as string,
    author_name: author?.name ?? null,
    posts: cardPosts.map((cp) => cp.posts),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

const CARD_SELECT = `
  *,
  author:author_id(name),
  promo_card_posts(posts(id, title, slug))
`;

export async function fetchPromoCards(): Promise<ApiPromoCard[]> {
  const { data, error } = await supabase
    .from('promo_cards')
    .select(CARD_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Falha ao buscar cards promocionais');
  return Promise.all((data ?? []).map((row) => mapCard(row as Record<string, unknown>)));
}

export async function fetchPublicPromoCards(postId?: string): Promise<ApiPromoCard[]> {
  let query = supabase
    .from('promo_cards')
    .select(CARD_SELECT)
    .eq('status', 'active');

  if (postId) {
    const { data: cardIds } = await supabase
      .from('promo_card_posts')
      .select('promo_card_id')
      .eq('post_id', postId);

    const ids = (cardIds ?? []).map((r) => r.promo_card_id);

    const { data: globalCards } = await supabase
      .from('promo_cards')
      .select(CARD_SELECT)
      .eq('status', 'active')
      .not('id', 'in', `(${ids.length ? ids.join(',') : 'null'})`)
      .not('id', 'in', `(SELECT promo_card_id FROM promo_card_posts)`);

    if (ids.length > 0) {
      const { data } = await query.in('id', ids);
      return Promise.all([...(data ?? []), ...(globalCards ?? [])].map((r) => mapCard(r as Record<string, unknown>)));
    }

    const { data: global } = await query;
    return Promise.all((global ?? []).map((r) => mapCard(r as Record<string, unknown>)));
  }

  const { data } = await query;
  return Promise.all((data ?? []).map((r) => mapCard(r as Record<string, unknown>)));
}

export async function createPromoCard(data: PromoCardPayload): Promise<ApiPromoCard> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { post_ids, ...cardData } = data;

  const { data: row, error } = await supabase
    .from('promo_cards')
    .insert({ ...cardData, author_id: session.user.id })
    .select()
    .single();

  if (error) throw new Error('Falha ao criar card promocional');

  if (post_ids && post_ids.length > 0) {
    await supabase.from('promo_card_posts').insert(
      post_ids.map((post_id) => ({ promo_card_id: row.id, post_id }))
    );
  }

  const { data: full } = await supabase.from('promo_cards').select(CARD_SELECT).eq('id', row.id).single();
  return mapCard(full as Record<string, unknown>);
}

export async function updatePromoCard(id: string, data: Partial<PromoCardPayload>): Promise<{ message: string }> {
  const { post_ids, ...cardData } = data;

  const { error } = await supabase
    .from('promo_cards')
    .update({ ...cardData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error('Falha ao atualizar card promocional');

  if (post_ids !== undefined) {
    await supabase.from('promo_card_posts').delete().eq('promo_card_id', id);
    if (post_ids.length > 0) {
      await supabase.from('promo_card_posts').insert(
        post_ids.map((post_id) => ({ promo_card_id: id, post_id }))
      );
    }
  }

  return { message: 'Card atualizado.' };
}

export async function deletePromoCard(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('promo_cards').delete().eq('id', id);
  if (error) throw new Error('Falha ao excluir card promocional');
  return { message: 'Card removido.' };
}

export async function fetchPromoCardMetrics(id: string, period: DashboardPeriod = '30d'): Promise<PromoCardMetrics> {
  const since = periodToDate(period);

  let query = supabase.from('promo_card_events').select('*').eq('promo_card_id', id);
  if (since) query = query.gte('created_at', since);

  const { data: events } = await query;
  const rows = events ?? [];

  const impressions = rows.filter((e) => e.event_type === 'impression').length;
  const clicks = rows.filter((e) => e.event_type === 'click').length;
  const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;

  // Daily series
  const dailyMap: Record<string, { impressions: number; clicks: number }> = {};
  for (const e of rows) {
    const day = e.created_at.slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { impressions: 0, clicks: 0 };
    if (e.event_type === 'impression') dailyMap[day].impressions++;
    else dailyMap[day].clicks++;
  }
  const daily = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // By post
  const postMap: Record<string, { id: string | null; title: string; slug: string | null; impressions: number; clicks: number }> = {};
  for (const e of rows) {
    const key = e.post_id ?? '__global__';
    if (!postMap[key]) postMap[key] = { id: e.post_id, title: e.post_id ? `Post ${e.post_id}` : 'Global', slug: null, impressions: 0, clicks: 0 };
    if (e.event_type === 'impression') postMap[key].impressions++;
    else postMap[key].clicks++;
  }

  return {
    period,
    totals: { impressions, clicks, ctr },
    daily,
    posts: Object.values(postMap),
  };
}

export async function trackPromoCardEvent(id: string, event_type: 'impression' | 'click', post_id?: string): Promise<{ message: string }> {
  const { error } = await supabase
    .from('promo_card_events')
    .insert({ promo_card_id: id, event_type, post_id: post_id ?? null });
  if (error) throw new Error('Falha ao registrar evento do card');
  return { message: 'Evento registrado.' };
}
