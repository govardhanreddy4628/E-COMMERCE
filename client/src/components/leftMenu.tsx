import { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const categories: Category[] = [
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

const LeftMenu = () => {
  const [showSubCategories, setShowSubCategories] = useState<string[]>([]);

  const handleCategoryDropDown = (id) => {
    if (showSubCategories.includes(id)) {
      setShowSubCategories(prev => prev.filter(item => item !== id))
    } else {
      setShowSubCategories(prev => [...prev, id])
    }
  }

  return (
    <div className="mx-3">
      <div className='p-2 my-3'><img src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg" /></div>
      <div className="flex justify-between items-center p-2 ">
        <h2 className="font-bold">Shop by Category</h2>
        <IoClose className="text-2xl cursor-pointer" onClick={() => document.body.click()} />
      </div>
      <div>
        {categories.map((category) => {
          return (
            <div key={category.name}>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer" onClick={() => handleCategoryDropDown(category.name)}>
                <h6>{category.name}</h6>
                <div >
                  {category.subcategories && category.subcategories.length > 0 && <IoIosArrowDropdown className={`${showSubCategories.includes(category.name) ? "rotate-180" : ""}`} />}
                </div>
              </div>

                {showSubCategories.includes(category.name) && <div>{category.subcategories && category.subcategories.length > 0 && category.subcategories.map((subcategory) => {
                  return (<div key={subcategory.name} className="ml-4 flex justify-between items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer" >
                    <h5>{subcategory.name}</h5>
                    <div onClick={() => handleSubCategoryDropDown(subcategory.name)}>
                      {subcategory.children && subcategory.children.length > 0 && <IoIosArrowDropdown />}
                    </div>
                  </div>)
                })}
                </div>}
            </div>
          )
        })}
      </div>
    </div>

  )
}

export default LeftMenu
