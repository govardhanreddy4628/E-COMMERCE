// components/CreateCategory.tsx
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { getCategoryId, useCategories } from "../context/categoryContext";
import { useToast } from "../../../hooks/use-toast";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().optional(),
  parentCategoryId: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

type CategoryFormSchema = z.infer<typeof categorySchema>;

interface CreateCategoryProps {
  parentCategoryId?: string;
  trigger?: React.ReactNode;
}

export function CreateCategory({ parentCategoryId, trigger }: CreateCategoryProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getAllCategories, addCategory } = useCategories();
  const { toast } = useToast();

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: parentCategoryId || "none",
      imageFile: undefined,
    },
  });

  // track last object url to revoke
  const [lastObjectUrl, setLastObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
      }
    };
  }, [lastObjectUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // revoke previous
      if (lastObjectUrl) {
        try { URL.revokeObjectURL(lastObjectUrl); } catch {}
      }
      const obj = URL.createObjectURL(file);
      setLastObjectUrl(obj);
      setImagePreview(obj);
      form.setValue("imageFile", file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    if (lastObjectUrl) {
      try { URL.revokeObjectURL(lastObjectUrl); } catch {}
      setLastObjectUrl(null);
    }
    setImagePreview(null);
    form.setValue("imageFile", undefined);
  };

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      // local duplicate check
      const allCategories = getAllCategories();
      const isDuplicate = allCategories.some(cat => (cat.name || "").toLowerCase() === data.name.toLowerCase());
      if (isDuplicate) {
        form.setError("name", { message: "Category name already exists" });
        return;
      }

      setIsSubmitting(true);

      await addCategory({
        name: data.name,
        description: data.description,
        imageFile: data.imageFile,
        parentCategoryId: data.parentCategoryId === "none" ? undefined : data.parentCategoryId,
      });

      toast({ title: "Success", description: "Category created successfully" });
      form.reset();
      removeImage();
      setOpen(false);

    } catch (error: any) {
      console.error("Failed to create category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategories = getAllCategories();

  const defaultTrigger = (
    <Button size="sm" className="bg-primary text-white shadow-soft">
      <Plus className="w-4 h-4 mr-2" />
      Add Category
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Add a new category to organize your products.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter category description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* File input: wired to imageFile */}
            <FormField control={form.control} name="imageFile" render={() => (
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-border" />
                        <Button type="button" size="sm" variant="destructive" onClick={removeImage} className="absolute top-2 right-2">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload image</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="parentCategoryId" render={({ field }) => (
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
                    {allCategories.map(category => (
                      <SelectItem key={getCategoryId(category)} value={getCategoryId(category)}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
