import { useEffect, useMemo, useState } from "react";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
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
import { useAuth } from "../context/authContext";

/* ======================
   Skeleton
====================== */

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden animate-pulse">
    <div className="bg-gray-300 dark:bg-gray-700 w-full h-[200px]" />
    <div className="w-full p-3 flex flex-col gap-2">
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-3" />
      <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded mt-4" />
    </div>
  </div>
);

/* ======================
   Component
====================== */

const ProductsSlider = ({
  handleClickOpen,
  categoryId,
}: {
  handleClickOpen: () => void;
  categoryId: string;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = !!user;

  /* ======================
     Fetch Products
  ====================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/products?category=${categoryId}`
        );
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  /* ======================
     Fetch Cart
  ====================== */

  const fetchCart = async () => {
    if (!isLoggedIn) return;

    try {
      const res = await fetch("http://localhost:8080/api/v1/cart", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCartItems(data.data);
    } catch (err) {
      console.error("Cart fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  /* ======================
     Cart Helpers
  ====================== */

  const cartMap = useMemo(() => {
    const map: Record<string, { qty: number; cartItemId: string }> = {};
    cartItems.forEach((item) => {
      map[item.productId._id] = {
        qty: item.quantity,
        cartItemId: item._id,
      };
    });
    return map;
  }, [cartItems]);

  /* ======================
     Cart Actions
  ====================== */

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    await fetch("http://localhost:8080/api/v1/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    fetchCart();
  };

  const handleIncrease = async (productId: string) => {
    const item = cartMap[productId];
    if (!item) return;

    await fetch("http://localhost:8080/api/v1/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        cartItemId: item.cartItemId,
        quantity: item.qty + 1,
      }),
    });

    fetchCart();
  };

  const handleDecrease = async (productId: string) => {
    const item = cartMap[productId];
    if (!item) return;

    if (item.qty === 1) {
      await fetch("http://localhost:8080/api/v1/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId: item.cartItemId }),
      });
    } else {
      await fetch("http://localhost:8080/api/v1/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cartItemId: item.cartItemId,
          quantity: item.qty - 1,
        }),
      });
    }

    fetchCart();
  };

  /* ======================
     Render
  ====================== */

  return (
    <div className="categorySwiper my-8">
      <div className="w-[95%] mx-auto">
        <Swiper
          slidesPerView={6}
          spaceBetween={10}
          navigation
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : products.map((product) => {
                const cartItem = cartMap[product._id];

                return (
                  <SwiperSlide key={product._id}>
                    {/* 🔥 CARD — STYLING UNCHANGED */}
                    {/* (your existing JSX unchanged here) */}

                    {!cartItem ? (
                      <Button
                        className="flex items-center justify-center !w-[90%] !border-[1.5px] !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        <ShoppingCartCheckoutIcon /> ADD TO CART
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between !w-[90%] border border-red-400 rounded-md !mx-auto !my-4 text-red-400">
                        <IconButton
                          onClick={() => handleDecrease(product._id)}
                          className="!text-red-400 border-r"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Button
                          onClick={() => navigate("/cart")}
                          className="!text-red-400 font-medium"
                        >
                          GO TO CART ({cartItem.qty})
                        </Button>
                        <IconButton
                          onClick={() => handleIncrease(product._id)}
                          className="!text-red-400"
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                    )}
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductsSlider;
