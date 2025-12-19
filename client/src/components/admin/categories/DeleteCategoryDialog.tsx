import { useState } from "react";
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

  const [moveMode, setMoveMode] = useState(false);
  const [newParentId, setNewParentId] = useState<string | null>(null);

  const [productMoveId, setProductMoveId] = useState<string | null>(null);
  const [checkingProducts, setCheckingProducts] = useState(false);
  const [hasProducts, setHasProducts] = useState(false);

  const hasChildren =
    Array.isArray(category.subcategories) && category.subcategories.length > 0;

  const currentId = getCategoryId(category);

  // -----------------------------
  // Remove current category & its subtree from dropdown
  // -----------------------------
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

  // -----------------------------
  // Move mode enabled → check if products exist
  // -----------------------------
  const enableMoveMode = async () => {
    setMoveMode(true);
    setCheckingProducts(true);

    const exists = await checkCategoryHasProducts(currentId);

    setHasProducts(exists);
    setCheckingProducts(false);
  };

  // -----------------------------
  // Final delete handler
  // -----------------------------
  const handleFinalDelete = async () => {

  if (hasChildren && moveMode) {
    await moveSubcategories(currentId, newParentId || null);
  }

  // If category has products → move them
  if (hasProducts && productMoveId) {
    await moveProductsToCategory(currentId, productMoveId);
  }

  await deleteCategory(currentId);
};


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {moveMode ? "Move & Delete Subcategories and Products" : "Delete Category"}
          </AlertDialogTitle>

          {!moveMode ? (
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"?
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              Move subcategories and products of "{category.name}" before deleting.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* -----------------------------------
            CASE 1: Has children, not move mode
        ------------------------------------ */}
        {hasChildren && !moveMode && (
          <div className="p-3 bg-muted/40 rounded-lg text-sm space-y-3">
            <p>
              This category has{" "}
              <strong>{category.subcategories?.length}</strong> subcategories.
            </p>

            <Button className="w-full" onClick={enableMoveMode}>
              Move subcategories or products and delete category
            </Button>

            <div className="text-xs text-center text-muted-foreground">OR</div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleFinalDelete}
            >
              Delete category & all subcategories
            </Button>
          </div>
        )}

        {/* -----------------------------------
            CASE 2: Move mode
        ------------------------------------ */}
        {hasChildren && moveMode && (
          <div className="space-y-3">
            {/* SUBCATEGORY MOVE SELECT */}
            <div>
              <label className="text-sm">Move subcategories to:</label>

              <select
                className="w-full border p-2 rounded"
                value={newParentId || ""}
                onChange={(e) => setNewParentId(e.target.value || null)}
                disabled={checkingProducts}
              >
                <option value="">Make them root categories</option>

                {selectableCategories.map((c) => (
                  <option key={getCategoryId(c)} value={getCategoryId(c)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRODUCT MOVE SELECT — ONLY IF PRODUCTS EXIST */}
            {checkingProducts ? (
              <div className="text-center text-sm text-muted-foreground">
                Checking products...
              </div>
            ) : hasProducts ? (
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
            ) : null}
          </div>
        )}

        {/* -----------------------------------
            CASE 3: No children
        ------------------------------------ */}
        {!hasChildren && (
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        )}

        {/* -----------------------------------
            Footer
        ------------------------------------ */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleFinalDelete}
            disabled={checkingProducts || (hasProducts && !productMoveId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {moveMode ? "Delete & Apply Changes" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
