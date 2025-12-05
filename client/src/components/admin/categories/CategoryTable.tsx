import { useState } from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2, Plus } from 'lucide-react';
//import { EditCategory } from './EditCategory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Category } from '../types/category';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../ui/alert-dialog";
import { Button } from '../../../ui/button';
import { useCategories } from '../context/categoryContext';
import { AlertDialogTrigger } from '../../../ui/alert-dialog';
import CategoryFormDialog from './CategoryFormDialog';
import { getCategoryId } from './CategoryUtility';



interface CategoryTableProps {
  categories: Category[];
}

interface CategoryRowProps {
  category: Category;
  level: number;
}

function CategoryRow({ category, level }: CategoryRowProps) {
  const { deleteCategory } = useCategories();
  const [expanded, setExpanded] = useState(false);
  const hasSubcategories = category.subcategories.length > 0;

  return (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: `${level * 2}rem` }}>
          <div className="flex items-center gap-2">
            {hasSubcategories && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {!hasSubcategories && <div className="w-6" />}
            <span className="font-medium">{category.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <p className="text-muted-foreground truncate max-w-xs">
            {category.description || '-'}
          </p>
        </TableCell>
        <TableCell>
          {category.image ? (
            <img
              src={category.image.url}
              alt={category.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </TableCell>
        <TableCell className="text-center">{category.subcategories.length}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            
            <CategoryFormDialog
              mode="create"
              parentCategoryId={getCategoryId(category)}
              trigger={
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              }
            />

            <CategoryFormDialog mode="edit" category={category}
              trigger={<Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Edit2 className="w-4 h-4" />
              </Button>} />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{category.name}"?
                    {hasSubcategories && (
                      <span className="block mt-2 text-destructive">
                        This will also delete all {category.subcategories.length} subcategories.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteCategory(category._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
      {expanded &&
        category.subcategories.map((subcategory) => (
          <CategoryRow key={subcategory.id} category={subcategory} level={level + 1} />
        ))}
    </>
  );
}

export function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-center">Subcategories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} level={0} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
