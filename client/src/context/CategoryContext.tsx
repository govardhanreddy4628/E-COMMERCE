import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Subcategory, CategoryFormData } from '../types/category';

interface CategoryContextType {
  categories: Category[];
  addCategory: (data: CategoryFormData) => void;
  updateCategory: (id: string, data: Partial<CategoryFormData>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, data: Omit<CategoryFormData, 'parentId'>) => void;
  updateSubcategory: (id: string, data: Partial<Omit<CategoryFormData, 'parentId'>>) => void;
  deleteSubcategory: (id: string) => void;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const STORAGE_KEY = 'product-categories';

// Default categories from CreateProduct component
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    subcategories: [
      { id: '1-1', name: 'Smartphones', categoryId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '1-2', name: 'Laptops', categoryId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '1-3', name: 'Tablets', categoryId: '1', createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel',
    subcategories: [
      { id: '2-1', name: "Men's Wear", categoryId: '2', createdAt: new Date(), updatedAt: new Date() },
      { id: '2-2', name: "Women's Wear", categoryId: '2', createdAt: new Date(), updatedAt: new Date() },
      { id: '2-3', name: "Children's Wear", categoryId: '2', createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Home & Garden',
    description: 'Home and garden essentials',
    subcategories: [
      { id: '3-1', name: 'Furniture', categoryId: '3', createdAt: new Date(), updatedAt: new Date() },
      { id: '3-2', name: 'Kitchen', categoryId: '3', createdAt: new Date(), updatedAt: new Date() },
      { id: '3-3', name: 'Garden Tools', categoryId: '3', createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Sports & Recreation',
    description: 'Sports and recreational items',
    subcategories: [
      { id: '4-1', name: 'Fitness Equipment', categoryId: '4', createdAt: new Date(), updatedAt: new Date() },
      { id: '4-2', name: 'Outdoor Sports', categoryId: '4', createdAt: new Date(), updatedAt: new Date() },
      { id: '4-3', name: 'Team Sports', categoryId: '4', createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const categoriesWithDates = parsed.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
          updatedAt: new Date(cat.updatedAt),
          subcategories: cat.subcategories.map((sub: any) => ({
            ...sub,
            createdAt: new Date(sub.createdAt),
            updatedAt: new Date(sub.updatedAt),
          })),
        }));
        setCategories(categoriesWithDates);
      } catch (error) {
        console.error('Error loading categories from localStorage:', error);
        setCategories(defaultCategories);
      }
    } else {
      setCategories(defaultCategories);
    }
    setLoading(false);
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, loading]);

  const addCategory = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      subcategories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, data: Partial<CategoryFormData>) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id
          ? { ...cat, ...data, updatedAt: new Date() }
          : cat
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const addSubcategory = (categoryId: string, data: Omit<CategoryFormData, 'parentId'>) => {
    const newSubcategory: Subcategory = {
      id: `${categoryId}-${Date.now()}`,
      name: data.name,
      description: data.description,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: [...cat.subcategories, newSubcategory],
              updatedAt: new Date(),
            }
          : cat
      )
    );
  };

  const updateSubcategory = (id: string, data: Partial<Omit<CategoryFormData, 'parentId'>>) => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub =>
          sub.id === id
            ? { ...sub, ...data, updatedAt: new Date() }
            : sub
        ),
      }))
    );
  };

  const deleteSubcategory = (id: string) => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.filter(sub => sub.id !== id),
      }))
    );
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        loading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}