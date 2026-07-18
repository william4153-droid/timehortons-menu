"use client";

import { FormEvent, useState } from "react";

export default function SubscribeForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), state: form.get("state") }) });
    const data = await response.json().catch(() => ({}));
    setStatus(response.ok ? "You are subscribed for menu and deal updates." : data.error || "Subscription could not be saved.");
    setLoading(false);
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form className="subscribe-card" onSubmit={submit}>
      <p className="eyebrow">Email updates</p>
      <h2>Get new deals and menu updates</h2>
      <p>Subscribe for important U.S. menu changes, seasonal products and verified offer updates. No daily spam.</p>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required placeholder="you@example.com" />
      <label htmlFor="state">Preferred state (optional)</label>
      <input id="state" name="state" type="text" placeholder="New York" />
      <button className="button" disabled={loading}>{loading ? "Saving..." : "Subscribe"}</button>
      {status && <p className="form-status" role="status">{status}</p>}
      <small>By subscribing, you agree to the privacy policy and can unsubscribe from any email.</small>
    </form>
  );
}
