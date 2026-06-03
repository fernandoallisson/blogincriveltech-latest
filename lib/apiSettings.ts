import { supabase } from './supabase';
import { type ApiSetting } from './apiTypes';

export async function subscribeNewsletter(data: { email: string; name?: string }) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: data.email, name: data.name ?? null, status: 'active' });
  if (error) throw new Error('Falha ao inscrever no newsletter');
  return { message: 'Inscrito com sucesso.' };
}

export async function fetchSettings(): Promise<ApiSetting[]> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('key');
  if (error) throw new Error('Falha ao buscar configurações');
  return data ?? [];
}

export async function createSetting(data: { key: string; value: string }): Promise<ApiSetting> {
  const { data: row, error } = await supabase
    .from('settings')
    .insert(data)
    .select()
    .single();
  if (error) throw new Error('Falha ao criar configuração');
  return row;
}

export async function updateSetting(id: string, data: { key: string; value: string }): Promise<{ message: string }> {
  const { error } = await supabase
    .from('settings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Falha ao atualizar configuração');
  return { message: 'Configuração atualizada.' };
}

export async function deleteSetting(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('settings').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar configuração');
  return { message: 'Configuração removida.' };
}

export function getSettingValue(settings: ApiSetting[], key: string): string | undefined {
  return settings.find((s) => s.key === key)?.value;
}
