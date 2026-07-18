import type { MenuCategoryWithItems } from "@/lib/types";

export default function MenuTable({ categories }: { categories: MenuCategoryWithItems[] }) {
  return (
    <div className="menu-sections">
      {categories.map((category) => (
        <section className="menu-category" id={category.slug} key={category.id}>
          <h2>{category.name}</h2>
          <div className="table-wrap"><table><thead><tr><th>Item</th><th>Price guidance</th><th>Availability note</th></tr></thead><tbody>
            {category.items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.price}</td><td>{item.note}</td></tr>)}
          </tbody></table></div>
        </section>
      ))}
    </div>
  );
}
