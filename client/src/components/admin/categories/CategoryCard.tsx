import { useState } from 'react';
import { Trash2, Plus, FolderOpen } from 'lucide-react';
import { Button } from '../../../ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../../ui/card';
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
} from '../../../ui/alert-dialog';
import { Badge } from '../../../ui/badge';
import { useCategories } from '../../../context/CategoryContext';
import { Category } from '../../../types/category';
import { CreateCategory } from './createCategory';
import { EditCategory } from './EditCategory';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const { deleteCategory, deleteSubcategory } = useCategories();
    const [showSubcategories, setShowSubcategories] = useState(false);

    const handleDeleteCategory = () => {
        deleteCategory(category.id);
    };

    const handleDeleteSubcategory = (subcategoryId: string) => {
        deleteSubcategory(subcategoryId);
    };

    return (
        <Card className="group hover:shadow-soft transition-all duration-300 border border-border/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg text-foreground">
                            {category.name}
                        </CardTitle>
                        {category.description && (
                            <CardDescription className="text-sm text-muted-foreground">
                                {category.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditCategory category={category} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the category "{category.name}" and all its subcategories.
                                        This action cannot be undone.
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

            <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                            {category.subcategories.length} subcategories
                        </Badge>
                        {category.subcategories.length > 0 && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowSubcategories(!showSubcategories)}
                                className="h-6 px-2 text-xs"
                            >
                                <FolderOpen className="w-3 h-3 mr-1" />
                                {showSubcategories ? 'Hide' : 'Show'}
                            </Button>
                        )}
                    </div>
                    <CreateCategory
                        mode="subcategory"
                        parentCategoryId={category.id}
                        trigger={
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                                <Plus className="w-3 h-3 mr-1" />
                                Add Sub
                            </Button>
                        }
                    />
                </div>

                {showSubcategories && category.subcategories.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-border/30">
                        {category.subcategories.map((subcategory) => (
                            <div
                                key={subcategory.id}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/30 group/sub"
                            >
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {subcategory.name}
                                    </p>
                                    {subcategory.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {subcategory.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "{subcategory.name}"? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteSubcategory(subcategory.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}