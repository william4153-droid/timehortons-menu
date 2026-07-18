"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logout } from "@/app/admin/login/actions";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}
function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
function integer(formData: FormData, key: string) {
  return Number.parseInt(text(formData, key) || "0", 10) || 0;
}
function safeRoutePath(value: string) {
  let path = value.trim().toLowerCase().replace(/\s+/g, "-");
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}
function adminClient() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase service role is not configured.");
  return client;
}
function go(path: string, message: string, isError = false) {
  const key = isError ? "error" : "message";
  redirect(`${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(message)}`);
}

export { logout };

export async function savePage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const routePath = safeRoutePath(text(formData, "route_path"));
  const slug = routePath.split("/").filter(Boolean).at(-1) || "home";
  const payload = {
    page_type: text(formData, "page_type") || "custom",
    route_path: routePath,
    slug,
    jurisdiction_slug: text(formData, "jurisdiction_slug") || null,
    title: text(formData, "title"),
    h1: text(formData, "h1"),
    excerpt: text(formData, "excerpt"),
    body: text(formData, "body"),
    meta_title: text(formData, "meta_title"),
    meta_description: text(formData, "meta_description"),
    robots_index: bool(formData, "robots_index"),
    status: text(formData, "status") === "draft" ? "draft" : "published",
    updated_at: new Date().toISOString(),
  };
  const client = adminClient();
  const query = id ? client.from("cms_pages").update(payload).eq("id", id) : client.from("cms_pages").insert(payload).select("id").single();
  const { data, error } = await query;
  if (error) go(id ? `/admin/pages/${id}` : "/admin/pages/new", error.message, true);
  revalidatePath(routePath);
  revalidatePath("/sitemap.xml");
  const savedId = id || (data as { id?: string } | null)?.id;
  go(savedId ? `/admin/pages/${savedId}` : "/admin/pages", "Page saved successfully.");
}

export async function deletePage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const routePath = text(formData, "route_path");
  const { error } = await adminClient().from("cms_pages").delete().eq("id", id).eq("page_type", "custom");
  if (error) go(`/admin/pages/${id}`, error.message, true);
  revalidatePath(routePath || "/");
  go("/admin/pages", "Custom page deleted.");
}

export async function saveMenuCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const payload = { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), sort_order: integer(formData, "sort_order"), active: bool(formData, "active"), updated_at: new Date().toISOString() };
  const query = id ? adminClient().from("menu_categories").update(payload).eq("id", id) : adminClient().from("menu_categories").insert(payload);
  const { error } = await query;
  if (error) go("/admin/menu", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/menu", "Menu category saved.");
}

export async function deleteMenuCategory(formData: FormData) {
  await requireAdmin();
  const { error } = await adminClient().from("menu_categories").delete().eq("id", text(formData, "id"));
  if (error) go("/admin/menu", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/menu", "Menu category deleted.");
}

export async function saveMenuItem(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const payload = { category_id: text(formData, "category_id"), name: text(formData, "name"), price: text(formData, "price"), note: text(formData, "note"), sort_order: integer(formData, "sort_order"), active: bool(formData, "active"), updated_at: new Date().toISOString() };
  const query = id ? adminClient().from("menu_items").update(payload).eq("id", id) : adminClient().from("menu_items").insert(payload);
  const { error } = await query;
  if (error) go("/admin/menu", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/menu", "Menu item saved.");
}

export async function deleteMenuItem(formData: FormData) {
  await requireAdmin();
  const { error } = await adminClient().from("menu_items").delete().eq("id", text(formData, "id"));
  if (error) go("/admin/menu", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/menu", "Menu item deleted.");
}

export async function saveDeal(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const payload = { title: text(formData, "title"), details: text(formData, "details"), status_text: text(formData, "status_text"), source_text: text(formData, "source_text"), starts_at: text(formData, "starts_at") || null, ends_at: text(formData, "ends_at") || null, sort_order: integer(formData, "sort_order"), active: bool(formData, "active"), updated_at: new Date().toISOString() };
  const query = id ? adminClient().from("deals").update(payload).eq("id", id) : adminClient().from("deals").insert(payload);
  const { error } = await query;
  if (error) go("/admin/deals", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/deals", "Deal saved.");
}

export async function deleteDeal(formData: FormData) {
  await requireAdmin();
  const { error } = await adminClient().from("deals").delete().eq("id", text(formData, "id"));
  if (error) go("/admin/deals", error.message, true);
  revalidatePath("/", "layout");
  go("/admin/deals", "Deal deleted.");
}

export async function saveLocation(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const jurisdiction = text(formData, "jurisdiction_slug");
  const payload = { jurisdiction_slug: jurisdiction, city: text(formData, "city"), address: text(formData, "address"), phone: text(formData, "phone"), official_url: text(formData, "official_url"), sort_order: integer(formData, "sort_order"), active: bool(formData, "active"), updated_at: new Date().toISOString() };
  const query = id ? adminClient().from("locations").update(payload).eq("id", id) : adminClient().from("locations").insert(payload);
  const { error } = await query;
  if (error) go(`/admin/locations?state=${jurisdiction}`, error.message, true);
  revalidatePath(`/menu/${jurisdiction}`);
  go(`/admin/locations?state=${jurisdiction}`, "Location saved.");
}

export async function deleteLocation(formData: FormData) {
  await requireAdmin();
  const jurisdiction = text(formData, "jurisdiction_slug");
  const { error } = await adminClient().from("locations").delete().eq("id", text(formData, "id"));
  if (error) go(`/admin/locations?state=${jurisdiction}`, error.message, true);
  revalidatePath(`/menu/${jurisdiction}`);
  go(`/admin/locations?state=${jurisdiction}`, "Location deleted.");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const payload = {
    id: 1,
    site_name: text(formData, "site_name"),
    site_tagline: text(formData, "site_tagline"),
    site_url: text(formData, "site_url").replace(/\/$/, ""),
    ga_measurement_id: text(formData, "ga_measurement_id"),
    adsense_client_id: text(formData, "adsense_client_id"),
    adsense_enabled: bool(formData, "adsense_enabled"),
    adsense_home_slot: text(formData, "adsense_home_slot"),
    adsense_article_slot: text(formData, "adsense_article_slot"),
    adsense_sidebar_slot: text(formData, "adsense_sidebar_slot"),
    search_console_verification: text(formData, "search_console_verification"),
    search_console_property: text(formData, "search_console_property"),
    ads_txt_publisher_id: text(formData, "ads_txt_publisher_id"),
    updated_at: new Date().toISOString(),
  };
  const { error } = await adminClient().from("site_settings").upsert(payload, { onConflict: "id" });
  if (error) go("/admin/settings", error.message, true);
  revalidatePath("/", "layout");
  revalidatePath("/ads.txt");
  go("/admin/settings", "Integration settings saved.");
}

export async function toggleSubscriber(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const active = bool(formData, "active");
  const { error } = await adminClient().from("subscribers").update({ active, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) go("/admin/subscribers", error.message, true);
  go("/admin/subscribers", "Subscriber updated.");
}
