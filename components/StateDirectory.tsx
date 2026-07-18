"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Jurisdiction } from "@/lib/jurisdictions";

export default function StateDirectory({ items }: { items: readonly Jurisdiction[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.abbr}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return (
    <div>
      <label className="search-label" htmlFor="state-search">Find a state</label>
      <input id="state-search" className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search New York, Texas, Michigan..." />
      <div className="state-grid">
        {filtered.map((item) => (
          <Link className="state-card" href={`/menu/${item.slug}`} key={item.slug}>
            <div><span className="state-abbr">{item.abbr}</span><h3>{item.name} Tim Hortons Menu</h3></div>
            <p>{item.hasVerifiedLocations ? `${item.cities.length} verified location cities` : "No verified location listed"}</p>
            <span className={item.hasVerifiedLocations ? "status active" : "status inactive"}>{item.hasVerifiedLocations ? "Menu + locations" : "Availability page"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
