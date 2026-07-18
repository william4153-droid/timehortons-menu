import AdminFlash from "@/components/AdminFlash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { MenuCategoryRecord, MenuItemRecord } from "@/lib/types";
import { deleteMenuCategory, deleteMenuItem, saveMenuCategory, saveMenuItem } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminMenu({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  const client = getSupabaseAdmin();
  const [categoryResult, itemResult] = client ? await Promise.all([
    client.from("menu_categories").select("*").order("sort_order"),
    client.from("menu_items").select("*").order("sort_order"),
  ]) : [{ data: [] }, { data: [] }];
  const categories = (categoryResult.data || []) as MenuCategoryRecord[];
  const items = (itemResult.data || []) as MenuItemRecord[];
  return (
    <>
      <div className="admin-heading"><div><p className="eyebrow">Catalog</p><h1>Menu management</h1><p>Add, edit, reorder or disable menu categories and items shown on state pages.</p></div></div>
      <AdminFlash {...params} />
      <section className="admin-panel"><h2>Add category</h2><form action={saveMenuCategory} className="admin-inline-form"><input name="name" placeholder="Category name" required /><input name="sort_order" type="number" defaultValue={categories.length + 1} aria-label="Sort order" /><label className="check-label"><input type="checkbox" name="active" defaultChecked /> Active</label><button className="button" type="submit">Add category</button></form></section>
      {categories.map((category) => <section className="admin-panel" key={category.id}>
        <form action={saveMenuCategory} className="admin-section-title"><input type="hidden" name="id" value={category.id} /><input name="name" defaultValue={category.name} required /><input name="sort_order" type="number" defaultValue={category.sort_order} /><label className="check-label"><input type="checkbox" name="active" defaultChecked={category.active} /> Active</label><button type="submit">Save category</button></form>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Item</th><th>Price</th><th>Note</th><th>Order</th><th>Active</th><th></th></tr></thead><tbody>
          {items.filter((item) => item.category_id === category.id).map((item) => <tr key={item.id}><td colSpan={6}><form action={saveMenuItem} className="admin-row-form"><input type="hidden" name="id" value={item.id} /><input type="hidden" name="category_id" value={category.id} /><input name="name" defaultValue={item.name} required /><input name="price" defaultValue={item.price} /><input name="note" defaultValue={item.note} /><input name="sort_order" type="number" defaultValue={item.sort_order} /><label><input type="checkbox" name="active" defaultChecked={item.active} /></label><button type="submit">Save</button></form><form action={deleteMenuItem} className="mini-delete"><input type="hidden" name="id" value={item.id} /><button type="submit">Delete</button></form></td></tr>)}
        </tbody></table></div>
        <form action={saveMenuItem} className="admin-inline-form add-row"><input type="hidden" name="category_id" value={category.id} /><input name="name" placeholder="New item" required /><input name="price" placeholder="Price guidance" /><input name="note" placeholder="Availability note" /><input name="sort_order" type="number" defaultValue={items.filter((item) => item.category_id === category.id).length + 1} /><label className="check-label"><input type="checkbox" name="active" defaultChecked /> Active</label><button type="submit">Add item</button></form>
        <form action={deleteMenuCategory} className="mini-delete category-delete"><input type="hidden" name="id" value={category.id} /><button type="submit">Delete category</button></form>
      </section>)}
    </>
  );
}
