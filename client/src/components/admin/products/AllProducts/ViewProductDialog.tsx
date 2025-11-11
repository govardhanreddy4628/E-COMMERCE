import { Badge } from "../../../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../ui/dialog";
import { Separator } from "../../../../ui/separator";
import { Product } from "./ProductsData";

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ViewProductDialog({ open, onOpenChange, product }: ViewProductDialogProps) {
  if (!product) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-40 rounded-lg object-cover border border-border"
            />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">ID: {product.id}</p>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(product.status)}
                {getStockBadge(product.stock)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="text-lg font-semibold text-foreground">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stock</p>
              <p className="text-lg font-semibold text-foreground">{product.stock} units</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-lg font-semibold text-foreground">{product.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created Date</p>
              <p className="text-lg font-semibold text-foreground">{product.createdAt}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
            <p className="text-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
