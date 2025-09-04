import { Column } from "../../table/DataTable";
import { Product } from "./productsData";


export const productsColumns: Column<Product>[] = [
  {
    label: "Product",
    accessor: "name",
    sortable: true,
    render: (p) => (
      <div className="flex items-center gap-2">
        <img src={p.image} alt={p.name} className="w-8 h-8 rounded" />
        {p.name}
      </div>
    )
  },
  { label: "Category", accessor: "category" },
  { label: "Price", accessor: "price", sortable: true, render: (p) => `$${p.price.toFixed(2)}` },
  { label: "Stock", accessor: "stock", sortable: true },
  { label: "Status", accessor: "status" }
];
