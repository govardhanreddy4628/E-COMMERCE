import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@mui/material';
import { useState } from 'react';


const MyImageFallback = () => (
    <div className="flex items-center justify-center w-full h-64 bg-gray-200 text-gray-500">
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
    if (error) {return FallbackComponent ? <FallbackComponent /> : null;}

    return (
        <img src={src} alt={alt} onError={() => setError(true)} {...props}/>
    );
};

const SecondarySlider = () => {
  return (
    <section className='py-6'>
                    <div className='flex lg:flex-row flex-col w-[95%] mx-auto gap-4 items-center'>

                        <div className='col1 w-full lg:w-[67%] '>
                            <Swiper navigation={true} modules={[Navigation, Pagination, Keyboard]} className="sliderMini flex items-center justify-center rounded-lg " spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                                keyboard={true} loop={true} autoplay={{ delay: 1500, disableOnInteraction: false }} >
                                <SwiperSlide >
                                    <div className='relative w-full h-full overflow-hidden rounded-lg '>
                                        <img src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg" className='object-cover' />
                                        <div className='info -right-[100%] w-[50%] h-full absolute z-100 top-0 flex flex-col items-start justify-center gap-4 p-4 duration-700 transition-all opacity-0'>
                                            <h3 className='text-[18px] font-[400] text-[rgba(0,0,0,0.8)]'>Big Saving Days Sale</h3>
                                            <h1 className='capitalize text-[28px] font-[600] text-[rgba(0,0,0,0.8)]'>buy new trend women black cotton</h1>
                                            <div className='flex items-center gap-4'><h3 className='text-[22px] font-normal pb-2 text-[rgba(0,0,0,0.8)]'>Starting At Only</h3><span className='text-[34px] text-red-400 font-bold'>₹1550.00</span></div>
                                            <Button variant='contained' className='!text-white !bg-red-400 !px-8'>Shop Now</Button>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide >
                                    <div className='relative w-full h-full overflow-hidden rounded-lg '>
                                        <img src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" className='object-cover' />
                                        <div className='info -right-[100%] w-[50%] h-full absolute z-100 top-0 flex flex-col items-start justify-center gap-4 p-4 duration-700 transition-all opacity-0'>
                                            <h3 className='text-[18px] font-[400] text-[rgba(0,0,0,0.8)]'>Big Saving Days Sale</h3>
                                            <h1 className='capitalize text-[28px] font-[600] text-[rgba(0,0,0,0.8)]'>buy new trend women black cotton</h1>
                                            <div className='flex items-center gap-4'><h3 className='text-[22px] font-normal pb-2 text-[rgba(0,0,0,0.8)]'>Starting At Only</h3><span className='text-[34px] text-red-400 font-bold'>₹1550.00</span></div>
                                            <Button variant='contained' className='!text-white !bg-red-400 !px-8'>Shop Now</Button>
                                        </div>
                                    </div>
                                </SwiperSlide>

                            </Swiper>
                        </div>

                        <div className='col2 w-full lg:w-[33%] flex lg:flex-col  gap-4'>
                            <div className='group'>
                                <SafeImage src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" alt="my image" fallback={MyImageFallback} className='w-full object-cover rounded-lg transition-all duration-150 group-hover:scale-105' />
                            </div>
                            <div className='group'>
                                <SafeImage src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg" alt="my image" fallback={MyImageFallback} className='w-full object-cover rounded-lg transition-all duration-150 group-hover:scale-105' />
                            </div>
                        </div>
                    </div>
                </section>
  )
}

export default SecondarySlider
