import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Switch } from "../../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Separator } from "../../../ui/separator";
//import { useCategories } from "@/contexts/CategoryContext";
//import { CreateCategory } from "@/components/categories/CreateCategory";
import { Package, DollarSign, Image as ImageIcon, Tag, Settings } from "lucide-react";
import Media from "./CreateProduct/Media";

import { useToast } from "../../../hooks/use-toast";

import { Input } from "../../../ui/input";

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name must be less than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
    shortDescription: z.string().min(5, "Short description must be at least 5 characters").max(160, "Short description must be less than 160 characters"),
    category: z.string().min(1, "Please select a category"),
    subcategory: z.string().optional(),
    price: z.number().min(0.01, "Price must be greater than 0"),
    compareAtPrice: z.number().optional(),
    cost: z.number().min(0, "Cost must be 0 or greater").optional(),
    sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
    barcode: z.string().optional(),
    trackQuantity: z.boolean().default(true),
    quantity: z.number().min(0, "Quantity cannot be negative").optional(),
    weight: z.number().min(0, "Weight cannot be negative").optional(),
    dimensions: z.object({
        length: z.number().min(0).optional(),
        width: z.number().min(0).optional(),
        height: z.number().min(0).optional(),
    }).optional(),
    tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
    seoTitle: z.string().max(60, "SEO title must be less than 60 characters").optional(),
    seoDescription: z.string().max(160, "SEO description must be less than 160 characters").optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    requiresShipping: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

// Categories are now managed dynamically through CategoryContext

export function CreateProduct2() {
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [tagInput, setTagInput] = useState("");
    //const [selectedCategory, setSelectedCategory] = useState("");
    //const { categories } = useCategories();
    const { toast } = useToast();

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            shortDescription: "",
            category: "",
            subcategory: "",
            price: 0,
            compareAtPrice: 0,
            cost: 0,
            sku: "",
            barcode: "",
            trackQuantity: true,
            quantity: 0,
            weight: 0,
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
            },
            tags: [],
            seoTitle: "",
            seoDescription: "",
            isActive: true,
            isFeatured: false,
            requiresShipping: true,
        },
    });

    const watchedTags = form.watch("tags");
    const watchedTrackQuantity = form.watch("trackQuantity");
    const watchedPrice = form.watch("price");
    const watchedCompareAtPrice = form.watch("compareAtPrice");

    const onSubmit = async (data: ProductFormData) => {
       
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

        const validFiles = files.filter(file => {
            if (!validImageTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload only JPEG, PNG, or WebP images.",
                    variant: "destructive",
                });
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: "File too large",
                    description: "Please upload images smaller than 5MB.",
                    variant: "destructive",
                });
                return false;
            }
            return true;
        });
        
        setUploadedImages(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 images
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };
 

    const profit = watchedPrice && watchedPrice > 0 && form.getValues("cost")
        ? ((watchedPrice - (form.getValues("cost") || 0)) / watchedPrice * 100).toFixed(1)
        : "0";

    const discount = watchedCompareAtPrice && watchedCompareAtPrice > watchedPrice
        ? ((watchedCompareAtPrice - watchedPrice) / watchedCompareAtPrice * 100).toFixed(0)
        : "0";

    return (
        <div className="min-h-screen bg-gradient-subtle p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Create New Product
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Add a new product to your e-commerce catalog
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="pricing" className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Pricing
                                </TabsTrigger>
                                <TabsTrigger value="inventory" className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Inventory
                                </TabsTrigger>
                                <TabsTrigger value="media" className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Media
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    SEO & Tags
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Information</CardTitle>                                       
                                    </CardHeader>
                                </Card>
                            </TabsContent>

                            <TabsContent value="pricing" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pricing Information</CardTitle>
                                        <CardDescription>
                                            Set your product pricing and cost information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Selling Price *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={e => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="compareAtPrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Compare At Price</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={e => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Original price for showing discounts
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="cost"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Cost Per Item</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={e => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your cost for this item
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {(watchedPrice > 0 || Number(discount) > 0) && (
                                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                                <h4 className="font-medium">Pricing Summary</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Profit Margin:</span>
                                                        <div className="font-semibold text-success">{profit}%</div>
                                                    </div>
                                                    {Number(discount) > 0 && (
                                                        <div>
                                                            <span className="text-muted-foreground">Discount:</span>
                                                            <div className="font-semibold text-primary">{discount}% off</div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-muted-foreground">Final Price:</span>
                                                        <div className="font-semibold text-lg">${watchedPrice?.toFixed(2) || "0.00"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="inventory" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inventory & Shipping</CardTitle>
                                        <CardDescription>
                                            Manage stock levels and shipping information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center space-x-2">
                                            <FormField
                                                control={form.control}
                                                name="trackQuantity"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Track quantity</FormLabel>
                                                            <FormDescription>
                                                                Enable inventory tracking for this product
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {watchedTrackQuantity && (
                                            <FormField
                                                control={form.control}
                                                name="quantity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Quantity in Stock</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                {...field}
                                                                onChange={e => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Shipping Information</h4>

                                            <div className="flex items-center space-x-2">
                                                <FormField
                                                    control={form.control}
                                                    name="requiresShipping"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>Requires shipping</FormLabel>
                                                                <FormDescription>
                                                                    This product needs to be physically shipped
                                                                </FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Weight (kg)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="0.0"
                                                                {...field}
                                                                onChange={e => field.onChange(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Used for shipping calculations
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="dimensions.length"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Length (cm)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="0.0"
                                                                    {...field}
                                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="dimensions.width"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Width (cm)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="0.0"
                                                                    {...field}
                                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="dimensions.height"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Height (cm)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="0.0"
                                                                    {...field}
                                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-6">
                                <Media handleImageUpload={handleImageUpload} uploadedImages={uploadedImages} removeImage={removeImage}/>
                            </TabsContent>

                            <TabsContent value="seo" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>SEO & Tags</CardTitle>
                                    </CardHeader>                               
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Reset Form
                            </Button>
                            <Button type="submit" variant="gradient" size="lg" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Creating Product..." : "Create Product"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}