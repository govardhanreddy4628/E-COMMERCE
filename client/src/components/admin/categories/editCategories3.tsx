import React, { useEffect, useState, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  parentCategoryId?: string | null;
  image?: string;
  isActive?: boolean;
}

const mockCategories: Category[] = [
  { _id: '1', name: 'Electronics', parentCategoryId: null, isActive: true },
  { _id: '2', name: 'Fashion', parentCategoryId: null, isActive: true },
  { _id: '3', name: 'Mobiles', parentCategoryId: '1', isActive: true },
  { _id: '4', name: 'Laptops', parentCategoryId: '1', isActive: true },
];

const CreateCategory3 = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [addingParent, setAddingParent] = useState<Category | null | 'root'>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const getChildren = (parentId: string | null) =>
    categories.filter((cat) => cat.parentCategoryId === parentId);

  const handleSelect = (level: number, category: Category) => {
    const newPath = [...selectedPath.slice(0, level), category];
    setSelectedPath(newPath);
    setAddingParent(null);
    resetForm();
  };

  const handleAddClick = (parent: Category | null) => {
    setAddingParent(parent || 'root');
    resetForm();
  };

  const resetForm = () => {
    setNewCategoryName('');
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return toast.error('Category name cannot be empty');

    const parentId = addingParent === 'root' ? null : (addingParent as Category)?._id || null;

    const duplicate = categories.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.parentCategoryId === parentId
    );
    if (duplicate) return toast.error('Duplicate category under same parent');

    const newCategory: Category = {
      _id: Date.now().toString(),
      name,
      parentCategoryId: parentId,
      isActive,
      image: imagePreview || undefined,
    };

    setCategories((prev) => [...prev, newCategory]);
    toast.success(`Added "${name}"`);

    if (addingParent !== null) {
      if (addingParent === 'root') {
        setSelectedPath([]);
      } else {
        const idx = selectedPath.findIndex((c) => c._id === (addingParent as Category)._id);
        if (idx >= 0) {
          setSelectedPath((prev) => [...prev.slice(0, idx + 1), newCategory]);
        }
      }
    }

    resetForm();
    setAddingParent(null);
  };

  const handleDeleteCategory = (category: Category) => {
    const deleteRecursive = (id: string): string[] => {
      const children = categories.filter((c) => c.parentCategoryId === id);
      return [id, ...children.flatMap((child) => deleteRecursive(child._id))];
    };

    const idsToDelete = deleteRecursive(category._id);
    const updated = categories.filter((cat) => !idsToDelete.includes(cat._id));
    setCategories(updated);

    const pathIndex = selectedPath.findIndex((c) => c._id === category._id);
    if (pathIndex !== -1) {
      setSelectedPath((prev) => prev.slice(0, pathIndex));
    }

    toast.success(`Deleted "${category.name}" and its subcategories`);
  };

  const getLevels = (): Category[][] => {
    const levels: Category[][] = [];
    levels.push(getChildren(null));
    for (let i = 0; i < selectedPath.length; i++) {
      const children = getChildren(selectedPath[i]._id);
      levels.push(children);
    }
    return levels;
  };

  const levels = getLevels();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 dark:text-white border rounded shadow h-full">
      <h2 className="text-xl font-bold mb-4">Create Category</h2>

      <div className="flex overflow-x-auto space-x-4 pb-2">
        {levels.map((cats, level) => (
          <div
            key={level}
            className="w-64 min-w-[16rem] border rounded p-2 flex-shrink-0 dark:border-gray-700"
          >
            <div className="font-semibold text-sm mb-2">
              {level === 0 ? 'Main Categories' : `Level ${level}`}
            </div>

            <ul className="space-y-1 max-h-64 overflow-y-auto">
              {cats.map((cat) => (
                <li
                  key={cat._id}
                  className={`flex justify-between items-center px-2 py-1 rounded border transition ${
                    selectedPath[level]?._id === cat._id
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-950 font-semibold'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span
                    className="cursor-pointer flex-1"
                    onClick={() => handleSelect(level, cat)}
                  >
                    {cat.name}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-red-500 text-xs ml-2 hover:text-red-700 dark:hover:text-red-400"
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <button
                onClick={() =>
                  handleAddClick(level === 0 ? null : selectedPath[level - 1])
                }
                className="w-full text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-800 text-sm"
              >
                + Add {level === 0 ? 'to main' : 'subcategory'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingParent !== null && (
        <div className="mt-6 p-4 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 max-w-xl">
          <p className="mb-2 text-gray-700 dark:text-gray-200 text-sm">
            This category will be added under:{' '}
            <strong>
              {addingParent === 'root'
                ? 'Main Category'
                : selectedPath
                    .filter((c) => c._id !== (addingParent as Category)._id)
                    .map((c) => c.name)
                    .concat((addingParent as Category).name)
                    .join(' → ')}
            </strong>
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              autoFocus
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Is Active?</label>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded border"
                />
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAddingParent(null);
                  resetForm();
                }}
                className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCategory3;
