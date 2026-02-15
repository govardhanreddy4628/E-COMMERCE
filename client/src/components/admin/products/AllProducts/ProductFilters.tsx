import { Input } from "../../../../ui/input";
import { Button } from "../../../../ui/button";
import { useProducts } from "./ProductContext";

export function ProductFilters() {
  const { setSearch, setCategory, products } = useProducts();

  const exportCSV = () => {
    const csv = [
      ["Name", "Price", "Stock", "Category"],
      ...products.map(p => [
        p.name,
        p.price,
        p.quantityInStock,
        p.category?.name,
      ]),
    ]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.csv";
    a.click();
  };

  return (
    <div className="flex gap-3 mb-4">
      <Input placeholder="Search…" onChange={e => setSearch(e.target.value)} />
      <select
        className="border rounded px-3"
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="mobiles">Mobiles</option>
      </select>
      <Button onClick={exportCSV}>Export CSV</Button>
    </div>
  );
}
