import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const state = String(body.state || "").trim().slice(0, 80);
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: "Subscription storage is not configured yet." }, { status: 503 });
    const { error } = await client.from("subscribers").upsert({ email, preferred_state: state || null, active: true, updated_at: new Date().toISOString() }, { onConflict: "email" });
    if (error) return NextResponse.json({ error: "Subscription could not be saved." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
