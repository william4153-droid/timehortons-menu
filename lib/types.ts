export type CmsPage = {
  id: string;
  page_type: "home" | "state" | "system" | "custom";
  route_path: string;
  slug: string;
  jurisdiction_slug: string | null;
  title: string;
  h1: string;
  excerpt: string;
  body: string;
  meta_title: string;
  meta_description: string;
  robots_index: boolean;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
};

export type SiteSettings = {
  id: number;
  site_name: string;
  site_tagline: string;
  site_url: string;
  ga_measurement_id: string;
  adsense_client_id: string;
  adsense_enabled: boolean;
  adsense_home_slot: string;
  adsense_article_slot: string;
  adsense_sidebar_slot: string;
  search_console_verification: string;
  search_console_property: string;
  ads_txt_publisher_id: string;
  updated_at?: string;
};

export type MenuCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
};

export type MenuItemRecord = {
  id: string;
  category_id: string;
  name: string;
  price: string;
  note: string;
  sort_order: number;
  active: boolean;
};

export type MenuCategoryWithItems = MenuCategoryRecord & { items: MenuItemRecord[] };

export type DealRecord = {
  id: string;
  title: string;
  details: string;
  status_text: string;
  source_text: string;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  active: boolean;
};

export type LocationRecord = {
  id: string;
  jurisdiction_slug: string;
  city: string;
  address: string;
  phone: string;
  official_url: string;
  sort_order: number;
  active: boolean;
};
