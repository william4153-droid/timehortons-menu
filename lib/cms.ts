import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { currentDeals, menuCategories } from "@/lib/menu-data";
import type {
  CmsPage,
  DealRecord,
  LocationRecord,
  MenuCategoryWithItems,
  SiteSettings,
} from "@/lib/types";

const defaultSettings: SiteSettings = {
  id: 1,
  site_name: "Tim Hortons Menu USA Guide",
  site_tagline: "Independent U.S. menu, price, deal and location guide.",
  site_url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ga_measurement_id: "",
  adsense_client_id: "",
  adsense_enabled: false,
  adsense_home_slot: "",
  adsense_article_slot: "",
  adsense_sidebar_slot: "",
  search_console_verification: "",
  search_console_property: "",
  ads_txt_publisher_id: "",
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const admin = getSupabaseAdmin();
  if (!admin) return defaultSettings;
  const { data, error } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return defaultSettings;
  return { ...defaultSettings, ...data } as SiteSettings;
});

export const getCmsPageByRoute = cache(async (routePath: string): Promise<CmsPage | null> => {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin
    .from("cms_pages")
    .select("*")
    .eq("route_path", routePath)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return data as CmsPage;
});

export async function getAllPublishedCmsPages(): Promise<CmsPage[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data, error } = await admin
    .from("cms_pages")
    .select("*")
    .eq("status", "published")
    .order("route_path");
  if (error || !data) return [];
  return data as CmsPage[];
}

export async function getMenuCategories(): Promise<MenuCategoryWithItems[] | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([
    admin.from("menu_categories").select("*").eq("active", true).order("sort_order"),
    admin.from("menu_items").select("*").eq("active", true).order("sort_order"),
  ]);
  if (categoryError || itemError || !categories || !items || categories.length === 0) return null;
  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category_id === category.id),
  })) as MenuCategoryWithItems[];
}

export function getStaticMenuCategories(): MenuCategoryWithItems[] {
  return menuCategories.map((category, categoryIndex) => ({
    id: `static-category-${categoryIndex}`,
    name: category.name,
    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    sort_order: categoryIndex,
    active: true,
    items: category.items.map((item, itemIndex) => ({
      id: `static-item-${categoryIndex}-${itemIndex}`,
      category_id: `static-category-${categoryIndex}`,
      name: item.name,
      price: item.price,
      note: item.note,
      sort_order: itemIndex,
      active: true,
    })),
  }));
}

export async function getDeals(): Promise<DealRecord[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data, error } = await admin.from("deals").select("*").eq("active", true).order("sort_order");
    if (!error && data && data.length > 0) return data as DealRecord[];
  }
  return currentDeals.map((deal, index) => ({
    id: `static-deal-${index}`,
    title: deal.title,
    details: deal.details,
    status_text: deal.status,
    source_text: deal.source,
    starts_at: null,
    ends_at: null,
    sort_order: index,
    active: true,
  }));
}

export async function getLocationsForJurisdiction(jurisdictionSlug: string): Promise<LocationRecord[] | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin
    .from("locations")
    .select("*")
    .eq("jurisdiction_slug", jurisdictionSlug)
    .eq("active", true)
    .order("sort_order")
    .order("city");
  if (error) return null;
  return (data || []) as LocationRecord[];
}
