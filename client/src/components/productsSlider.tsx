import { useEffect, useState } from "react";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IoExpand } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// ✅ Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Gold Necklace",
    description: "Elegant 22K gold necklace for all occasions.",
    brand: "Spicez Gold",
    discount: 10,
    price: 999.99,
    originalPrice: 1199.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
  {
    id: 2,
    name: "Diamond Earrings",
    description: "Beautiful diamond studs with 18K gold base.",
    brand: "Luxe Jewels",
    discount: 15,
    price: 599.99,
    originalPrice: 699.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
  {
    id: 3,
    name: "Silver Bracelet",
    description: "Minimal design, perfect for daily wear.",
    brand: "SilverStone",
    discount: 8,
    price: 249.99,
    originalPrice: 299.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
  {
    id: 4,
    name: "Gold Bangles",
    description: "Traditional handcrafted bangles in 22K gold.",
    brand: "Spicez Gold",
    discount: 12,
    price: 799.99,
    originalPrice: 899.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
  {
    id: 5,
    name: "Pearl Necklace",
    description: "Elegant pearls with a gold-plated clasp.",
    brand: "Oceanic Pearls",
    discount: 20,
    price: 499.99,
    originalPrice: 699.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
  {
    id: 6,
    name: "Gemstone Ring",
    description: "Radiant ruby stone with pure gold band.",
    brand: "Royal Gems",
    discount: 5,
    price: 349.99,
    originalPrice: 369.99,
    images: [
      "https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg",
      "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    ],
  },
];

// ✅ Skeleton Card
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden animate-pulse">
    <div className="bg-gray-300 dark:bg-gray-700 w-full h-[200px]" />
    <div className="w-full p-3 flex flex-col gap-2">
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
    </div>
  </div>
);

const ProductsSlider = ({ handleClickOpen }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 2000);
  }, []);

  // ✅ Add to Cart
  const handleAddToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: 1 }));
  };

  // ✅ Increase Qty
  const handleIncrease = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  // ✅ Decrease Qty
  const handleDecrease = (id: number) => {
    setCart((prev) => {
      const qty = prev[id] - 1;
      if (qty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty };
    });
  };

  return (
    <div className="categorySwiper my-8">
      <div className="w-[95%] mx-auto">
        <Swiper
          slidesPerView={6}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
           breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 2.5, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 10 },
            1024: { slidesPerView: 4, spaceBetween: 12 },
            1280: { slidesPerView: 6, spaceBetween: 10 },
            1536: { slidesPerView: 6, spaceBetween: 12 },
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : products.map((product) => {
                const inCart = cart[product.id] !== undefined;
                const qty = cart[product.id] || 0;

                return (
                  <SwiperSlide key={product.id}>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden">
                      <div className="bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group">
                        <Link
                          to={`/productdetails/${product.id}`}
                          className="w-full h-[200px] relative overflow-hidden"
                        >
                          <img
                            src={product.images[0]}
                            className="w-full opacity-100 hover:opacity-0 transition duration-500"
                          />
                          <img
                            src={product.images[1]}
                            className="w-full absolute top-[0px] left-[0px] opacity-0 group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500"
                          />
                        </Link>

                        <div className="bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50">
                          {product.discount}%
                        </div>

                        <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                          <div
                            className="h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
                            onClick={handleClickOpen}
                          >
                            <IoExpand />
                          </div>
                          <div className="h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white hover:bg-red-500 transition-all cursor-pointer">
                            <FaRegHeart />
                          </div>
                        </div>
                      </div>

                      <div className="info flex flex-col itms-center hustify-center w-full p-3">
                        <h6 className="text-[14px] font-[600] capitalize mt-2">
                          <Link to="/" className="link">
                            {product.name}
                          </Link>
                        </h6>
                        <p className="text-[13px] font-[400] text-gray-500 dark:text-gray-300 mt-1">
                          {product.brand}
                        </p>
                        <h3 className="text-[13px] font-[300] leading-[20px] mt-2 text-[rgba(0,0,0,0.6)] dark:text-gray-300 transition-all">
                          {product.description}
                        </h3>

                        <div className="flex items-center justify-between w-full py-2">
                          <p className="text-[16px] font-medium line-through text-gray-600 dark:text-gray-300">
                            ${product.originalPrice}
                          </p>
                          <p className="text-[16px] font-bold text-red-400">
                            ${product.price}
                          </p>
                        </div>

                        {/* ✅ Cart Button Logic */}
                        {!inCart ? (
                          <Button
                            className="flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCartCheckoutIcon /> ADD TO CART
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between !w-[90%] border border-red-400 rounded-md !mx-auto !my-4 text-red-400">
                            {/* <IconButton
                              onClick={() => handleRemove(product.id)}
                              className="!text-red-400"
                            >
                              <DeleteOutlineIcon />
                            </IconButton> */}
                            <IconButton
                              onClick={() => handleDecrease(product.id)}
                              className="!text-red-400 cursor-pointer border-r"
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Button
                              onClick={() => navigate("/cart")}
                              className="!text-red-400 font-medium text-nowrap"
                            >
                              GO TO CART ({qty})
                            </Button>
                            <IconButton
                              onClick={() => handleIncrease(product.id)}
                              className="!text-red-400 cursor-pointer"
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductsSlider;
