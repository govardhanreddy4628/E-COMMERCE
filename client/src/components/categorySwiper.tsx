import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { useCategories } from "./admin/context/categoryContext";


const SKELETON_COUNT = 8;
const HIDDEN_SLUGS = ["miscellaneous"];

export default function CategorySwiper() {
  const { categories, loading } = useCategories();

  const visibleCategories = categories.filter(
    category => !HIDDEN_SLUGS.includes(category.slug)
  );

  return (
    <section className="categorySwiper py-10 bg-gray-50 dark:bg-black">
      <div className="w-[95%] mx-auto max-w-9xl">
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
        >
          {/* 🔄 Skeleton slides while loading */}
          {loading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </SwiperSlide>
            ))}

          {/* ✅ Real category slides */}
          {!loading &&
            visibleCategories.map(category => (
              <SwiperSlide key={category._id}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300">
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <img
                      src={category.image?.url ?? "/placeholder.png"}
                      alt={category.name}
                      className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-200 text-center capitalize">
                      {category.name}
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
