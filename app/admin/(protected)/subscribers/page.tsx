import AdminFlash from "@/components/AdminFlash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { toggleSubscriber } from "../actions";

export const dynamic = "force-dynamic";

type Subscriber = { id: string; email: string; preferred_state: string | null; active: boolean; created_at: string };

export default async function AdminSubscribers({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  const client = getSupabaseAdmin();
  const { data } = client ? await client.from("subscribers").select("*").order("created_at", { ascending: false }).limit(500) : { data: [] };
  const subscribers = (data || []) as Subscriber[];
  return <>
    <div className="admin-heading"><div><p className="eyebrow">Audience</p><h1>Email subscribers</h1><p>Review the latest 500 subscribers and activate or suppress individual records.</p></div></div>
    <AdminFlash {...params} />
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Email</th><th>Preferred state</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>
      {subscribers.map((subscriber) => <tr key={subscriber.id}><td><strong>{subscriber.email}</strong></td><td>{subscriber.preferred_state || "—"}</td><td>{new Date(subscriber.created_at).toLocaleDateString("en-US")}</td><td>{subscriber.active ? "Active" : "Suppressed"}</td><td><form action={toggleSubscriber}><input type="hidden" name="id" value={subscriber.id} /><input type="hidden" name="active" value={subscriber.active ? "false" : "true"} /><button type="submit">{subscriber.active ? "Suppress" : "Activate"}</button></form></td></tr>)}
    </tbody></table></div>
  </>;
}
