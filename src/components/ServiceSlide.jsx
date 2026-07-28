import { useRef } from "react";
import ServiceCard from "./ServiceCard";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function ServiceSlide({ services }) {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center w-full px-2  bg-main-100 dark:bg-main-900">
      <>
        <button
          onClick={scrollLeft}
          className="absolute flex items-center justify-center -left-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer rounded-full z-20 bg-main-100 dark:bg-main-900 dark:hover:bg-green-700 hover:bg-green-600 duration-200 p-4 border border-main-50 dark:border-main-950"
        >
          <ChevronLeftIcon
            classes={{ root: "text-main-0 dark:text-main-1000" }}
          />
        </button>
        <div className="flex gap-4 overflow-x-auto py-2 px-1 " ref={sliderRef}>
          {services.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute flex items-center justify-center -right-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer rounded-full z-20 bg-main-100 dark:bg-main-900 dark:hover:bg-green-700 hover:bg-green-600 duration-200 p-4 border-main-50 dark:border-main-950 border"
        >
          <ChevronRightIcon
            classes={{ root: "text-main-0 dark:text-main-1000" }}
          />
        </button>
      </>
    </div>
  );
}
