import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../ui/form';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { useCategories } from '../../../context/CategoryContext';
import { useToast } from '../../../hooks/use-toast';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CreateCategoryProps {
  mode?: 'category' | 'subcategory';
  parentCategoryId?: string;
  trigger?: React.ReactNode;
}

export function CreateCategory({ mode = 'category', parentCategoryId, trigger }: CreateCategoryProps) {
  const [open, setOpen] = useState(false);
  const { categories, addCategory, addSubcategory } = useCategories();
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: parentCategoryId || 'none',
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    try {
      if (mode === 'subcategory' && parentCategoryId) {
        addSubcategory(parentCategoryId, {
          name: data.name,
          description: data.description,
        });
        toast({
          title: 'Success',
          description: 'Subcategory created successfully',
        });
      } else {
        // Check for duplicate names
        const isDuplicate = categories.some(
          cat => cat.name.toLowerCase() === data.name.toLowerCase()
        );
        if (isDuplicate) {
          form.setError('name', { message: 'Category name already exists' });
          return;
        }

        addCategory({
          name: data.name,
          description: data.description,
          parentId: data.parentId === 'none' ? undefined : data.parentId,
        });
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }

      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
      console.error('Create category error:', error);
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="text-primary-foreground shadow-soft">
      <Plus className="w-4 h-4 mr-2" />
      Add {mode === 'subcategory' ? 'Subcategory' : 'Category'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Create New {mode === 'subcategory' ? 'Subcategory' : 'Category'}
          </DialogTitle>
          <DialogDescription>
            Add a new {mode === 'subcategory' ? 'subcategory' : 'category'} to organize your products.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'category' && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Main Category)</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className=" text-primary-foreground">
                Create {mode === 'subcategory' ? 'Subcategory' : 'Category'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}