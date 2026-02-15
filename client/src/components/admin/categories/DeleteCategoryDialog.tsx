import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { Button } from "../../../ui/button";
import { useCategories } from "../context/categoryContext";
import { Category } from "../types/category";
import { getCategoryId } from "./CategoryUtility";

interface Props {
  category: Category;
  trigger: React.ReactNode;
}

export default function DeleteCategoryDialog({ category, trigger }: Props) {
  const {
    deleteCategory,
    moveSubcategories,
    getAllCategories,
    checkCategoryHasProducts,
    moveProductsToCategory,
  } = useCategories();

  const currentId = getCategoryId(category);

  const hasChildren =
    Array.isArray(category.subcategories) && category.subcategories.length > 0;

  const [checkingProducts, setCheckingProducts] = useState(false);
  const [hasProducts, setHasProducts] = useState<boolean>(false);

  const [moveMode, setMoveMode] = useState(false);
  const [newParentId, setNewParentId] = useState<string | null>(null);
  const [productMoveId, setProductMoveId] = useState<string | null>(null);

  /* ------------------------------------
     Fetch product linkage ON dialog open
  ------------------------------------ */
  const onDialogOpen = async () => {
    setCheckingProducts(true);
    try {
      const exists = await checkCategoryHasProducts(currentId);
      setHasProducts(exists);
    } finally {
      setCheckingProducts(false);
    }
  };

  /* ------------------------------------
     Block current + descendants in selects
  ------------------------------------ */
  const getAllDescendantIds = (cat: Category): string[] => {
    const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    return subs.reduce(
      (acc, sub) => [...acc, getCategoryId(sub), ...getAllDescendantIds(sub)],
      [] as string[]
    );
  };

  const blockedIds = [currentId, ...getAllDescendantIds(category)];

  const selectableCategories = getAllCategories().filter(
    (c) => !blockedIds.includes(getCategoryId(c))
  );

  const requiresMove = hasChildren || hasProducts;

  /* ------------------------------------
     Final delete handler
  ------------------------------------ */
  const handleFinalDelete = async () => {
    if (moveMode) {
      if (hasChildren) {
        await moveSubcategories(currentId, newParentId || null);
      }

      if (hasProducts && productMoveId) {
        await moveProductsToCategory(currentId, productMoveId);
      }
    }

    await deleteCategory(currentId);
  };

  return (
    <AlertDialog onOpenChange={(open) => open && onDialogOpen()}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {moveMode ? "Resolve dependencies before deleting" : "Delete Category"}
          </AlertDialogTitle>

          {!moveMode && (
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"?
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* -----------------------------
            Loading state
        ------------------------------ */}
        {checkingProducts && (
          <div className="text-sm text-center text-muted-foreground">
            Checking linked products...
          </div>
        )}

        {/* -----------------------------
            CASE 1: Dependencies exist
        ------------------------------ */}
        {!checkingProducts && requiresMove && !moveMode && (
          <div className="p-3 bg-muted/40 rounded-lg space-y-3 text-sm">
            {hasChildren && (
              <p>
                This category has{" "}
                <strong>{category.subcategories?.length}</strong> subcategories.
              </p>
            )}

            {hasProducts && (
              <p>
                This category has <strong>linked products</strong>.
              </p>
            )}

            <Button className="w-full" onClick={() => setMoveMode(true)}>
              Resolve dependencies before deleting
            </Button>

            <div className="text-xs text-center text-muted-foreground">OR</div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleFinalDelete}
            >
              Delete everything
            </Button>
          </div>
        )}

        {/* -----------------------------
            CASE 2: Move Mode
        ------------------------------ */}
        {moveMode && (
          <div className="space-y-4">
            {hasChildren && (
              <div>
                <label className="text-sm">Move subcategories to:</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newParentId || ""}
                  onChange={(e) => setNewParentId(e.target.value || null)}
                >
                  <option value="">Make them root categories</option>
                  {selectableCategories.map((c) => (
                    <option key={getCategoryId(c)} value={getCategoryId(c)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {hasProducts && (
              <div>
                <label className="text-sm">Move products to:</label>
                <select
                  className="w-full border p-2 rounded"
                  value={productMoveId || ""}
                  onChange={(e) => setProductMoveId(e.target.value || null)}
                >
                  <option value="">Select category</option>
                  {selectableCategories.map((c) => (
                    <option key={getCategoryId(c)} value={getCategoryId(c)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* -----------------------------
            CASE 3: Safe delete
        ------------------------------ */}
        {!checkingProducts && !requiresMove && (
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        )}

        {/* -----------------------------
            Footer
        ------------------------------ */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleFinalDelete}
            disabled={moveMode && hasProducts && !productMoveId}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {moveMode ? "Delete & Apply Changes" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
