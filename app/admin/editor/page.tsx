import Link from 'next/link';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminEditorPage() {
  return (
    <AdminPageShell active="posts" title="Editor" eyebrow="Use Posts para criar e editar">
      <Card className="p-4">
        <p className="mb-4 text-muted">O editor visual foi preservado como rota, mas o CRUD principal está em Posts.</p>
        <Link href="/admin/posts"><Button icon="file">Ir para Posts</Button></Link>
      </Card>
    </AdminPageShell>
  );
}
