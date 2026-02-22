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
              Rave party organizasyonu — unutulmaz geceler.
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
        <div className="mt-10 border-t border-accent/10 pt-6 text-center text-sm text-text-muted">
          © {currentYear} Amnesia. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
