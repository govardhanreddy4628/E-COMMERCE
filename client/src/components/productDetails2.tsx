import "react-inner-image-zoom/lib/styles.min.css";
import "swiper/css";
import "swiper/css/navigation";

import InnerImageZoom from "react-inner-image-zoom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

import { getCloudinaryImage } from "../utils/imgTransformation";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";




/* ================= TYPES ================= */

interface ProductImage {
    url: string;
    role: string;
}

interface Product {
    _id: string;
    name: string;
    shortDescription: string;
    price: number;
    rating: number;
    quantityInStock: number;
    images: ProductImage[];
    specifications: { key: string; value: string }[];
}

/* ================= COMPONENT ================= */

const ProductDetails2 = () => {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const { addToCart } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/v1/product/getproductdetails/${id}`
                );

                if (res.data?.success && res.data?.data) {
                    setProduct(res.data.data);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="p-10">Loading...</div>;
    if (!product) return null;

    /* ================= IMAGES ================= */

    const images = product.images?.map((img) => img.url) || [];

    /* ================= RENDER ================= */

    return (
        <section className="max-w-9xl rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800">
            <div className="flex w-[95%] mx-auto bg-gray-50 pl-5 dark:bg-gray-900">

                {/* ================= IMAGE COLUMN (UNCHANGED) ================= */}
                <div className="flex items-center gap-4 w-[45%]">
                    {/* Thumbs */}
                    <div className="w-24 h-[460px]">
                        <Swiper
                            direction="vertical"
                            navigation
                            spaceBetween={15}
                            slidesPerView="auto"
                            freeMode
                            onSwiper={setThumbsSwiper}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="verticalSwiper h-full"
                        >
                            {images.map((src, i) => (
                                <SwiperSlide
                                    key={i}
                                    className="!w-full !h-[80px] p-1 opacity-70 cursor-pointer group rounded-md overflow-hidden"
                                >
                                    <img
                                        src={getCloudinaryImage(src, {
                                            width: 100,
                                            height: 100,
                                        })}
                                        alt={`Slide ${i + 1}`}
                                        className="w-full h-full object-cover transition-all group-hover:scale-105 rounded-sm"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Main Image */}
                    <div className="w-[72%] h-[95%] ml-4 flex items-center justify-center">
                        <Swiper
                            slidesPerView={1}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="w-full h-full"
                        >
                            {images.map((src) => (
                                <SwiperSlide
                                    key={src}
                                    className="flex items-center justify-center"
                                >
                                    <InnerImageZoom
                                        src={src}
                                        zoomType="hover"
                                        zoomPreload
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* ================= PRODUCT INFO (UNCHANGED) ================= */}
                <div className="w-[45%] px-4 pr-10 text-black flex items-center">
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>⭐ {product.rating || 0}/5</span>
                            <span className="cursor-pointer">Review (0)</span>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-red-600 text-xl font-bold">
                                ₹{product.price}
                            </span>
                            <span className="text-green-600 font-semibold">
                                {product.quantityInStock} in stock
                            </span>
                        </div>

                        <p className="mt-4 text-gray-700">
                            {product.shortDescription}
                        </p>

                        <p className="flex items-center gap-2 mt-5">
                            <LiaShippingFastSolid /> Free Shipping (2–3 Days)
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 py-4">
                            <div className="w-20 relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    className="w-full h-10 pl-3 border rounded text-center"
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val > 0) setQuantity(val);
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex flex-col border-l">
                                    <button
                                        className="h-5 px-2 border-b"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                    >
                                        <IoChevronUp />
                                    </button>
                                    <button
                                        className="h-5 px-2"
                                        onClick={() =>
                                            setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                                        }
                                    >
                                        <IoChevronDown />
                                    </button>
                                </div>
                            </div>

                            <button className="bg-red-500 text-white px-6 py-2 rounded" onClick={() => addToCart(product._id, quantity)}>
                                Add to Cart
                            </button>
                        </div>

                        {/* ✅ Wishlist */}
                        <div className="flex gap-4 mt-2">
                            <button
                                className={`flex items-center gap-2 ${wishlist.includes(product._id) ? "text-red-500" : "text-gray-600"}`}
                                onClick={() => toggleWishlist(product._id)}
                            >
                                <FaRegHeart /> Wishlist
                            </button>

                            <button className="flex items-center gap-2">
                                <GoGitCompare /> Compare
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProductDetails2;
