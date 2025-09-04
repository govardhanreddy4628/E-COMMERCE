import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

const swiperData = [
    {
        image: "https://serviceapi.spicezgold.com/download/1748409729550_fash.png",
        title: "fashion",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741660988059_ele.png",
        title: "electronics",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661045887_bag.png",
        title: "bags",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661061379_foot.png",
        title: "footware",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661077633_gro.png",
        title: "groceries",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661092792_beauty.png",
        title: "beauty",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1741661105893_well.png",
        title: "wellness",
    },
    {
        image: "https://serviceapi.spicezgold.com/download/1749273446706_jw.png",
        title: "jewellery",
    },
];

export default function CategorySwiper() {
  return (
    <section className='categorySwiper py-10 dark:bg-black'>
                <div className='w-[95%] mx-auto max-w-9xl'>
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={10}
                        navigation
                        modules={[Navigation]}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            480: { slidesPerView: 3 },
                            640: { slidesPerView: 4 },
                            768: { slidesPerView: 5 },
                            1024: { slidesPerView: 6 },
                            1280: { slidesPerView: 8 },
                        }}
                        className="mySwiper"
                    >
                        {swiperData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300">
                                     <Link to="/" className="flex flex-col items-center justify-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <h3 className="text-sm font-medium text-gray-800 dark:text-white text-center capitalize">
                                            {item.title}
                                        </h3>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section> 
  );
}
