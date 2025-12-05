import { useState } from "react";
import { Button } from "../../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { Badge } from "../../../ui/badge";
import { useCategories } from "../context/categoryContext";
import { Category } from "../types/category";
import { Trash2, Plus, ChevronRight, Edit2 } from "lucide-react";
import CategoryFormDialog from "./CategoryFormDialog";
import { getCategoryId } from "./CategoryUtility";



interface CategoryCardProps {
  category: Category;
  level?: number;
}

export function CategoryCard({ category, level = 0 }: CategoryCardProps) {
  console.log(category)
  const { deleteCategory } = useCategories();
  const [showSubcategories, setShowSubcategories] = useState(false);

  //const dispatch = useDispatch<AppDispatch>();

  const safeSubcategories = Array.isArray(category.subcategories)
    ? category.subcategories
    : [];

  const handleDeleteCategory = () => {
    const id = getCategoryId(category);
    //if (id) dispatch(deleteCategory(id));
    if (id) deleteCategory(id);
  };

  const countAllSubcategories = (cat: Category): number => {
    const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    return subs.length + subs.reduce((acc, sub) => acc + countAllSubcategories(sub), 0);
  };

  const totalSubcategories = countAllSubcategories(category);

  return (
    <Card className="group hover:shadow-soft transition-all duration-300 border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {category.image && (
                <img
                  src={category.image.url}
                  //src={getCloudinaryImage(category.image.url, { width: 200, height: 200 })}  
                  alt={category.name || "Category"}
                  className="w-16 h-16 object-cover rounded-lg border border-border shadow-sm"
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-lg text-foreground">
                  {category.name || "Untitled"}
                </CardTitle>
                {category.description && (
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </div>

          {/* Edit + Delete Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">

            <CategoryFormDialog mode="edit" category={category}
              trigger={<Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Edit2 className="w-4 h-4" />
              </Button>} />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{category.name}" and all its subcategories.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCategory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      {/* Subcategory Section */}
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {totalSubcategories}{" "}
              {totalSubcategories === 1 ? "subcategory" : "subcategories"}
            </Badge>
            {safeSubcategories.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSubcategories(!showSubcategories)}
                className="h-6 px-2 text-xs"
              >
                <ChevronRight
                  className={`w-3 h-3 mr-1 transition-transform ${showSubcategories ? "rotate-90" : ""
                    }`}
                />
                {showSubcategories ? "Hide" : "Show"}
              </Button>
            )}
          </div>
          <CategoryFormDialog
            mode="create"
            parentCategoryId={getCategoryId(category)}
            trigger={
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add Sub
              </Button>
            }
          />
        </div>

        {showSubcategories && safeSubcategories.length > 0 && (
          <div className="space-y-3 pl-4 border-l-2 border-border/30 mt-3">
            {safeSubcategories.map((subcategory) => (
              <SubcategoryItem
                key={getCategoryId(subcategory)}
                category={subcategory}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubcategoryItem({ category, level }: { category: Category; level: number }) {
  const { deleteCategory } = useCategories();
  const [showNested, setShowNested] = useState(false);

  const safeSubcategories = Array.isArray(category.subcategories)
    ? category.subcategories
    : [];

  const countAllSubcategories = (cat: Category): number => {
    const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    return subs.length + subs.reduce((acc, sub) => acc + countAllSubcategories(sub), 0);
  };

  const totalSubcategories = countAllSubcategories(category);

  const handleDelete = () => {
    const id = getCategoryId(category);
    if (id) deleteCategory(id);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between p-3 rounded-lg bg-muted/30 group/sub border border-border/30 hover:border-border/60 transition-all">
        <div className="flex-1 flex items-start gap-3">
          {category.image && (
            <img
              src={category.image?.url}
              //src={getCloudinaryImage(category.image, { width: 200, height: 200 })}             // get image of different transfomations from cloudinary.
              alt={category.name || "Subcategory"}
              className="w-12 h-12 object-cover rounded-md border border-border shadow-sm"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {category.name || "Untitled"}
              </p>
              {totalSubcategories > 0 && (
                <Badge variant="outline" className="text-xs">
                  {totalSubcategories}
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
          {safeSubcategories.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNested(!showNested)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight
                className={`w-3 h-3 transition-transform ${showNested ? "rotate-90" : ""
                  }`}
              />
            </Button>
          )}

          <CategoryFormDialog
            mode="create"
            parentCategoryId={getCategoryId(category)}
            trigger={
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            }
          />

          <CategoryFormDialog
            mode="edit"
            category={category}
            trigger={
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Edit2 className="w-4 h-4" />
              </Button>
            }
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Delete "{category.name}" and all its subcategories? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {showNested && safeSubcategories.length > 0 && (
        <div className="pl-4 space-y-2 border-l-2 border-border/20">
          {safeSubcategories.map((sub) => (
            <SubcategoryItem
              key={getCategoryId(sub)}
              category={sub}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
