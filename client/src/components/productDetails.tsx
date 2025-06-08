import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom'

import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';


const ProductDetails = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    const imageUrls = [
        'https://swiperjs.com/demos/images/nature-1.jpg',
        'https://swiperjs.com/demos/images/nature-2.jpg',
        'https://swiperjs.com/demos/images/nature-3.jpg',
        'https://swiperjs.com/demos/images/nature-4.jpg',
        'https://swiperjs.com/demos/images/nature-5.jpg',
        'https://swiperjs.com/demos/images/nature-2.jpg',
        'https://swiperjs.com/demos/images/nature-1.jpg',
    ];

    return (
        <div className='flex w-[95%] mx-auto h-[100vh]'>
            <div className='col1 w-[45%] h-[75%] flex items-center justify-center relative gap-2 rounded-lg'>


                <div className='col1.1 w-[100px] h-[500px]'>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        direction='vertical'
                        navigation={true}
                        spaceBetween={15}
                        slidesPerView="auto"
                        freeMode={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="verticalSwiper h-full"
                    >
                        {imageUrls.map((src, index) => (
                            <SwiperSlide
                                key={index}
                                className="rounded-md overflow-hidden !w-full !h-[80px] cursor-pointer group"
                            >
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover transition-all group-hover:scale-105"
                                />
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>


                <div className='col1.2 w-[80%] h-[96%] flex items-center justify-center p-3'>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={false}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Thumbs]}
                        className="mySwiper2 w-full h-[500px.] overflow-hidden rounded-lg"
                    >
                        {imageUrls.map((src) => (
                            <>
                                {/* <SwiperSlide className='rounded-lg overflow-hidden' key={src}>
                                    < InnerImageZoom
                                        src={src}
                                        zoomType="hover"
                                        zoomPreload={true}
                                        className="w-full h-full object-contain"
                                    />
                                </SwiperSlide> */}

                                <SwiperSlide key={src} className="flex items-center justify-center h-full">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <InnerImageZoom
                                            src={src}
                                            zoomType="hover"
                                            zoomPreload={true}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </SwiperSlide>

                            </>
                        ))}


                    </Swiper>
                </div>

            </div>
            <div className='productdetails w-[55%] p-8'>
                <div>
                    <h1>Men Pure Cotton Striped Casual Shirt</h1>
                    <div>
                        <p></p>
                        <div></div>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails


