import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

const PlaceSlider = ({ currentDestination, gallery }) => {
  return (
    <div
      className={` flex w-full flex-col  border-b-2 border-main-400
        ${
          !currentDestination.description
            ? "flex-col-reverse "
            : gallery.length === 0
            ? ""
            : "lg:flex-row aspect-[16/7] lg:max-h-[55vh]"
        }
        `}
    >
      {gallery.length !== 0 && (
        <Swiper
          slidesPerView={1}
          autoplay
          className={
            currentDestination.description
              ? "flex overflow-x-hidden w-[70%]"
              : "flex overflow-x-hidden w-full"
          }
        >
          {gallery.map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <img
                  src={img.url}
                  alt={currentDestination.name}
                  className="w-full object-cover aspect-video h-auto "
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      <div
        className={
          gallery.length === 0 || !currentDestination.description
            ? "flex flex-col text-left p-4 gap-4 overflow-auto bg-main-50 dark:bg-main-950"
            : "flex lg:w-[30%] max-h-[30vh] lg:max-h-none flex-col text-left p-4 gap-4 overflow-auto bg-main-100 dark:bg-main-900"
        }
      >
        <h1 className="text-lg font-bold text-main-600 dark:text-main-400">
          {currentDestination &&
            currentDestination.description &&
            `About ${currentDestination.name}`}
        </h1>
        <p className="text-main-0 dark:text-main-1000">
          {currentDestination && currentDestination.description}
        </p>
      </div>
    </div>
  );
};

export default PlaceSlider;
