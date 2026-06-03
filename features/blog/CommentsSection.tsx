'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import Icon from '@/components/Icon';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { createComment, formatDateLong, type ApiComment, type ApiPost } from '@/lib/api';

const emptyComment = { name: '', email: '', content: '' };

export default function CommentsSection({ post, comments, onReload }: { post: ApiPost; comments: ApiComment[]; onReload: () => Promise<void> }) {
  const [form, setForm] = useState(emptyComment);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { name: form.name.trim(), email: form.email.trim(), content: form.content.trim() };
    if (!payload.name || !payload.email || !payload.content) {
      setStatus('Preencha nome, e-mail e comentário para enviar.');
      return;
    }

    setSubmitting(true);
    setSubmitted(false);
    setStatus('');
    try {
      await createComment({ post_id: post.id, ...payload });
      setForm(emptyComment);
      setSubmitted(true);
      await onReload();
    } catch {
      setStatus('Não foi possível enviar o comentário agora.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 md:px-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[28px] font-bold leading-tight tracking-normal text-text">Conversa do post</h2>
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-muted">
            Compartilhe uma dúvida, uma experiência ou um complemento para enriquecer a leitura.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted">
          <Icon name="inbox" size={16} className="text-brand" />
          {comments.length} {comments.length === 1 ? 'comentário' : 'comentários'}
        </div>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_390px]">
        <CommentsList comments={comments} />
        <div className="rounded-md border border-border bg-surface/45 p-5 shadow-sm">
          <form className="grid gap-4" onSubmit={submit}>
            {submitting ? (
              <FormStatePanel
                tone="loading"
                title="Enviando seu comentário"
                text="Estamos registrando sua contribuição. Isso leva só um instante."
              />
            ) : submitted ? (
              <FormStatePanel
                tone="success"
                title="Obrigado pelo comentário"
                text="Ele foi enviado para aprovação e aparece na conversa assim que for revisado."
                action={
                  <Button
                    type="button"
                    variant="secondary"
                    icon="edit"
                    onClick={() => {
                      setSubmitted(false);
                      setStatus('');
                    }}
                    full
                  >
                    Enviar outro comentário
                  </Button>
                }
              />
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-text">Entrar na conversa</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">Seu comentário passa por aprovação antes de aparecer aqui.</p>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-1">
                  <Input label="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Seu nome" />
                  <Input label="E-mail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="seu@email.com" />
                </div>
                <Textarea label="Comentário" rows={5} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Escreva sua contribuição" />
                {status && (
                  <div className="rounded-md border border-border bg-glass px-3 py-2 text-xs leading-5 text-muted">
                    {status}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button type="submit" icon="check" className="w-full sm:w-auto md:w-full">Enviar comentário</Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function FormStatePanel({
  tone,
  title,
  text,
  action,
}: {
  tone: 'loading' | 'success';
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-md border border-border bg-glass px-5 py-8 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand/25 bg-brand/10 text-brand">
          {tone === 'loading' ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" aria-hidden="true" />
          ) : (
            <Icon name="check" size={20} />
          )}
        </div>
        <h3 className="mt-4 text-lg font-bold text-text">{title}</h3>
        <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-muted">{text}</p>
        {tone === 'success' && (
          <div className="mt-5 rounded-md border border-border bg-surface/45 px-4 py-3 text-sm leading-6 text-muted">
            Deseja enviar outro comentário?
          </div>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

function CommentsList({ comments }: { comments: ApiComment[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface/30">
      {comments.length === 0 ? (
        <div className="grid min-h-[230px] place-items-center px-6 py-10 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand/25 bg-brand/10 text-brand">
              <Icon name="quote" size={20} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-text">A conversa ainda está esperando a primeira voz.</h3>
            <p className="mx-auto mt-2 max-w-[440px] text-sm leading-6 text-muted">
              Deixe uma pergunta, uma ideia ou um ponto de vista. Depois da aprovação, seu comentário aparece aqui.
            </p>
          </div>
        </div>
      ) : (
        comments.map((comment) => (
          <article key={comment.id} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 border-b border-border px-4 py-4 last:border-b-0 md:px-5">
            <Avatar name={comment.name} size={38} />
            <div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                <h3 className="text-sm font-bold text-text">{comment.name}</h3>
                <span className="hidden h-1 w-1 rounded-full bg-border-strong sm:block" />
                <time className="text-xs text-subtle">{formatDateLong(comment.created_at)}</time>
              </div>
              <p className="mt-2 leading-7 text-muted">{comment.content}</p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
