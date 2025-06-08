import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { IoExpand } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './hero2.css'
import { Button } from '@mui/material';


const swiperData = [
    {
        image: "https://serviceapi.spicezgold.com/download/1748409729550_fash.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741660988059_ele.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661045887_bag.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661061379_foot.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661077633_gro.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661092792_beauty.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661105893_well.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1749273446706_jw.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1748409729550_fash.png",
        title: "fashion",
    },
];



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MyImageFallback = () => (
    <div className="flex items-center justify-center w-full h-64 bg-gray-200 text-gray-500">
        Image not available
    </div>
);

const SafeImage = ({ src, alt, fallback: FallbackComponent, ...props }: any) => {
    const [error, setError] = useState(false);

    if (error) {
        return FallbackComponent ? <FallbackComponent /> : null;
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            {...props}
        />
    );
};



const Hero2 = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).onerror = null; // prevent infinite loop
        (e.target as HTMLImageElement).src = '/fallback.jpg'; // your fallback image
    }



    return (
        <>
            <section>
                <div className='w-full h-[60vh] flex items-center justify-center bg-gray-100 overflow'>
                    <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard, Autoplay]} className="mySwiper w-[95%] h-[60vh] flex items-center justify-center mt-4 rounded-lg !border-none" spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                        keyboard={true} loop={true} autoplay={{ delay: 5500, disableOnInteraction: false }}>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='object-cover w-full h-full rounded-lg' onError={(e) => { handleImageError(e) }} /></SwiperSlide>
                        <SwiperSlide><img src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/209193345/original/caa1df99cf3efa637a0821b8fb22001bcd553201/design-facebook-cover-or-banner-photo.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Professional-E-Commerce-Shoes-Banner-Design.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    </Swiper>
                </div>

            </section>


            <section className='categorySwiper pt-10 pb-6'>
                <div className='w-[95%] mx-auto'>
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Navigation]}
                        className="mySwiper"
                    >
                        {swiperData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white h-[165px] w-[165px] shadow-sm p-3 cursor-pointer group">
                                    <Link to="/" className="flex flex-col items-center justify-center gap-6">
                                        <img
                                            src={item.image}
                                            className="w-[50%] h-[50%] object-contain group-hover:scale-105 transition-all duration-300"
                                            alt={item.title}
                                        />
                                        <h3 className="text-[16px] font-[500] capitalize">{item.title}</h3>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

            </section>





            <section className='bg-white w-full pb-4'>
                <section className='w-[95%] mx-auto flex items-center justify-between p-4 mt-4'>

                    <div className='w-[30%] flex flex-col justify-start'>
                        <h1 className='text-[24px] font-bold'>Popular Products</h1>
                        <p className='text-[14px] '>Do not miss the current offers until the end of March.</p>
                    </div>

                    <div className='w-[70%] flex justify-end'>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons allowScrollButtonsMobile>
                                    <Tab label="Item One" {...a11yProps(0)} />
                                    <Tab label="Item Two" {...a11yProps(1)} />
                                    <Tab label="Item Three" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                Item One
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                Item Two
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                Item Three
                            </CustomTabPanel>
                        </Box>
                    </div>
                </section>


                <section className='categorySwiper  mt-4'>
                    <div className='w-[95%] mx-auto'>
                        <Swiper
                            // onSwiper={setSwiperRef}
                            slidesPerView={6}
                            spaceBetween={10}
                            navigation={true}
                            modules={[Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                        <Link to="/" className='w-full h-[200px] relative overflow-hidden'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                        <div className="absolute right-[10px] top-[10px] flex flex-col gap-[5px] group-hover:bg-white p-1 rounded-md transition z-50 opacity-50">
                                            <div><IoExpand /></div>
                                            <div><FaRegHeart /></div>
                                            <div><FaRegHeart /></div>
                                        </div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative'>
                                        <Link to="/" className='w-full h-[200px] relative group'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full h-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full h-full object-cover absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                        <Link to="/" className='w-full h-[200px] relative  overflow-hidden'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full h-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full h-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative'>
                                        <Link to="/" className='w-full h-[200px] relative group overflow-hidden'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full h-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full h-full object-cover absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative'>
                                        <Link to="/" className='w-full h-[200px] relative group overflow-hidden'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                                    <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative'>
                                        <Link to="/" className='w-full h-[200px] relative group overflow-hidden'>
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                            <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                        </Link>
                                        <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                    </div>

                                    <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                        <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                        <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                        <div className='flex items-center justify-between w-full p-2'>
                                            <p className='text-[18px] font-bold line-through'>$99.99</p>
                                            <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                        </div>
                                        <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                                    </div>
                                </div>
                            </SwiperSlide>

                        </Swiper>
                    </div>
                </section>


                <section>
                    <div className='flex items-center justify-between w-[95%] h-[70vh] mx-auto gap-4'>
                        <div className='col1 w-[65%] '>
                            <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard]} className="mySwiper h-[65vh] flex items-center justify-center mt-4 rounded-lg" spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                                keyboard={true} loop={true} autoplay={{ delay: 1500, disableOnInteraction: false }}>
                                <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                                <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                            </Swiper>
                        </div>
                        <div className='col2 w-[35%] flex flex-col gap-4 h-[63vh] mt-4 mb-4'>
                            <SafeImage src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" alt="my image" fallback={MyImageFallback} className='w-full h-[50%] object-cover rounded-lg' />
                            <SafeImage src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='w-full h-[50%] object-cover rounded-lg' />
                        </div>
                    </div>
                </section>


                <section>
                    <div className='container p-5 mx-auto'>
                        <div className='border-[2px] border-red-500 rounded-md p-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50'>
                            <div className='flex items-center justify-center gap-2'>
                                <LocalShippingOutlinedIcon className='!font-thin !text-[35px] text-[rgba(0,0,0,0.8)] md:!text-[40px]' />
                                <h1 className='text-[20px] text-[rgba(0,0,0,0.8)] !md:text-[25px]'>FREE SHIPPING</h1>
                            </div>
                            <p className='text-[16px] text-[rgba(0,0,0,0.8)]'>Free Delivery Now On Your First Order and over $200</p>
                            <h1 className='font-bold text-[30px] text-[rgba(0,0,0,0.8)]'>- Only $200*</h1>
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



            </section >





        </>
    )
}

export default Hero2;
