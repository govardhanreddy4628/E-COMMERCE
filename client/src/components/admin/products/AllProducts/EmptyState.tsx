import { Package, Plus } from "lucide-react";
import { Button } from "../../../../ui/button";


interface EmptyStateProps {
  onAddProduct: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onAddProduct, hasFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Package className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No products yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Get started by adding your first product to your inventory.
      </p>
      <Button onClick={onAddProduct} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Product
      </Button>
    </div>
  );
}
