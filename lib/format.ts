export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function estimateReadTime(content: string): string {
  const words = content?.split(/\s+/).length ?? 0;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min`;
}
