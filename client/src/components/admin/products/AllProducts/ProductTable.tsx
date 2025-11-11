import { Button } from "../../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import { Product } from "./ProductsData";
import { Badge } from "../../../../ui/badge";

interface ProductsTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  visibleColumns: {
    image: boolean;
    name: boolean;
    category: boolean;
    price: boolean;
    stock: boolean;
    status: boolean;
    created: boolean;
  };
}

export function ProductsTable({ products, onView, onEdit, onDelete, visibleColumns }: ProductsTableProps) {
  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "discontinued":
        return <Badge variant="destructive">Discontinued</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-destructive text-destructive-foreground">Out of Stock</Badge>;
    }
    if (stock < 20) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.image && <TableHead className="w-[80px]">Image</TableHead>}
            {visibleColumns.name && <TableHead>Name</TableHead>}
            {visibleColumns.category && <TableHead>Category</TableHead>}
            {visibleColumns.price && <TableHead>Price</TableHead>}
            {visibleColumns.stock && <TableHead>Stock</TableHead>}
            {visibleColumns.status && <TableHead>Status</TableHead>}
            {visibleColumns.created && <TableHead>Created</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {visibleColumns.image && (
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
              )}
              {visibleColumns.name && (
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {product.description}
                    </div>
                  </div>
                </TableCell>
              )}
              {visibleColumns.category && <TableCell>{product.category}</TableCell>}
              {visibleColumns.price && (
                <TableCell className="font-semibold">${product.price.toFixed(2)}</TableCell>
              )}
              {visibleColumns.stock && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{product.stock}</span>
                    {getStockBadge(product.stock)}
                  </div>
                </TableCell>
              )}
              {visibleColumns.status && <TableCell>{getStatusBadge(product.status)}</TableCell>}
              {visibleColumns.created && (
                <TableCell className="text-sm text-muted-foreground">{product.createdAt}</TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(product)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
