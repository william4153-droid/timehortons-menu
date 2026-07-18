import Link from "next/link";
import AdminFlash from "@/components/AdminFlash";
import { jurisdictions } from "@/lib/jurisdictions";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { LocationRecord } from "@/lib/types";
import { deleteLocation, saveLocation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLocations({ searchParams }: { searchParams: Promise<{ state?: string; message?: string; error?: string }> }) {
  const params = await searchParams;
  const state = jurisdictions.some((item) => item.slug === params.state) ? params.state! : jurisdictions[0].slug;
  const client = getSupabaseAdmin();
  const { data } = client ? await client.from("locations").select("*").eq("jurisdiction_slug", state).order("sort_order").order("city") : { data: [] };
  const locations = (data || []) as LocationRecord[];
  const stateName = jurisdictions.find((item) => item.slug === state)?.name || state;
  return <>
    <div className="admin-heading"><div><p className="eyebrow">Local directory</p><h1>Locations</h1><p>Manage verified cities, addresses, phone numbers and official destination URLs by jurisdiction.</p></div><Link className="button secondary" href={`/menu/${state}`} target="_blank">Preview state</Link></div>
    <AdminFlash message={params.message} error={params.error} />
    <section className="admin-panel"><form className="state-filter" method="get"><label>Choose jurisdiction<select name="state" defaultValue={state}>{jurisdictions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><button type="submit">Load</button></form></section>
    <section className="admin-panel"><h2>Add {stateName} location</h2><form action={saveLocation} className="admin-form"><input type="hidden" name="jurisdiction_slug" value={state} /><div className="admin-form-grid three"><label>City<input name="city" required /></label><label>Address<input name="address" /></label><label>Phone<input name="phone" /></label></div><div className="admin-form-grid"><label>Official URL<input name="official_url" type="url" /></label><label>Order<input name="sort_order" type="number" defaultValue={locations.length + 1} /></label></div><label className="check-label"><input type="checkbox" name="active" defaultChecked /> Active</label><button className="button" type="submit">Add location</button></form></section>
    {locations.map((location) => <section className="admin-panel" key={location.id}><form action={saveLocation} className="admin-form"><input type="hidden" name="id" value={location.id} /><input type="hidden" name="jurisdiction_slug" value={state} /><div className="admin-form-grid three"><label>City<input name="city" defaultValue={location.city} required /></label><label>Address<input name="address" defaultValue={location.address} /></label><label>Phone<input name="phone" defaultValue={location.phone} /></label></div><div className="admin-form-grid"><label>Official URL<input name="official_url" type="url" defaultValue={location.official_url} /></label><label>Order<input name="sort_order" type="number" defaultValue={location.sort_order} /></label></div><label className="check-label"><input type="checkbox" name="active" defaultChecked={location.active} /> Active</label><button type="submit">Save location</button></form><form action={deleteLocation} className="mini-delete"><input type="hidden" name="id" value={location.id} /><input type="hidden" name="jurisdiction_slug" value={state} /><button type="submit">Delete location</button></form></section>)}
  </>;
}
