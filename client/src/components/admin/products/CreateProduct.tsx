import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { Textarea } from "../../../ui/textarea";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Switch } from "../../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../../../ui/separator";
//import { useCategories } from "@/contexts/CategoryContext";
//import { CreateCategory } from "@/components/categories/CreateCategory";
import { X, Plus, Package, DollarSign, Image as ImageIcon, Tag, Settings } from "lucide-react";
import Media from "./CreateProduct/Media";
import BasicInfo from "./CreateProduct/BasicInfo";
import { useToast } from "../../../hooks/use-toast";
import { Badge } from "../../../ui/badge";
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
        try {
            // In a real application, you would send this data to your API
            console.log("Product data:", data);
            console.log("Uploaded images:", uploadedImages);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Product created successfully!",
                description: `${data.name} has been added to your catalog.`,
                variant: "default",
            });

            // Reset form
            form.reset();
            setUploadedImages([]);
            setTagInput("");
            setSelectedCategory("");
        } catch (error) {
            toast({
                title: "Error creating product",
                description: "Please try again later.",
                variant: "destructive",
            });
        }
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

    const addTag = () => {
        if (tagInput.trim() && !watchedTags.includes(tagInput.trim()) && watchedTags.length < 10) {
            form.setValue("tags", [...watchedTags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        form.setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        form.setValue("category", category);
        form.setValue("subcategory", ""); // Reset subcategory when category changes
    };

    const generateSKU = () => {
        const name = form.getValues("name");
        const category = form.getValues("category");
        if (name && category) {
            const sku = `${category.substring(0, 3).toUpperCase()}-${name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
            form.setValue("sku", sku);
        }
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
                                {/* <Card>
                                    <CardHeader>
                                        <CardTitle>Product Information</CardTitle>
                                        <CardDescription>
                                            Enter the basic details about your product
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Product Name *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter product name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="sku"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>SKU *</FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input placeholder="Enter SKU" {...field} />
                                                            </FormControl>
                                                            <Button type="button" variant="outline" onClick={generateSKU}>
                                                                Generate
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="shortDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Short Description *</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief product description (used in listings)"
                                                            className="min-h-[60px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This will appear in product listings and search results
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Description *</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Detailed product description"
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category *</FormLabel>
                                                        <Select onValueChange={handleCategoryChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {categories.map((category) => (
                                                                    <SelectItem key={category.id} value={category.name}>
                                                                        {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                                <div className="border-t mt-2 pt-2">
                                                                    <CreateCategory
                                                                        trigger={
                                                                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                                                                <Plus className="w-4 h-4 mr-2" />
                                                                                Add New Category
                                                                            </Button>
                                                                        }
                                                                    />
                                                                </div>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="subcategory"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Subcategory</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a subcategory" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {categories
                                                                    .find(cat => cat.name === selectedCategory)
                                                                    ?.subcategories.map((subcategory) => (
                                                                        <SelectItem key={subcategory.id} value={subcategory.name}>
                                                                            {subcategory.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                {selectedCategory && (
                                                                    <div className="border-t mt-2 pt-2">
                                                                        <CreateCategory
                                                                            mode="subcategory"
                                                                            parentCategoryId={categories.find(cat => cat.name === selectedCategory)?.id}
                                                                            trigger={
                                                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                                    Add New Subcategory
                                                                                </Button>
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="barcode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Barcode (UPC/EAN)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter barcode" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Optional: Used for inventory management and POS systems
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card> */}
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
                                        <CardDescription>
                                            Optimize your product for search engines and add relevant tags
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Product Tags</h4>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add a tag"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                                />
                                                <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim() || watchedTags.length >= 10}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {watchedTags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {watchedTags.map((tag, index) => (
                                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="ml-1 hover:text-destructive"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Add up to 10 tags to help customers find your product ({watchedTags.length}/10)
                                            </p>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Search Engine Optimization</h4>

                                            <FormField
                                                control={form.control}
                                                name="seoTitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>SEO Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Optimized title for search engines" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Leave blank to use the product name. Recommended: 50-60 characters
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="seoDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>SEO Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Brief description for search engine results"
                                                                className="min-h-[80px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Leave blank to use the short description. Recommended: 150-160 characters
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Product Settings</h4>

                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="isActive"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>Active Product</FormLabel>
                                                                <FormDescription>
                                                                    Product is visible and available for purchase
                                                                </FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="isFeatured"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>Featured Product</FormLabel>
                                                                <FormDescription>
                                                                    Display this product in featured sections
                                                                </FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
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