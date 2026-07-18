"use client";

import { useEffect } from "react";

declare global {
  interface Window { adsbygoogle?: Record<string, unknown>[]; }
}

export default function AdSlot({ client, slot, label = "Advertisement" }: { client: string; slot: string; label?: string }) {
  useEffect(() => {
    if (!client || !slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or an unapproved account may prevent initialization.
    }
  }, [client, slot]);

  if (!client || !slot) return null;
  return (
    <div className="ad-wrap" aria-label={label}>
      <span>{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
