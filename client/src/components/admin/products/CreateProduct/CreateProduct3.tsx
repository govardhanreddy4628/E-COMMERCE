import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdInfo, MdInventory } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi2";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlinePermMedia } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import Media from "./Media";
import BasicInfo from "./BasicInfo";
import Pricing from "./Pricing";
import Inventory from "./Inventory";
import SeoTags from "./SeoTags";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "../../../../hooks/use-toast";
import { Form } from "../../../../ui/form"

//import BasicInfo from "./BasicInfo";
import { sideBarContext } from "../../../../context/sidebarContext";
import { Button } from "../../../../ui/button";
import { useCategories } from "../../context/categoryContext";
import Offers from "./Offers";

const tabComponents: Record<string, React.ComponentType<any>> = {
    basic: BasicInfo,
    pricing: Pricing,
    offers: Offers,
    inventory: Inventory,
    media: Media,
    seotags: SeoTags,
};

const TABS = [
    { id: "basic", label: "Basic Info", icon: <MdInfo /> },
    { id: "pricing", label: "Pricing", icon: <BsCurrencyDollar /> },
    { id: "offers", label: "Offers", icon: <BiSolidOffer /> },
    { id: "inventory", label: "Inventory", icon: <MdInventory /> },
    { id: "media", label: "Media", icon: <MdOutlinePermMedia /> },
    { id: "seotags", label: "SEO&Tags", icon: <HiOutlineTag /> },
];



const offerSchema = z.object({
    type: z.enum(["Bank Offer", "Special Price", "Coupon", "Cashback"]),
    description: z.string().min(1, "Offer description is required"),
    discountValue: z.number().min(0).optional(),
    discountType: z.enum(["PERCENTAGE", "FLAT"]).optional(),
    maxDiscount: z.number().min(0).optional(),
    minOrderValue: z.number().min(0).optional(),
    applicableBanks: z.array(z.string()).optional(),
    paymentMethods: z.array(z.string()).optional(),
    applicableCategories: z.array(z.string()).optional(),
    applicableProducts: z.array(z.string()).optional(),
    couponCode: z.string().optional(),
    validFrom: z.string().optional(), // "2025-09-22"
    validTill: z.string().optional(), // "2025-09-30"
    usageLimit: z.number().min(1).optional(),
    isStackable: z.boolean().optional(),
    priority: z.number().optional()
});



const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(200, "Product name must be less than 100 characters"),
    shortDescription: z.string().min(5, "Short description must be at least 5 characters").max(160, "Short description must be less than 160 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
    category: z.string().min(1, "Please select a category"),
    subcategory: z.string().optional(),
    finalPrice: z.number().min(1, "Price must be greater than 0").max(200000),
    costPerItem: z.number().min(0, "Cost must be 0 or greater").optional(),
    listedPrice: z.number().optional(),
    highlights: z.array(z.string().min(2, "Highlight must be at least 2 characters")).max(10, "Max 10 highlights allowed").optional(), isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    //isFeatured: z.boolean().default(false),
    warranty: z.string(),
    sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
    productColor: z.string().optional(),
    availableColorsForProduct: z.array(z.string()).optional(),
    trackQuantity: z.boolean().default(true),
    quantityInStock: z.number().min(0, "Quantity In Stock cannot be negative").optional(),
    recentQuantity: z.number().min(0, "Recent Quantity cannot be negative").optional(),
    specifications: z.array(
        z.object({
            key: z.string().min(1, "Specification key is required"),
            value: z.string().min(1, "Specification value is required"),
            unit: z.string().optional(),
            group: z.string().optional(),
        })
    ).optional(),

    shipping: z.boolean().default(true),
    barcode: z.string().optional(),
    seoTags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
    seoTitle: z.string().max(60, "SEO title must be less than 60 characters").optional(),
    seoDescription: z.string().max(160, "SEO description must be less than 160 characters").optional(),
    offers: z.array(offerSchema).optional(),
    returnPolicy: z.string(),
    brand: z.string()
});

type ProductFormData = z.infer<typeof productSchema>;


export default function CreateProduct3() {
    const navigate = useNavigate();
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const [activeTab, setActiveTab] = useState("basic");
    const [wizardMode, setWizardMode] = useState(false);
    const [currentTab, setCurrentTab] = useState("basic");

    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [tagInput, setTagInput] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");
    const { categories } = useCategories();


    const context = useContext(sideBarContext);
    if (!context) { throw new Error('sideBarContext must be used within a Provider') }
    const { setIsExpand } = context;

    useEffect(() => { setIsExpand(false) }, [setIsExpand])

    const [validation, setValidation] = useState<Record<string, boolean>>(
        TABS.reduce((acc, tab) => ({ ...acc, [tab.id]: false }), {})
    );


    const { toast } = useToast();

    const MAX_IMAGES = 10;

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            shortDescription: "",
            category: "",
            subcategory: "",
            finalPrice: 0,
            listedPrice: 0,
            costPerItem: 0,
            sku: "",
            barcode: "",
            trackQuantity: true,
            quantityInStock: 0,
            recentQuantity: 0,
            specifications: [],
            seoTags: [],
            seoTitle: "",
            seoDescription: "",
            isActive: true,
            isFeatured: false,
            shipping: true,
            offers: [],
            warranty: "",
            brand: "",
            returnPolicy: "",
            highlights: [],
        },
    });

    const watchedTags = form.watch("seoTags");
    const watchedTrackQuantity = form.watch("trackQuantity");
    const watchedFinalPrice = form.watch("finalPrice");
    const watchedListedPrice = form.watch("listedPrice");

    const onSubmit = async (data: ProductFormData) => {
        try {

            // const allValid = Object.values(validation).every(Boolean);
            // if (!allValid) return;

            // In a real application, you would send this data to your API
            console.log("Product data:", data);
            console.log("Uploaded images:", uploadedImages);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/product/createproduct`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, images: uploadedImages.map(file => file.name) }) // send image names for now,
            });

            if (!res.ok) throw new Error("Product creation failed");
            
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
            return res.json();
        } catch (error) {
            toast({
                title: "Error creating product",
                description: "Please try again later.",
                variant: "destructive",
            });
            console.error("Error creating product:", error);
        }
    };



    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (tagInput.trim() && !watchedTags.includes(tagInput.trim()) && watchedTags.length < 10) {
            form.setValue("seoTags", [...watchedTags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        form.setValue("seoTags", watchedTags.filter(tag => tag !== tagToRemove));
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



    // IntersectionObserver for scroll spy
    useEffect(() => {
        if (wizardMode) return; // skip in wizard mode

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.id);
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
        );

        Object.values(sectionRefs.current).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [wizardMode]);

    const scrollToSection = (id: string) => {
        if (wizardMode) {
            setCurrentTab(id);
        } else {
            sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };



    const validateSection = (id: string, isValid: boolean) => {
        setValidation((prev) => ({ ...prev, [id]: isValid }));
    };

    const nextTab = () => {
        const idx = TABS.findIndex((t) => t.id === currentTab);
        if (idx < TABS.length - 1) setCurrentTab(TABS[idx + 1].id);
    };
    const prevTab = () => {
        const idx = TABS.findIndex((t) => t.id === currentTab);
        if (idx > 0) setCurrentTab(TABS[idx - 1].id);
    };



    const tabPropsMap: Record<string, any> = {
        basic: {
            tab: { id: "basic" },
            form,
            validateSection,
            generateSKU,
            categories,
            handleCategoryChange,
            selectedCategory
        },
        media: {
            uploadedImages,
            setUploadedImages,
            removeImage,
            MAX_IMAGES
        },
        pricing: {
            form,
            validateSection,
            watchedFinalPrice,
            watchedListedPrice
        },
        inventory: {
            form,
            watchedTrackQuantity,
        },
        seotags: {
            form,
            addTag,
            removeTag,
            watchedTags,
            tagInput,
            setTagInput,
        },
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden relative">
                    {/* Breadcrumb */}
                    <div className="p-4 border-b bg-white sticky top-0 z-50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                            <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900">← Back</button>
                            <span>/</span>
                            <span className="font-medium text-gray-800">Create Product</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <label>Wizard Mode</label>
                            <input type="checkbox" checked={wizardMode} onChange={(e) => setWizardMode(e.target.checked)} />
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden relative">
                        {/* Left Tabs */}
                        <div className="w-64 bg-white border-r p-4 overflow-y-auto hidden md:flex flex-col gap-2 sticky top-0 h-[calc(100vh-5rem)]">
                            {TABS.map((tab) => {
                                const isActive = wizardMode ? currentTab === tab.id : activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => scrollToSection(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-md text-left transition-all ${isActive
                                            ? "bg-blue-100 text-blue-600 font-medium"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                        {!validation[tab.id] === false && <span className="ml-auto text-red-500 text-xs">⚠️</span>}
                                    </button>
                                )
                            })}
                        </div>

                        {/*Scroll Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-14">
                            {TABS.map((tab) => {
                                const isVisible = wizardMode ? currentTab === tab.id : true;
                                if (!isVisible) return null;

                                const TabComponent = tabComponents[tab.id];
                                const extraProps = tabPropsMap[tab.id] || {};

                                return (
                                    <section
                                        key={tab.id}
                                        id={tab.id}
                                        ref={(el) => (sectionRefs.current[tab.id] = el)}
                                        className="scroll-mt-32"
                                    >
                                        <h2 className="text-2xl font-bold mb-2">{tab.label}</h2>
                                        <div className="bg-gray-100 p-6 rounded-md space-y-4">
                                            <TabComponent
                                                onValidate={(isValid: boolean) => validateSection(tab.id, isValid)}
                                                {...extraProps}
                                            />
                                        </div>
                                    </section>
                                );
                            })}

                            {wizardMode && (
                                <div className="flex justify-between mt-12">
                                    <button
                                        onClick={prevTab}
                                        disabled={TABS[0].id === currentTab}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={nextTab}
                                        disabled={TABS[TABS.length - 1].id === currentTab}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>



                    {!wizardMode && (
                        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
                            <Button type="button" className="px-6 py-3 rounded-md shadow-lg border border-gray-800 shadow-gray-500" variant="outline" onClick={() => form.reset()}>
                                Reset Form
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg shadow-gray-500 hover:bg-blue-700 transition"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Creating Product..." : "Create Product"}
                            </Button>

                        </div>
                    )}

                </div>
            </form>
        </Form>
    );
}
