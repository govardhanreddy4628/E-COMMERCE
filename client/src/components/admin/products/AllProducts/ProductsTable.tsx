import { useState } from "react";


import { productsColumns } from "./ProductsColumns";
import { productsData, Product } from "./productsData";
import SearchBar from "../../table/SearchBar";
import DataTable from "../../table/DataTable";

const ProductTable = () => {
  const [products, setProducts] = useState(productsData);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <DataTable<Product>
        columns={productsColumns}
        data={filtered}
        keyField="id"
        onEdit={(p) => console.log("Edit", p)}
        onView={(p) => console.log("View", p)}
        onDelete={(p) => setProducts(prev => prev.filter(prod => prod.id !== p.id))}
      />
    </div>
  );
};

export default ProductTable;
