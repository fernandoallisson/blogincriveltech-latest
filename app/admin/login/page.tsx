'use client';

import React, { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { signIn, validateStoredSession } from '@/lib/auth';

function Loading() {
  return <div className="grid min-h-screen place-items-center bg-app text-muted">Verificando sessão...</div>;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    validateStoredSession().then((user) => {
      if (user) router.replace(next);
      else setChecking(false);
    });
  }, [next, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError('');
    try { await signIn(email, password); router.replace(next); }
    catch { setError('E-mail ou senha inválidos.'); }
    finally { setLoading(false); }
  }

  if (checking) return <Loading />;
  return (
    <main className="grid min-h-screen place-items-center bg-app p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-5 flex justify-center"><Logo /></div>
        <Card className="p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div><div className="text-2xl font-extrabold text-text">Entrar no admin</div></div>
            <Input label="E-mail" icon="user" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@blog.com" />
            <Input label="Senha" icon="lock" type="password" value={password} onChange={(event) => setPassword(event.target.value)} error={error} />
            <Button type="submit" full icon="lock" disabled={loading || !email || !password}>{loading ? 'Entrando...' : 'Entrar'}</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return <Suspense fallback={<Loading />}><LoginForm /></Suspense>;
}
