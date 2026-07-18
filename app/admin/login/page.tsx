import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { login } from "./actions";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="admin-login-shell">
      <form action={login} className="admin-login-card">
        <div className="brand-mark">TM</div>
        <p className="eyebrow">Secure CMS</p>
        <h1>Admin login</h1>
        <p>Use the Supabase Auth account whose email is allowed in the Netlify <code>ADMIN_EMAILS</code> variable.</p>
        {error ? <p className="admin-flash error">{error}</p> : null}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
