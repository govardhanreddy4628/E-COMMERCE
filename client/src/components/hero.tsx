import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './hero.css'
import BlogSection from './BlogSection';
import CategorySwiper from './categorySwiper';
import CategoryTabs from './categoryTabs';
import HomeSlider from './homeSlider';
import SecondarySlider from './secondarySlider';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom'
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import 'swiper/css';
import 'swiper/css/navigation';
import ProductsSlider from './productsSlider';
import { getCloudinaryImage } from '../utils/imgTransformation';
import { toast } from "react-hot-toast"; // or your toast lib
import { useCart } from '../context/cartContext';

interface Product {
    _id: string;
    name: string;
    shortDescription: string;
    description?: string;
    brand: string;
    finalPrice: number;
    listedPrice: number;
    discountPercentage: number;
    rating: number;
    images: { url: string }[];
    stock?: number;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Hero = () => {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [addedQty, setAddedQty] = useState<number | null>(null);

    const { addToCart } = useCart();

    const handleClickOpen = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setCartSuccess(false);
        setAddedQty(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setThumbsSwiper(null);
        setAddedQty(null);
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleSizeButtonChange = (idx) => { }

    const handleAddToCartDialog = async () => {
        if (!selectedProduct) return;

        try {
            setAddingToCart(true);

            await addToCart(selectedProduct, quantity);

            setAddedQty(quantity);
            setCartSuccess(true);
            toast.success("Added to cart");
        } catch (err) {
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };


    useEffect(() => {
        if (!open) {
            setSelectedProduct(null);
            setThumbsSwiper(null);
        }
    }, [open]);


    useEffect(() => {
        if (addedQty !== null) {
            setAddedQty(quantity);
        }
    }, [quantity, addedQty]);


    const imageUrls = [
        'https://swiperjs.com/demos/images/nature-1.jpg',
        'https://swiperjs.com/demos/images/nature-2.jpg',
        'https://swiperjs.com/demos/images/nature-3.jpg',
        'https://swiperjs.com/demos/images/nature-4.jpg',
        'https://swiperjs.com/demos/images/nature-5.jpg',
        'https://i5.walmartimages.com/asr/d37e7bbd-6700-46ac-9cd2-16bc8ff44dba.12b21c89aed89236c82f2e95fb6355ad.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF',
        'https://i5.walmartimages.com/seo/VIZIO-50-Class-4K-UHD-LED-HDR-Smart-TV-New-V4K50M-08_5f0d49fd-372f-41f3-96d9-f0566f682c44.6e5a7abe265b6a0764ab4ceade89d476.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'
    ];
    const imageUrls2 = [
        'https://swiperjs.com/demos/images/nature-1.jpg',
        'https://swiperjs.com/demos/images/nature-2.jpg',
        'https://swiperjs.com/demos/images/nature-3.jpg',
        'https://swiperjs.com/demos/images/nature-4.jpg',
        'https://swiperjs.com/demos/images/nature-5.jpg',
        'https://i5.walmartimages.com/asr/d37e7bbd-6700-46ac-9cd2-16bc8ff44dba.12b21c89aed89236c82f2e95fb6355ad.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF',
        'https://i5.walmartimages.com/seo/VIZIO-50-Class-4K-UHD-LED-HDR-Smart-TV-New-V4K50M-08_5f0d49fd-372f-41f3-96d9-f0566f682c44.6e5a7abe265b6a0764ab4ceade89d476.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'
    ];

    const images = Array.isArray(selectedProduct?.images)
        ? selectedProduct.images
        : [];

    return (
        <>
            <HomeSlider />
            <CategorySwiper />
            <CategoryTabs handleClickOpen={handleClickOpen} />

            <section className='bg-white w-full pb-4 dark:bg-gray-900'>

                <SecondarySlider />
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Top Rated Products" />

                {/* SHIPPING BANNER */}
                <section className="container p-5 mx-auto px-6 md:px-24">
                    <div className="border-[2px] border-red-400 dark:border-gray-600 p-6 flex flex-col md:flex-row items-center justify-between gap-4 
                  bg-gradient-to-r from-gray-300 via-gray-100 to-white 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-700   relative rounded-xl md:p-8 
                  shadow-lg shadow-gray-300/40 dark:shadow-black/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3">
                            <LocalShippingOutlinedIcon className="!font-thin !text-[36px] md:!text-[42px] text-gray-600 dark:text-white drop-shadow-sm" />
                            <h1 className="text-[22px] md:text-[26px] font-semibold text-gray-600 dark:text-white tracking-wide">
                                FREE SHIPPING
                            </h1>
                        </div>
                        <p className="text-[16px] md:text-[17px] text-[rgba(0,0,0,0.8)] dark:text-white text-gray-700 dark:text-gray-200 text-center md:text-left max-w-[320px]">
                            Free Delivery Now On Your First Order and over ₹400
                        </p>
                        <h1 className="font-extrabold text-[28px] md:text-[32px] text-gray-700 dark:text-white tracking-tight">
                            - Only ₹400*
                        </h1>
                        {/* Optional subtle highlight overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none"></div>
                    </div>
                </section>


                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Top Rated Products" />

                <section className="w-[95%] mx-auto mt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {[
                            "https://serviceapi.spicezgold.com/download/1741669012402_banner1.webp",
                            "https://serviceapi.spicezgold.com/download/1741669037986_banner2.webp",
                            "https://serviceapi.spicezgold.com/download/1741669057847_banner5.webp",
                            "https://serviceapi.spicezgold.com/download/1742453755529_1741669087880_banner6.webp",
                        ].map((src, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg">
                                <img
                                    src={src}
                                    className="transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1 w-full h-full object-cover"
                                    alt={`Banner ${idx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </section>
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Top Rated Products" />

                <section className="w-[95%] mx-auto mt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                            "https://rukminim1.flixcart.com/fk-p-flap/1040/560/image/2e5c9cfcf2dc8e71.jpg?q=60",
                            "https://rukminim1.flixcart.com/fk-p-flap/1040/560/image/c5d0453a8ad30643.jpg?q=60",
                            "https://rukminim1.flixcart.com/fk-p-flap/1040/560/image/4b01f2e6361d46c4.png?q=60",
                            "https://rukminim1.flixcart.com/fk-p-flap/1040/560/image/c03b479f4ce13271.jpg?q=60",
                            "https://rukminim1.flixcart.com/fk-p-flap/1040/560/image/58d6d6db07978e56.jpg?q=60",
                            "https://rukminim2.flixcart.com/fk-p-flap/1040/560/image/c0381ba1a743d06f.jpg?q=60",
                        ].map((src, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg">
                                <img
                                    src={src}
                                    className="transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1 w-full h-full object-cover"
                                    alt={`Banner ${idx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </section>


                <ProductsSlider handleClickOpen={handleClickOpen} headerName="New Arrivals" />
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Best Selling Products" />
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Featured Products" />
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Limited Edition" />
                <ProductsSlider handleClickOpen={handleClickOpen} headerName="Recently Viewed Products" />

                <BlogSection />
            </section >

{/* DIALOG */}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                disableScrollLock
                open={open}
                PaperProps={{
                    sx: {
                        width: 1250,
                        maxWidth: '100%', // optional: keep it responsive
                    },
                }}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    {selectedProduct && (
                        <section className="max-w-9xl  bg-white rounded-lg py-6">               {/*changed*/}
                            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto">
                                <div className='flex items-center gap-2 pl-2'>
                                    <div className='col1.1 w-24 h-[446px]'>                   {/*changed*/}
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            direction='vertical'
                                            navigation={images.length > 1}
                                            spaceBetween={15}
                                            slidesPerView="auto"
                                            freeMode={true}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="verticalSwiper h-full select-none"
                                        >
                                            {images.map((img, index) => (
                                                <SwiperSlide
                                                    key={index}
                                                    className="rounded-md overflow-hidden w-full !h-[60px] cursor-pointer group"    //changed width
                                                >
                                                    <img
                                                        src={getCloudinaryImage(img.url, {
                                                            width: 100,
                                                            height: 100,
                                                        })}
                                                        alt={`Slide ${index + 1}`}
                                                        className="w-full h-full object-contain transition-all group-hover:scale-105 "
                                                    />
                                                </SwiperSlide>
                                            ))}

                                        </Swiper>
                                    </div>


                                    <div className='col12 w-[68%] h-[93%] flex items-center justify-center ml-4'>                   {/*changed*/}
                                        <Swiper
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation={images.length > 1}
                                            thumbs={{
                                                swiper: thumbsSwiper && !thumbsSwiper.destroyed
                                                    ? thumbsSwiper
                                                    : null
                                            }}
                                            modules={[FreeMode, Thumbs, Navigation]}
                                            className="mySwiper2 overflow-x-hidden rounded-lg w-full h-full select-none"
                                        >
                                            {images.map((img) => (
                                                <SwiperSlide key={img.url} className="!flex items-center justify-center ">
                                                    <InnerImageZoom
                                                        src={img.url}
                                                        zoomType="hover"
                                                        zoomPreload={true}
                                                        className="object-contain w-full h-full align-middle"
                                                        alt="Primary product image"
                                                        onError={(e) => { e.currentTarget.src = 'https://i5.walmartimages.com/asr/d37e7bbd-6700-46a…ad.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF' }}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>


                                {/* Product Info */}
                                <div className="product-content w-full lg:w-[90%] px-4 lg:pr-10 lg:pl-4 text-black flex items-center">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-semibold mb-2">
                                            {selectedProduct?.name}
                                        </h1>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-gray-600">
                                            <span>Brand: <strong className="text-black">{selectedProduct?.brand}</strong></span>
                                            <div className="flex items-center text-yellow-500" aria-label="Rating: 5 out of 5">
                                                <div className="text-yellow-400 text-[16px]">
                                                    {'★'.repeat(Math.floor(selectedProduct?.rating || 0))}{'☆'.repeat(5 - Math.floor(selectedProduct?.rating || 0))}
                                                </div>
                                                <span className="text-sm text-gray-500 ml-2">({selectedProduct?.rating} / 5)</span>
                                            </div>
                                            <span className=" cursor-pointer text-gray-600">Review (10)</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 line-through text-lg">₹{selectedProduct?.listedPrice}</span>
                                                <span className="text-red-600 text-lg font-bold">₹{selectedProduct?.finalPrice}</span>
                                            </div>
                                            <div>
                                                <span>In Stock: <span className="text-green-600 font-bold">{selectedProduct?.stock || 0} Items</span></span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-gray-700">
                                            {selectedProduct?.shortDescription || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard since the 1500s, when an unknown printer scrambled type to make a specimen book."}
                                        </p>
                                        <div className="flex items-center gap-4 mt-5">
                                            <span className="text-base font-medium">Size:</span>
                                            <div className="flex gap-2">{
                                                ["S", "M", "L"].map((button, idx) => (
                                                    <button key={button} className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => handleSizeButtonChange(idx)}>{button}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-md text-gray-800 mt-5 mb-2 flex items-center gap-2">
                                            <LiaShippingFastSolid className='text-lg' /> <span>Free Shipping (Est. Delivery: 2-3 Days)</span>
                                        </p>
                                        <div className="flex items-center gap-4 py-4">
                                            <div className="w-20 relative">
                                                <input type="number" className="w-full h-10 pl-3  border rounded focus:outline-none" value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    min={1} />
                                                <div className="absolute inset-y-0 right-0 flex flex-col justify-between">
                                                    <button type="button" className="h-5 text-xs text-gray-600 hover:text-black px-2 hover:bg-gray-200 rounded-sm animate-pulse" onClick={handleIncrease}><IoChevronUp className='hover:scale-110 hover:font-bold' /></button>
                                                    <button type="button" className="h-5 text-xs text-gray-600 hover:text-black px-2 hover:bg-gray-200 rounded-sm" onClick={handleDecrease}><IoChevronDown className='hover:scale-110 hover:font-bold' /></button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleAddToCartDialog}
                                                disabled={addingToCart}
                                                className="flex items-center gap-2 bg-red-500 hover:bg-black text-white px-6 py-2 rounded transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {addingToCart ? (
                                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                                ) : addedQty !== null ? (
                                                    <>Go To Cart ({addedQty})</>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2..." />
                                                        </svg>
                                                        Add to Cart
                                                    </>
                                                )}
                                            </button>

                                            {cartSuccess && (
                                                <p className="text-green-600 text-sm mt-2 animate-fadeIn">
                                                    ✅ Added to cart successfully
                                                </p>
                                            )}

                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 mt-4 text-md font-medium">
                                            <button className="flex items-center gap-2 text-gray-700 hover:text-red-400 cursor-pointer">
                                                <FaRegHeart /> Add to Wishlist
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-700 hover:text-red-400 cursor-pointer">
                                                <GoGitCompare /> Add to Compare
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}

export default Hero;
