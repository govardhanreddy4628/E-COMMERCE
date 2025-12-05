// context/categoryContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Category, CategoryFormData } from "../types/category";
import { getCategoryId } from "../categories/CategoryUtility";

interface CategoryContextType {
  categories: Category[];
  addCategory: (data: CategoryFormData) => Promise<Category>;
  updateCategory: (id: string, data: Partial<CategoryFormData>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  loading: boolean;
  findCategoryById: (id: string, categories?: Category[]) => Category | null;
  getAllCategories: () => Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Convert "children" to "subcategories" recursively and normalize dates recursively
  const normalizeCategoryTree = (cat: any): Category => ({
    ...cat,
    subcategories: Array.isArray(cat.children)
      ? cat.children.map(normalizeCategoryTree)
      : [],
    createdAt: cat.createdAt ? new Date(cat.createdAt) : new Date(),
    updatedAt: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
  });


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/category/tree`);

        const data = await res.json();
        console.log("Fetched category tree:", data);

        if (data.success) {
          // Defensive check: try multiple possible locations for the array
          const rawList = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.categories)
              ? data.categories
              : Array.isArray(data.data?.categories)
                ? data.data.categories
                : [];

          // 🧩 Convert "children" to "subcategories" recursively and normalize dates recursively
          const normalizedList = rawList.map(normalizeCategoryTree);
          setCategories(normalizedList);
        } else {
          console.error("Failed to fetch categories:", data.message);
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);




  const findCategoryById = (id: string, cats: Category[] = categories): Category | null => {
    if (!Array.isArray(cats)) return null;
    for (const cat of cats) {
      if (!cat) continue;
      if (String(cat.id) === String(id)) return cat;
      const found = findCategoryById(id, cat.subcategories || []);
      if (found) return found;
    }
    return null;
  };

  const getAllCategories = (): Category[] => {
    const flatten = (cats: Category[] = []): Category[] =>
      cats.reduce(
        (acc, cat) => [...acc, cat, ...flatten(cat.subcategories || [])],
        [] as Category[]
      );
    return flatten(categories);
  };



  // ------------------ Add Category ------------------
  const addCategory = async (data: CategoryFormData): Promise<Category> => {
    console.log(data.imageFile)
    const formData = new FormData();
    formData.append("name", data.name.trim());
    if (data.description) formData.append("description", data.description.trim());
    if (data.parentCategoryId) formData.append("parentCategoryId", data.parentCategoryId);
    if (data.imageFile) formData.append("image", data.imageFile);


    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/category/create-category`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Category creation failed: ${text}`);
    }

    const body = await res.json();
    const savedCategory: Category = body.category ?? body;

    // Normalize dates and IDs if necessary
    const normalized: Category = {
      ...savedCategory,
      id: String(savedCategory.id ?? savedCategory._id ?? Date.now()),
      name: savedCategory.name ?? "Untitled",
      createdAt: savedCategory.createdAt ? new Date(savedCategory.createdAt) : new Date(),
      updatedAt: savedCategory.updatedAt ? new Date(savedCategory.updatedAt) : new Date(),
      subcategories: Array.isArray(savedCategory.subcategories)
        ? savedCategory.subcategories
        : [],
    };

    setCategories(prev => {
      if (normalized.parentCategoryId) {
        const addToParent = (cats: Category[]): Category[] =>
          cats.map(cat => {
            if (getCategoryId(cat) === String(normalized.parentCategoryId)) {
              return { ...cat, subcategories: [...cat.subcategories, normalized], updatedAt: new Date() };
            }
            return { ...cat, subcategories: addToParent(cat.subcategories || []) };
          });
        return addToParent(prev);
      } else {
        return [...prev, normalized];
      }
    });

    return normalized;
  };

   // ------------------ Update Category ------------------
  const updateCategory = async (id: string, data: Partial<CategoryFormData>): Promise<Category> => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/category/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const body = await res.json();

    if (!res.ok || !body.success) {
      throw new Error(body.message || "Failed to update category");
    }

    const updated = body.category ?? body.data;
    
     const normalized: Category = {
      ...updated,
      id: String(updated.id ?? updated._id),
      createdAt: updated.createdAt ? new Date(updated.createdAt) : new Date(),
      updatedAt: updated.updatedAt ? new Date(updated.updatedAt) : new Date(),
      subcategories: updated.subcategories || [],
    };

    const updateInTree = (cats: Category[]): Category[] =>
      cats.map(cat => {
        if (getCategoryId(cat) === id) {
          return { ...cat, ...normalized };
        }
        return { ...cat, subcategories: updateInTree(cat.subcategories || []) };
      });

    setCategories(prev => updateInTree(prev));

    return normalized;
  };

// ------------------ Delete Category ------------------
  const deleteCategory = async (id: string): Promise<void> => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/category/delete/${id}`,
      { method: "DELETE" }
    );

    const body = await res.json();

    if (!res.ok || !body.success) {
      throw new Error(body.message || "Failed to delete category");
    }

    const deleteFromTree = (cats: Category[]): Category[] =>
      cats
        .filter(cat => getCategoryId(cat) !== id)
        .map(cat => ({ ...cat, subcategories: deleteFromTree(cat.subcategories || []) }));

    setCategories(prev => deleteFromTree(prev));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, loading, findCategoryById, getAllCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}








// const updateCategory = (id: string, data: Partial<CategoryFormData>) => {
//     const updateInTree = (cats: Category[]): Category[] =>
//       cats.map(cat => {
//         if (getCategoryId(cat) === id) {
//           return { ...cat, ...data, updatedAt: new Date() } as Category;
//         }
//         return { ...cat, subcategories: updateInTree(cat.subcategories || []) };
//       });
//     setCategories(prev => updateInTree(prev));
//   };

//   const deleteCategory = (id: string) => {
//     const deleteFromTree = (cats: Category[]): Category[] =>
//       cats
//         .filter(cat => getCategoryId(cat) !== id)
//         .map(cat => ({ ...cat, subcategories: deleteFromTree(cat.subcategories || []) }));
//     setCategories(prev => deleteFromTree(prev));
//   };