import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Checkbox,
  FormControlLabel,
  Slider,
  Button,
  IconButton,
} from "@mui/material";
import { FaAngleDown } from "react-icons/fa";
import { useCategories } from "./admin/context/categoryContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  rating: number;
}

const Productcategory = () => {
  const { categories, loading } = useCategories();
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("catId");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const [filters, setFilters] = useState({
    categories: [] as string[],
    rating: [] as number[],
    priceRange: [0, 50000] as [number, number],
  });

  // ---------------- FETCH PRODUCTS ----------------
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;

      setLoadingProducts(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/product/category/id/${categoryId}`
        );

        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();

    // sync filter
    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryId],
      }));
    }
  }, [categoryId]);

  // ---------------- CATEGORY CHANGE ----------------
  const handleCategoryChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [id], // single select (matches backend)
    }));
  };

  // ---------------- RATING ----------------
  const ratingRanges = {
    1: [1, 2],
    2: [2, 3],
    3: [3, 4],
    4: [4, 5.1],
  };

  const handleRatingChange = (star: number) => {
    setFilters((prev) => {
      const exists = prev.rating.includes(star);

      return {
        ...prev,
        rating: exists
          ? prev.rating.filter((r) => r !== star)
          : [...prev.rating, star],
      };
    });
  };

  // ---------------- PRICE ----------------
  const handlePriceChange = (_: Event, value: number | number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value as [number, number],
    }));
  };

  // ---------------- FILTER PRODUCTS ----------------
  const filteredProducts = products
    .filter((p) => {
      if (filters.rating.length === 0) return true;

      return filters.rating.some((r) => {
        const [min, max] = ratingRanges[r as 1 | 2 | 3 | 4];
        return p.rating >= min && p.rating < max;
      });
    })
    .filter(
      (p) =>
        p.price >= filters.priceRange[0] &&
        p.price <= filters.priceRange[1]
    );

  // ---------------- TOGGLE CATEGORY ----------------
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ---------------- RENDER CATEGORY TREE ----------------
  const renderCategories = (cats: any[], level = 0) =>
    cats.map((cat) => (
      <div key={cat._id} style={{ paddingLeft: level * 10 }}>
        <div className="flex items-center justify-between">
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.categories.includes(cat._id)}
                onChange={() => handleCategoryChange(cat._id)}
                size="small"
              />
            }
            label={
              <Link to={`/products?catId=${cat._id}`}>
                {cat.name}
              </Link>
            }
          />

          {/* Dropdown icon */}
          {cat.subcategories?.length > 0 && (
            <IconButton size="small" onClick={() => toggleExpand(cat._id)}>
              <FaAngleDown
                className={`transition ${
                  expanded[cat._id] ? "rotate-180" : ""
                }`}
              />
            </IconButton>
          )}
        </div>

        {/* CHILDREN (ONLY WHEN EXPANDED) */}
        {expanded[cat._id] &&
          cat.subcategories?.length > 0 &&
          renderCategories(cat.subcategories, level + 1)}
      </div>
    ));

  // ---------------- UI ----------------
  return (
    <div className="flex w-full">
      {/* SIDEBAR */}
      <aside className="w-[250px] p-3 border-r">
        <h3 className="font-bold mb-2">Categories</h3>

        {loading ? <p>Loading...</p> : renderCategories(categories)}

        {/* PRICE */}
        <div className="mt-4">
          <h3>Price</h3>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={50000}
          />
          <p>
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </p>
        </div>

        {/* RATING */}
        <div className="mt-4">
          <h3>Rating</h3>
          {[5, 4, 3, 2, 1].map((star) => (
            <FormControlLabel
              key={star}
              control={
                <Checkbox
                  checked={filters.rating.includes(star)}
                  onChange={() => handleRatingChange(star)}
                />
              }
              label={"★".repeat(star)}
            />
          ))}
        </div>

        {/* CLEAR */}
        <Button
          onClick={() =>
            setFilters({
              categories: [],
              rating: [],
              priceRange: [0, 50000],
            })
          }
        >
          Clear Filters
        </Button>
      </aside>

      {/* PRODUCTS */}
      <div className="flex-1 p-4">
        <h2 className="mb-4">
          Products ({filteredProducts.length})
        </h2>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div key={p._id} className="border p-3">
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <p>⭐ {p.rating}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productcategory;
