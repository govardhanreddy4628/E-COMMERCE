import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './hero2.css'
import BlogSection from './BlogSection';
import CategorySwiper from './categorySwiper';
import CategoryTabs from './categoryTabs';
import ProductsSlider from './productsSlider';
import HomeSlider from './homeSlider';
import SecondarySlider from './secondarySlider';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom'
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";




import 'swiper/css';
import 'swiper/css/navigation';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Hero2 = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleIncrease = () => {};
    const handleDecrease = () => {};

    const handleSizeButtonChange = (idx) =>{}

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

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


    const product = {
        title: 'Wireless Noise Cancelling Headphones',
        image: 'https://th.bing.com/th/id/OIP.OctJq06i6wIxTXsGBFIx9AHaHa?w=177&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        price: 199.99,
        rating: 4.5,
        description:
            'Experience immersive sound with our wireless noise cancelling headphones. With up to 30 hours of battery life and superior comfort, it’s perfect for work or travel.',
    };
    return (
        <>
            <HomeSlider />
            <CategorySwiper />
            <CategoryTabs />

            <section className='bg-white w-full pb-4 dark:bg-gray-900'>

                <SecondarySlider />

                <section className='py-5'>
                    <div className='container p-5 px-24 mx-auto'>
                        <div className='border-[2px] border-red-400 dark:border-gray-600 rounded-md p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800'>
                            <div className='flex items-center justify-center gap-2'>
                                <LocalShippingOutlinedIcon className='!font-thin !text-[35px] text-[rgba(0,0,0,0.8)] md:!text-[40px] dark:text-white' />
                                <h1 className='text-[20px] text-[rgba(0,0,0,0.8)] !md:text-[25px] dark:text-white'>FREE SHIPPING</h1>
                            </div>
                            <p className='text-[16px] text-[rgba(0,0,0,0.8)] dark:text-white'>Free Delivery Now On Your First Order and over $200</p>
                            <h1 className='font-bold text-[30px] text-[rgba(0,0,0,0.8)] dark:text-white'>- Only $200*</h1>
                        </div>
                    </div>

                </section>

                <section className="w-[95%] mx-auto mt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                            "https://serviceapi.spicezgold.com/download/1741663408792_1737020756772_New_Project_1.png",
                            "https://serviceapi.spicezgold.com/download/1741664496923_1737020250515_New_Project_47.jpg",
                            "https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg",
                        ].map((src, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg">
                                <img
                                    src={src}
                                    className="transition-transform duration-300 ease-in-out hover:scale-105 w-full h-full object-cover"
                                    alt={`Banner ${idx + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <ProductsSlider handleClickOpen={handleClickOpen} />

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


                <ProductsSlider handleClickOpen={handleClickOpen} />
                <ProductsSlider handleClickOpen={handleClickOpen} />
                <ProductsSlider handleClickOpen={handleClickOpen} />
                <ProductsSlider handleClickOpen={handleClickOpen} />

                <BlogSection />

            </section >




            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
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
                    <section className="max-w-9xl  bg-white rounded-lg py-6">               {/*changed*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 mx-auto">

                            <div className='flex items-center gap-2 pl-2'>
                                <div className='col1.1 w-24 h-[446px]'>                   {/*changed*/}
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        direction='vertical'
                                        navigation={true}
                                        spaceBetween={15}
                                        slidesPerView="auto"
                                        freeMode={true}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="verticalSwiper h-full select-none"
                                    >
                                        {imageUrls.map((src, index) => (
                                            <SwiperSlide
                                                key={index}
                                                className="rounded-md overflow-hidden w-full !h-[60px] cursor-pointer group"    //changed width
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Slide ${index + 1}`}
                                                    className="w-full h-full object-cover transition-all group-hover:scale-105 "
                                                />
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>
                                </div>


                                <div className='col12 w-[68%] h-[93%] flex items-center justify-center ml-4'>                   {/*changed*/}
                                    <Swiper
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        navigation={true}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Thumbs, Navigation]}
                                        className="mySwiper2 overflow-x-hidden rounded-lg w-full h-full select-none"
                                    >
                                        {imageUrls2.map((src) => (
                                            <>
                                                {/* <SwiperSlide className='rounded-lg overflow-hidden' key={src}>
                                    < InnerImageZoom
                                        src={src}
                                        zoomType="hover"
                                        zoomPreload={true}
                                        className="w-full h-full object-contain"
                                    />
                                </SwiperSlide> */}

                                                <SwiperSlide key={src} className="!flex items-center justify-center ">
                                                    <InnerImageZoom
                                                        src={src}
                                                        zoomType="hover"
                                                        zoomPreload={true}
                                                        className="object-contain w-full h-full align-middle"
                                                        alt="Primary product image"
                                                        onError={(e) => { e.currentTarget.src = 'https://i5.walmartimages.com/asr/d37e7bbd-6700-46a…ad.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF' }}
                                                    />

                                                </SwiperSlide>

                                            </>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>


                            {/* Product Info */}
                            {/* <div className='flex items-center justify-center mr-auto pr-4'>
                                <div className="flex flex-col justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                            {product.title}
                                        </h1>
                                        <div className='flex gap-4 items-center'>
                                            <p className="text-xl text-gray-400 font-bold line-through">${product.price.toFixed(2)}</p>
                                            <p className="text-xl text-red-400 font-bold">${product.price.toFixed(2)}</p>
                                            <p className='text-md text-gray-600 ml-5 pb-1'>Available in Stock: <span className='text-lg text-green-500 font-bold'>8085 Items</span></p>
                                        </div>
                                        <div className="flex items-center my-5">
                                            <div className="text-yellow-400">
                                                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-2">({product.rating} / 5)</span>
                                            <p className='text-gray-900 ml-10'>Reviews(10)</p>
                                        </div>
                                        <p className="text-gray-700">{product.description}</p>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <span className="text-xl text-gray-700">SIZES: </span>
                                        <div className='flex gap-2'>
                                            <Button variant='outlined' onClick={() => setSelectedSize("s")} className={selectedSize === "s" ? "!text-red-500 !min-w-0" : ""}>S</Button>
                                            <Button variant='outlined' onClick={() => setSelectedSize("s")} className={selectedSize === "m" ? "!text-red-500 !min-w-0" : ""}>M</Button>
                                            <Button variant='outlined' onClick={() => setSelectedSize("s")} className={selectedSize === "l" ? "!text-red-500 !min-w-0" : ""}>L</Button>

                                        </div>
                                    </div>
                                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200 md:max-w-64 w-full self-center">
                                        Add to Cart
                                    </button>
                                    <Button className='flex !w-[180px] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 gap-3 !my-2 hover:!text-white hover:!bg-black hover:!border-black'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                </div>
                            </div> */}


                            <div className="product-content w-full lg:w-[90%] px-4 lg:pr-10 lg:pl-4 text-black flex items-center">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-semibold mb-2">
                                        Men Comfort Cuban Collar Solid Polycotton Casual Shirt
                                    </h1>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-gray-600">
                                        <span>Brand: <strong className="text-black">Campus Sutra</strong></span>
                                        <div className="flex items-center text-yellow-500" aria-label="Rating: 5 out of 5">
                                            <div className="text-yellow-400 text-[16px]">
                                                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-2">({product.rating} / 5)</span>
                                        </div>
                                        <span className=" cursor-pointer text-gray-600">Review (10)</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 line-through text-lg">₹1850</span>
                                            <span className="text-red-600 text-lg font-bold">₹2200</span>
                                        </div>
                                        <div>
                                            <span>In Stock: <span className="text-green-600 font-bold">8518 Items</span></span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-700">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard since the 1500s, when an unknown printer scrambled type to make a specimen book.
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
                                            <input type="number" className="w-full h-10 pl-3  border rounded focus:outline-none" defaultValue={1} min={1} />
                                            <div className="absolute inset-y-0 right-0 flex flex-col justify-between">
                                                <button type="button" className="h-5 text-xs text-gray-600 hover:text-black px-2 hover:bg-gray-200 rounded-sm animate-pulse" onClick={handleIncrease}><IoChevronUp className='hover:scale-110 hover:font-bold' /></button>
                                                <button type="button" className="h-5 text-xs text-gray-600 hover:text-black px-2 hover:bg-gray-200 rounded-sm" onClick={handleDecrease}><IoChevronDown className='hover:scale-110 hover:font-bold' /></button>
                                            </div>
                                        </div>

                                        <button className="flex items-center gap-2 bg-red-500 text-white hover:bg-black px-6 py-2 rounded transition-all">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L20.88 4H5.21l-.94-2H1v2h2l3.6 7.59L5.27 14.6c-.48.89.17 1.9 1.15 1.9z" /></svg>
                                            Add to Cart
                                        </button>
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
                </DialogContent>

            </BootstrapDialog>

        </>
    )
}

export default Hero2;
