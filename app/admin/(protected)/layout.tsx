import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "./actions";

const links = [
  ["Dashboard", "/admin"],
  ["Pages", "/admin/pages"],
  ["Menu", "/admin/menu"],
  ["Deals", "/admin/deals"],
  ["Locations", "/admin/locations"],
  ["Subscribers", "/admin/subscribers"],
  ["Integrations", "/admin/settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin"><span className="brand-mark">TM</span><span>Menu CMS</span></Link>
        <nav>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="admin-user"><small>Signed in as</small><strong>{user.email}</strong><form action={logout}><button type="submit">Sign out</button></form></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
