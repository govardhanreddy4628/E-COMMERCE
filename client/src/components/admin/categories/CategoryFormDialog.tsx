import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Edit2, Upload, X } from "lucide-react";
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
import { useCategories } from "../context/categoryContext";
import { useToast } from "../../../hooks/use-toast";
import { Category } from "../types/category";

// Schema: we keep imageFile as File for both create & edit because backend expects File for updates too (user choice A)
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().optional(),
  parentCategoryId: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

type CategoryFormSchema = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  mode: "create" | "edit";
  category?: Category; // required when mode === 'edit'
  parentCategoryId?: string; // allow pre-selecting a parent when creating a subcategory
  trigger?: React.ReactNode;
  children?: React.ReactNode; // alternate trigger
}

export default function CategoryFormDialog({
  mode,
  category,
  parentCategoryId,
  trigger,
  children,
}: CategoryFormDialogProps) {
  const isEdit = mode === "edit";
  const { getAllCategories, addCategory, updateCategory } = useCategories();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    isEdit ? (category?.image?.url ?? null) : null
  );
  const [lastObjectUrl, setLastObjectUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // track if user removed existing image (so update can delete it)
  const [imageRemoved, setImageRemoved] = useState(false);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: isEdit ? category?.name ?? "" : "",
      description: isEdit ? category?.description ?? "" : "",
      parentCategoryId: isEdit ? (category?.parentCategoryId ?? "none") : (parentCategoryId ?? "none"),
      imageFile: undefined,
    },
  });

  useEffect(() => {
    // when opening edit dialog for different category, sync preview and defaults
    if (isEdit) {
      setImagePreview(category?.image?.url ?? null);
      setImageRemoved(false);
      form.reset({
        name: category?.name ?? "",
        description: category?.description ?? "",
        parentCategoryId: category?.parentCategoryId ?? "none",
        imageFile: undefined,
      });
    } else if (parentCategoryId) {
      // when create and parentCategoryId prop changes
      form.reset({
        name: "",
        description: "",
        parentCategoryId: parentCategoryId ?? "none",
        imageFile: undefined,
      });
      setImagePreview(null);
      setImageRemoved(false);
    }
    // we intentionally omit form from deps to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category, parentCategoryId]);

  useEffect(() => {
    return () => {
      if (lastObjectUrl) {
        try {
          URL.revokeObjectURL(lastObjectUrl);
        } catch (e) {}
      }
    };
  }, [lastObjectUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // revoke previous object url
    if (lastObjectUrl) {
      try {
        URL.revokeObjectURL(lastObjectUrl);
      } catch (e) {}
    }

    const obj = URL.createObjectURL(file);
    setLastObjectUrl(obj);
    setImagePreview(obj);
    setImageRemoved(false);
    form.setValue("imageFile", file, { shouldValidate: true });
  };

  const removeImage = () => {
    // if a newly selected file exists, revoke its object URL
    if (lastObjectUrl) {
      try {
        URL.revokeObjectURL(lastObjectUrl);
      } catch (e) {}
      setLastObjectUrl(null);
    }

    // clear preview and mark removed if there was an existing image
    setImagePreview(null);
    form.setValue("imageFile", undefined);
    // if editing an existing category that had an image, mark it for removal
    if (isEdit && category?.image) {
      setImageRemoved(true);
    }
  };

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      const allCategories = getAllCategories();
      const lower = data.name.trim().toLowerCase();
      const isDuplicate = allCategories.some((cat) => {
        if (isEdit && category) {
          // skip self in edit
          const id = String(cat.id ?? cat._id ?? "");
          const selfId = String(category.id ?? category._id ?? "");
          if (id === selfId) return false;
        }
        return (cat.name ?? "").toLowerCase() === lower;
      });

      if (isDuplicate) {
        form.setError("name", { message: "Category name already exists" });
        return;
      }

      setIsSubmitting(true);

      const payload: any = {
        name: data.name,
        description: data.description,
        parentCategoryId: data.parentCategoryId === "none" ? undefined : data.parentCategoryId,
      };

      // If user selected a file, send imageFile (backend expects File for both create & update)
      if (data.imageFile) payload.imageFile = data.imageFile;

      // If editing and user removed existing image and didn't upload a new one, send a flag so backend can delete it
      if (isEdit && imageRemoved && !data.imageFile) payload.removeImage = true;

      if (isEdit && category) {
        // call updateCategory(id, payload)
        await updateCategory(category.id ?? (category as any)._id, payload);
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        await addCategory(payload);
        toast({ title: "Success", description: "Category created successfully" });
      }

      form.reset();
      removeImage();
      setOpen(false);
    } catch (error: any) {
      console.error("Category form failed:", error);
      toast({ title: "Error", description: error?.message || "Failed to save category", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategories = getAllCategories();

  const defaultCreateTrigger = (
    <Button size="sm" className="bg-primary text-white shadow-soft">
      <Plus className="w-4 h-4 mr-2" />
      Add Category
    </Button>
  );

  const defaultEditTrigger = (
    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
      <Edit2 className="w-4 h-4" />
    </Button>
  );

  const triggerNode = children || trigger || (isEdit ? defaultEditTrigger : defaultCreateTrigger);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerNode}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Create New Category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the category information below." : "Add a new category to organize your products."}
          </DialogDescription>
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
                    {allCategories
                      .filter((cat) => !isEdit || String(cat.id ?? cat._id) !== String(category?.id ?? category?._id))
                      .map((cat) => (
                        <SelectItem key={String(cat.id ?? cat._id)} value={String(cat.id ?? cat._id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Category" : "Create Category")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
