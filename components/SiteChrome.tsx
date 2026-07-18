"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteChrome({ children, siteName }: { children: React.ReactNode; siteName: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" href="/" aria-label={`${siteName} home`}><span className="brand-mark">TM</span><span>{siteName}</span></Link>
      <nav aria-label="Primary navigation"><Link href="/">States</Link><Link href="/deals">Deals</Link><Link href="/about">About</Link></nav>
    </div></header>
    {children}
    <footer className="site-footer"><div className="container footer-grid"><div><strong>Independent menu guide</strong><p>Not affiliated with, endorsed by, or operated by Tim Hortons. Prices and availability vary by restaurant.</p></div><div className="footer-links"><Link href="/editorial-policy">Editorial policy</Link><Link href="/privacy">Privacy</Link><a href="https://www.timhortons.com/store-locator" rel="nofollow noopener" target="_blank">Official store locator</a><Link href="/admin/login" rel="nofollow">Admin</Link></div></div></footer>
  </>;
}
