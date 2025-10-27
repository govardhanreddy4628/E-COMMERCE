import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@mui/material';
import { useState } from 'react';
import "./secondarySlider.css"


const MyImageFallback = () => (
    <div className="flex items-center justify-center w-full h-56 bg-gray-200 text-gray-500 rounded-lg">
        Image not available
    </div>
);

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: React.ComponentType;
}

const SafeImage = ({ src, alt, fallback: FallbackComponent, ...props }: SafeImageProps) => {
    const [error, setError] = useState(false);
    if (error) { return FallbackComponent ? <FallbackComponent /> : null; }

    return (
        <img src={src} alt={alt} onError={() => setError(true)} {...props} />
    );
};

const SecondarySlider = () => {
    
    return (
        <section className='py-2'>
            <div className='flex lg:flex-row flex-col w-[95%] mx-auto gap-4 items-center'>

                <div className='col1 w-full lg:w-[67%] '>
                    <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard]} className="sliderMini flex items-center justify-center rounded-lg " spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                        keyboard={true} loop={true} autoplay={{ delay: 1500, disableOnInteraction: false }} >
                        <SwiperSlide >
                            <div className='relative w-full h-full overflow-hidden rounded-lg '>
                                <img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" className='object-cover' />
                                <div className='info -right-[100%] w-[50%] h-[100%] absolute z-100 top-0 flex flex-col items-start justify-center gap-4 p-4 duration-700 transition-all opacity-0'>
                                    <h3 className='text-[18px] font-[400] text-[rgba(0,0,0,0.8)] text-left relative -right-[100%] opacity-0'>Big Saving Days Sale</h3>
                                    <h1 className='capitalize text-[28px] font-[600] text-[rgba(0,0,0,0.8)]  relative -right-[100%] opacity-0'>Apple iPhone 17 256 GB, Pink</h1>
                                    <div className='flex items-center gap-4 relative -right-[100%] opacity-0'><h3 className='text-[22px] font-normal pb-2 text-[rgba(0,0,0,0.8)] '>Starting At Only</h3><span className='text-[34px] text-red-400 font-bold'>₹1,25,500.00</span></div>
                                    <Button variant='contained' className='!text-white !bg-red-500 !px-8 relative -right-[100%] opacity-0'>Shop Now</Button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='relative w-full h-full overflow-hidden rounded-lg '>
                                <img src="https://serviceapi.spicezgold.com/download/1756273096312_1737036773579_sample-1.jpg" className='object-cover' />
                                <div className='info -right-[100%] w-[50%] h-[100%] absolute z-100 top-0 flex flex-col items-start justify-center gap-4 p-4 duration-700 transition-all opacity-0'>
                                    <h3 className='text-[18px] font-[400] text-[rgba(0,0,0,0.8)] text-left relative -right-[100%] opacity-0'>Big Saving Days Sale</h3>
                                    <h1 className='capitalize text-[28px] font-[600] text-[rgba(0,0,0,0.8)]  relative -right-[100%] opacity-0'>buy new trend women black cotton Blend Top...</h1>
                                    <div className='flex items-center gap-4 relative -right-[100%] opacity-0'><h3 className='text-[22px] font-normal pb-2 text-[rgba(0,0,0,0.8)] '>Starting At Only</h3><span className='text-[34px] text-red-400 font-bold'>₹1,550.00</span></div>
                                    <Button variant='contained' className='!text-white !bg-red-600 !px-8 relative -right-[100%] opacity-0'>Shop Now</Button>
                                </div>
                            </div>
                        </SwiperSlide>

                    </Swiper>
                </div>

                <div className='col2 w-full lg:w-[33%] flex lg:flex-col gap-4 '>
                    <div className='group h-56 w-full !overflow-hidden relative'>
                        <SafeImage src="https://serviceapi.spicezgold.com/download/1741663408792_1737020756772_New_Project_1.png" alt="my image" fallback={MyImageFallback} className='w-full h-full object-fit rounded-lg transition-all duration-150 group-hover:scale-105' />
                        <div className='w-[50%] absolute top-0 left-0 h-full flex flex-col items-start justify-center gap-2 p-4 bg-transparent backdrop-blur-sm rounded-lg'>
                            <h3 className='font-bold text-ellipsis overflow-hidden text-[22px] break-words'>Buy men's bags at lowest price</h3>
                            <h3 className='text-red-500 text-[22px] font-bold'>₹800</h3>
                            <button
                                className="bg-transparent text-[22px] font-bold border py-1 px-2 border-red-500 border-b-4 
                              text-red-500 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    <div className='group h-56 w-full !overflow-hidden relative'>
                        <SafeImage src="https://serviceapi.spicezgold.com/download/1760160666204_1737020916820_New_Project_52.jpg" alt="my image" fallback={MyImageFallback} className='w-full h-full object-fit rounded-lg transition-all duration-150 group-hover:scale-105' />
                        <div className='w-[50%] absolute top-0 right-0 h-full flex flex-col items-end justify-center gap-2 p-4 bg-transparent backdrop-blur-sm rounded-lg'>
                            <h3 className='font-bold text-ellipsis overflow-hidden text-[22px] break-words'>Buy women wear at lowest price</h3>
                            <h3 className='text-red-500 text-[22px] font-bold'>₹900</h3>
                            <button
                                className="bg-transparent text-[22px] font-bold border py-1 px-2 border-red-500 border-b-4 
                              text-red-500 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default SecondarySlider
