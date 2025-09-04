import React, { useState, ChangeEvent, FormEvent } from 'react';

const CategoryForm: React.FC = () => {
  const [category, setCategory] = useState({
    name: '',
    images: [] as File[],
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory((prev) => ({ ...prev, images: Array.from(e.target.files || []) }))
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!category.name.trim()) {
      alert('Category name is required');
      return;
    }

    console.log('Category Name:', category.name);
    console.log('Images:', category.images);

    // Implement further submit logic (e.g., API call)
  };

  return (
    <section className="p-5 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-1 md:pr-4 pt-4">
          <div className="grid grid-cols-1 mb-3">
            <div className="col w-full md:w-[25%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black dark:text-white">Category Name</h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-sm p-3 text-sm"
                name="name"
                value={category.name}
                onChange={(e) => setCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <br />
          <h3 className="text-[14px] font-[500] mb-2 text-black dark:text-white">Category Image</h3>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <div className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center flex-col relative">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                className="text-[40px] opacity-35 pointer-events-none"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M160 80h352c8.8 0 16 7.2 16 16v224c0 8.8-7.2 16-16 16h-21.2L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zm-64 16v224c0 35.3 28.7 64 64 64h352c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120v224c0 75.1 60.9 136 136 136h320c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0-64 0 32 32 0 1 0 64 0z" />
              </svg>
              <h4 className="text-[14px] pointer-events-none">Image Upload</h4>
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
                name="images"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        <br /><br />

        <div className="w-[250px]">
          <button
            type="submit"
            className="btn-blue btn-lg w-full flex gap-2 items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 640 512"
              className="text-[25px]"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z" />
            </svg>
            Publish and View
          </button>
        </div>
      </form>
    </section>
  );
};

export default CategoryForm;
