import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-accent/20 bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.15em] text-text-bright transition-colors hover:text-accent-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background-dark"
            >
              AMNESIA
            </Link>
            <p className="mt-2 text-sm text-text-muted">
              Lights out, mind on.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-8">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted transition-colors hover:text-accent-secondary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 border-t border-accent/10 pt-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Sosyal Medya
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-10">
            <a
              href="https://buymeacookie.xyz/creator/amnesia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/20 bg-background transition hover:border-accent/50 hover:shadow-glow-sm"
              aria-label="Buy Me a Cookie - AMNESIA"
            >
              <img
                src="https://i.imgur.com/BixBpWw.png"
                alt="Buy Me a Cookie"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </a>
            <a
              href="https://facebrowser-tr.gta.world/pages/amnesia?ref=qs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/20 bg-background transition hover:border-accent/50 hover:shadow-glow-sm"
              aria-label="Facebrowser - AMNESIA"
            >
              <img
                src="https://i.imgur.com/BWoaXAo.png"
                alt="Facebrowser"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-text-muted">
          © {currentYear} Amnesia. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
