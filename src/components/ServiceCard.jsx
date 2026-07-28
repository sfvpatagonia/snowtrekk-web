import { useLayoutEffect } from "react";
import { useRef } from "react";
import { Star, StarOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ServiceCard({ item }) {
  const user = useSelector((state) => state.user);
  const titleRef = useRef(null);
  const containerTitleRef = useRef(null);

  useLayoutEffect(() => {
    const containerWidth = containerTitleRef.current.clientWidth;
    const titleWidth = titleRef.current.scrollWidth;
    if (titleWidth > containerWidth) {
      containerTitleRef.current.style.setProperty("--text-width", titleWidth);
      containerTitleRef.current.style.setProperty(
        "--container-width",
        containerWidth
      );
      //add class slide to title

      const styleSheet = document.createElement("style");
      const keyframes = `
        @keyframes slide {
          0% {
            transform: translateX(0px);
          }
          66% {
            transform: translateX(-${titleWidth}px);
          }  
          66.00001% {
            transform: translateX(${containerWidth}px);
          }
          100% {
            transform: translateX(0px);
          }
        }
      `;
      styleSheet.innerHTML = keyframes;
      document.head.appendChild(styleSheet);

      titleRef.current.classList.add("slide");
    } else {
      //remove class slide to title
      titleRef.current.classList.remove("slide");
    }
  }, []);

  const getDuration = () => {
    if (item.duration < 60) {
      return `${item.duration} min`;
    }
    return `${Math.floor(item.duration / 60)} h ${item.duration % 60} min`;
  };

  return (
    <Link
      to={`/service/${item?.id}`}
      className="flex flex-col flex-1 rounded-lg cursor-pointer min-w-68 overflow-hidden shadow bg-main-50 dark:bg-main-950 transition-shadow ease-in duration-500 hover:shadow-green-800 dark:hover:shadow-green-400"
    >
      <div className="w-full min-h-40 h-40 relative border-b-3 border-main-400">
        <img
          src={item.Images ? item.Images[0]?.url : ""}
          alt="item"
          className="w-full h-full object-cover"
        />
        <div
          className="w-full overflow-hidden bottom-0 absolute bg-gradient-to-t from-[rgba(2,0,36,1)] from-35% to-[rgba(255,212,255,0)]"
          ref={containerTitleRef}
        >
          <h4
            className="text-center max-w-full text-ellipsis pl-4 pr-1 py-1 text-sm font-bold text-main-400 whitespace-nowrap"
            ref={titleRef}
          >
            {item.name}
          </h4>
        </div>
        <div className="absolute top-0 right-0 text-sm text-main-500 hover:text-main-1000 duration-300 ease-in p-2 ">
          {Array.isArray(user.favorites) && user.favorites.includes(item.id) ? (
            <Star />
          ) : (
            <StarOutline />
          )}
        </div>
        <div className="absolute flex top-0 left-3 text-main-1000 text-sm">
          {item.isAd && (
            <div className="bg-main-600 p-2 rounded-b-lg mr-2">Ad</div>
          )}
          {item.discount && (
            <div className="bg-green-700 p-2 rounded-b-lg ">
              {item.discount}% OFF
            </div>
          )}
        </div>
      </div>
      <div
        className={
          "flex flex-col gap-2 py-2 px-4 h-full relative pb-8 bg-main-50 dark:bg-main-950"
        }
      >
        <h5 className="text-sm text-main-0 dark:text-main-1000 ">
          at{" "}
          {item.firstDestination
            ? item.firstDestination?.name
            : item.destinations[0].name}
        </h5>
        <ul className="flex flex-col gap-2 w-full pb-2">
          <li className="flex items-start gap-2 text-main-0 dark:text-main-1000 text-sm">
            <span className="font-bold flex-1 text-end">Difficulty :</span>
            <span className="flex-1 text-start bg-main-100 dark:bg-main-900 px-2">
              {item.difficulty}
            </span>
          </li>
          <li className="flex items-start gap-2 text-main-0 dark:text-main-1000 text-sm">
            <span className="font-bold flex-1 text-end">Duration :</span>
            <span className="flex-1 text-start bg-main-100 dark:bg-main-900 px-2">
              {getDuration()}
            </span>
          </li>
          <li className="flex items-start gap-2 text-main-0 dark:text-main-1000 text-sm">
            <span className="font-bold flex-1 text-end">Score :</span>
            <span className="flex-1 text-start bg-main-100 dark:bg-main-900 px-2">
              {item.averageScore || "---"}
            </span>
          </li>
          <li className="flex items-start gap-2 text-main-0 dark:text-main-1000 text-sm">
            <span className="font-bold flex-1 text-end">Frequency :</span>
            <span className="flex-1 text-start bg-main-100 dark:bg-main-900 px-2">
              {item.frequency}
            </span>
          </li>
        </ul>
        {!item.discount && !item.fixedDiscount && (
          <div className="bg-main-500 dark:bg-main-400 text-main-1000 text-xs self-end px-2 py-0.5 rounded-l-lg bottom-3 right-4 absolute ">
            U$D {item.price}
          </div>
        )}
        {item.discount && (
          <div className="bg-main-500 dark:bg-main-400 text-main-1000 text-xs self-end px-2 py-0.5 rounded-l-lg bottom-3 right-4 absolute">
            <span className="text-main-1000/50 line-through pr-2">
              {item.price}
            </span>
            U$D
            {(item.price - item.price * (item.discount / 100)).toFixed(2)}
          </div>
        )}
        {item.fixedDiscount && (
          <div className="bg-main-500 dark:bg-main-400 text-main-1000 text-xs self-end px-2 py-0.5 rounded-l-lg bottom-3 right-4 absolute">
            <span className="text-main-1000/50 line-through pr-2">
              {item.price}
            </span>
            U$D
            {item.price - item.fixedDiscount}
          </div>
        )}
      </div>
    </Link>
  );
}
