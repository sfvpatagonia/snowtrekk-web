import { Link, NavLink } from "react-router-dom";
import placeholder from "@/assets/logoST.png";

export default function PlaceCard({ place, changeVideo }) {
  const handleChangeVideo = () => {
    if (changeVideo) changeVideo(place.id);
  };

  return (
    <Link
      className="group flex flex-col gap-2 min-h-min rounded-lg bg-main-100 shadow cursor-pointer 
      dark:bg-main-900 dark:shadow-main-0/50 overflow-hidden
      w-[200px] lg:w-full flex-shrink-0 transition-all
      border border-main-100 dark:border-main-950 hover:border-green-700"
      onClick={changeVideo ? handleChangeVideo : null}
      to={!changeVideo && `/destination/${place.id}`}
    >
      <div
        className="relative overflow-hidden rounded-t-lg border-b-2 border-main-400 
                   transition-all duration-300 ease-in-out group-hover:border-green-700"
      >
        <img
          src={place.Images[0]?.url || placeholder}
          alt={place.name}
          className={`w-full aspect-video ${
            place.Images[0]?.url ? "object-cover" : "object-contain"
          } transition-transform duration-300 ease-in-out group-hover:scale-120`}
        />
      </div>

      <h3 className="text-main-400 font-bold text-lg py-1 px-2 truncate portrait:text-sm group-hover:text-green-700 transition-colors duration-300 ease-in-out">
        {place.name}
      </h3>
    </Link>
  );
}
