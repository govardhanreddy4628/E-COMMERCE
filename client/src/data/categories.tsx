interface Category {
    name: string;
    path: string;
    subcategories: {
        name: string;
        children: string[];
    }[];
}

export const categories: Category[] = [
    {
        name: "fashion",
        path: "/productcategory",
        subcategories: [
            {
                name: "Men",
                children: ["Shirts", "Trousers", "Shoes"]
            },
            {
                name: "Women",
                children: ["Dresses", "Heels", "Bags"]
            },
            {
                name: "Girls",
                children: ["Tops", "Jeans", "Shoes"]
            },
            {
                name: "Kids",
                children: ["Toys", "Clothing", "Accessories"]
            },
        ]
    },
    {
        name: "electronics",
        path: "/electronics",
        subcategories: [
            { name: "Mobiles", children: ["Android", "iOS", "Accessories"] },
            { name: "Laptops", children: ["Gaming", "Ultrabooks", "Accessories"] },
        ]
    },
    {
        name: "bags",
        path: "/bags",
        subcategories: [
            { name: "Handbags", children: ["Leather", "Fabric", "Designer"] },
            { name: "Backpacks", children: ["Laptop", "Travel", "Casual"] },
        ]
    },
    {
        name: "footwear",
        path: "/footwear",
        subcategories: [
            { name: "Men", children: ["Sneakers", "Sandals", "Formal"] },
            { name: "Women", children: ["Heels", "Flats", "Boots"] },
        ]
    },
    {
        name: "groceries",
        path: "/groceries",
        subcategories: [
            { name: "Fruits", children: ["Fresh", "Frozen"] },
            { name: "Vegetables", children: ["Leafy", "Root"] },
        ]
    },
    {
        name: "beauty",
        path: "/beauty",
        subcategories: [
            { name: "Skincare", children: ["Face", "Body", "Sunscreen"] },
            { name: "Makeup", children: ["Lipstick", "Foundation", "Blush"] },
        ]
    },
    {
        name: "wellness",
        path: "/wellness",
        subcategories: [
            { name: "Supplements", children: ["Vitamins", "Proteins"] },
            { name: "Fitness", children: ["Yoga", "Gym Equipment"] },
        ]
    },
    {
        name: "jewellery",
        path: "/jewellery",
        subcategories: [
            { name: "Gold", children: ["Necklace", "Rings"] },
            { name: "Silver", children: ["Bracelets", "Earrings"] },
        ]
    }
];