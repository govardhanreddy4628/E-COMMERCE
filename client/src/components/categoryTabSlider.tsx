import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import ProductCard from "./productCard";
import { Product } from "../types/product";

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

const ProductsSlider = ({ categorySlug, handleClickOpen }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ CONTEXTS
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, updateQuantity } = useCart();

  // =========================
  // ✅ FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/product/category/${categorySlug}`
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  // =========================
  // ✅ CART HANDLERS (CLEAN)
  // =========================
  const handleAdd = (product: Product) => {
    if (!isAuthenticated) {
      console.log("Login required");
      return;
    }
    addToCart(product, 1);
  };

  const handleIncrease = (productId: string) => {
    updateQuantity(productId, "inc");
  };

  const handleDecrease = (productId: string) => {
    updateQuantity(productId, "dec");
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
              const item = cart[product._id];
                return (
                  <SwiperSlide key={product._id}>
                    <ProductCard
                      product={product}
                      item={item}
                      handleAdd={handleAdd}
                      handleIncrease={handleIncrease}
                      handleDecrease={handleDecrease}
                      handleClickOpen={handleClickOpen}
                    />
                  </SwiperSlide>
                );
              })    
            }
        </Swiper>
      </div>
    </div>
  );
};

export default ProductsSlider;
