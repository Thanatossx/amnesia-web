import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">Admin Dashboard</h1>
      <p className="mt-2 text-text-muted">
        Sol menüden etkinlikler, videolar, başvurular veya iletişim mesajlarını yönetebilirsiniz.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/events"
          className="rounded-xl border border-accent/20 bg-background-dark p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
        >
          <span className="font-medium text-text-bright">Etkinlikler</span>
          <p className="mt-1 text-sm text-text-muted">Yeni etkinlik oluştur</p>
        </Link>
        <Link
          href="/admin/videos"
          className="rounded-xl border border-accent/20 bg-background-dark p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
        >
          <span className="font-medium text-text-bright">Videolar</span>
          <p className="mt-1 text-sm text-text-muted">YouTube videolarını yönet</p>
        </Link>
        <Link
          href="/admin/applicants"
          className="rounded-xl border border-accent/20 bg-background-dark p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
        >
          <span className="font-medium text-text-bright">Başvurular</span>
          <p className="mt-1 text-sm text-text-muted">Başvuruları listele ve yönet</p>
        </Link>
        <Link
          href="/admin/messages"
          className="rounded-xl border border-accent/20 bg-background-dark p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
        >
          <span className="font-medium text-text-bright">Mesajlar</span>
          <p className="mt-1 text-sm text-text-muted">İletişim formu mesajlarını oku</p>
        </Link>
      </div>
    </div>
  );
}
