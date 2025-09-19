import React, { useState, ChangeEvent, FormEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { MdPublish } from "react-icons/md";

interface Category {
  id: string;
  name: string;
}

const SubCategory: React.FC = () => {
  // Dummy categories – replace with API call data
  const categories: Category[] = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
    { id: "3", name: "Furniture" },
  ];

  const [subCategory, setSubCategory] = useState({
    categoryId: "",
    name: "",
    description: "",
    images: [] as File[],
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSubCategory((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!subCategory.categoryId) {
      alert("Please select a category");
      return;
    }
    if (!subCategory.name.trim()) {
      alert("Subcategory name is required");
      return;
    }

    console.log("Selected Category ID:", subCategory.categoryId);
    console.log("Subcategory Name:", subCategory.name);
    console.log("Description:", subCategory.description);
    console.log("Images:", subCategory.images);

    // Implement API call here
  };

  return (
    <section className="p-5 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <form
        className="form py-1 p-1 md:p-8 md:py-1 space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Select Category */}
        <div className="w-full md:w-[40%]">
          <h3 className="text-sm font-medium mb-1 text-black dark:text-white">
            Select Category
          </h3>
          <select
            className="w-full h-[40px] border border-gray-300 dark:border-gray-600 
              dark:bg-gray-800 dark:text-white rounded-md px-2 text-sm focus:outline-none 
              focus:ring-2 focus:ring-blue-500"
            value={subCategory.categoryId}
            onChange={(e) =>
              setSubCategory((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Name */}
        <div className="w-full md:w-[40%]">
          <h3 className="text-sm font-medium mb-1 text-black dark:text-white">
            Subcategory Name
          </h3>
          <input
            type="text"
            className="w-full h-[40px] border border-gray-300 dark:border-gray-600 
              dark:bg-gray-800 dark:text-white rounded-md px-3 text-sm focus:outline-none 
              focus:ring-2 focus:ring-blue-500"
            value={subCategory.name}
            onChange={(e) =>
              setSubCategory((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>

        {/* Description */}
        <div className="w-full md:w-[60%]">
          <h3 className="text-sm font-medium mb-1 text-black dark:text-white">
            Description
          </h3>
          <textarea
            className="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 
              dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none 
              focus:ring-2 focus:ring-blue-500"
            value={subCategory.description}
            onChange={(e) =>
              setSubCategory((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* Image Upload */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-black dark:text-white">
            Subcategory Image
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {/* Upload Box */}
            <label
              htmlFor="imageUpload"
              className="uploadBox p-3 rounded-md overflow-hidden border border-dashed 
                border-gray-400 h-[150px] w-full bg-gray-100 dark:bg-gray-800 
                cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex 
                items-center justify-center flex-col text-gray-600 dark:text-gray-300"
            >
              <FiUploadCloud className="text-4xl opacity-70 mb-2" />
              <span className="text-sm">Upload Image</span>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                name="images"
                onChange={handleImageChange}
              />
            </label>

            {/* Preview Images */}
            {subCategory.images.map((file, idx) => (
              <div
                key={idx}
                className="relative w-full h-[150px] rounded-md overflow-hidden border"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="w-[250px]">
          <button
            type="submit"
            className="btn-blue btn-lg w-full flex gap-2 items-center justify-center 
              bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <MdPublish className="text-xl" />
            Publish and View
          </button>
        </div>
      </form>
    </section>
  );
};

export default SubCategory;
