import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';


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

const Hero2 = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <>
            <section>
                <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard]} className="mySwiper w-[95%] h-[60vh] flex items-center justify-center mt-4 rounded-lg" spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                    keyboard={true} loop={true} autoplay={{ delay: 500, disableOnInteraction: false }}>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/209193345/original/caa1df99cf3efa637a0821b8fb22001bcd553201/design-facebook-cover-or-banner-photo.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Professional-E-Commerce-Shoes-Banner-Design.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                    <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1745503990603_NewProject(13).jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                </Swiper>
            </section>

            <section className='w-[95%] mx-auto flex items-center justify-between p-4 mt-4'>

                <div className='w-[30%] flex flex-col justify-start'>
                    <h1 className='text-[24px] font-bold'>Popular Products</h1>
                    <p className='text-[14px] '>Do not miss the current offers until the end of March.</p>
                </div>

                <div className='w-[70%] flex justify-end'>
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
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

            <section className='bg-white w-full pb-4'>
                <div className='flex items-center justify-between w-[95%] h-[70vh] mx-auto gap-4'>
                    <div className='col1 w-[65%] '>
                        <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard]} className="mySwiper h-[65vh] flex items-center justify-center mt-4 rounded-lg" spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                            keyboard={true} loop={true} autoplay={{ delay: 1500, disableOnInteraction: false }}>
                            <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                            <SwiperSlide><img src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='w-full h-full object-cover rounded-lg' /></SwiperSlide>
                        </Swiper>
                    </div>
                    <div className='col2 w-[35%] flex flex-col gap-4 h-[63vh] mt-4 mb-4'>
                        <img src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='w-full h-[50%] object-cover rounded-lg' />
                        <img src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='w-full h-[50%] object-cover rounded-lg' />
                    </div>
                </div>

            </section>
        </>
    )
}

export default Hero2;
