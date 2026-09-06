import { useState, useEffect } from "react";
import momentService from "@/services/moment";
import BannerVideos from "./BannerVideos";
import LoadingComponent from "@/components/LoadingComponent";

const CAPTION_PREVIEW_LENGTH = 140;

export default function MomentsCarousel() {
  // null = still loading, [] = confirmed empty/failed, array = loaded moments
  const [moments, setMoments] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    momentService
      .getAllMoments()
      .then((result) => {
        if (result.ok && Array.isArray(result.moments)) {
          if (result.moments.length === 0) {
            console.info("MomentsCarousel: no active moments yet, using fallback carousel");
          }
          setMoments(result.moments);
        } else {
          console.warn("MomentsCarousel: failed to load moments, using fallback carousel", result.message);
          setMoments([]);
        }
      })
      .catch((error) => {
        console.warn("MomentsCarousel: failed to load moments, using fallback carousel", error);
        setMoments([]);
      });
  }, []);

  // Still waiting on the fetch — show a loading state, not the old video,
  // so it never flashes in only to be swapped out a moment later.
  if (moments === null) return <LoadingComponent />;

  // Fetch resolved empty or failed — never show a broken/empty screen.
  if (moments.length === 0) return <BannerVideos />;

  const currentMoment = moments[currentIndex];
  const isExpanded = expandedIds.has(currentMoment.id);
  const caption = currentMoment.caption || "";
  const isTruncated =
    currentMoment.momentType === "editorial" &&
    !isExpanded &&
    caption.length > CAPTION_PREVIEW_LENGTH;
  const displayedCaption = isTruncated ? `${caption.slice(0, CAPTION_PREVIEW_LENGTH)}…` : caption;

  const nextMoment = () => setCurrentIndex((prev) => (prev + 1) % moments.length);

  const handleMomentClick = (moment) => {
    if (moment.momentType === "editorial") {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(moment.id)) next.delete(moment.id);
        else next.add(moment.id);
        return next;
      });
    } else if (moment.momentType === "destination") {
      console.log(
        `Abriría chat de IA filtrado a destino ${moment.idDestination}`,
      );
    }
    // promo: no-op for now — Fase 3 will define this behavior.
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden border-b-4 border-main-400 transition-all duration-300">
      <figure
        className={`relative group flex flex-col justify-center items-start lg:w-5/6 w-full bg-main-100 rounded-sm dark:bg-main-900 aspect-video ${
          currentMoment.momentType !== "promo" ? "cursor-pointer" : ""
        }`}
        onClick={() => handleMomentClick(currentMoment)}
      >
        {currentMoment.mediaType === "video" ? (
          <video
            key={currentMoment.id}
            src={currentMoment.mediaUrl}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={currentMoment.mediaUrl}
            alt={currentMoment.caption}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute group-hover:opacity-100 opacity-0 top-3 right-3 bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-4">
          <span className="text-sm font-semibold">
            {currentIndex + 1} / {moments.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMoment();
            }}
            className="button px-3 py-1 rounded text-sm font-bold"
          >
            Next ▶
          </button>
        </div>

        <figcaption className="flex justify-between w-full bg-main-100 dark:bg-main-900 items-center px-4">
          <div className="flex flex-col items-start py-4 w-full">
            <h2 className="sm:text-lg font-bold text-main-600 dark:text-main-400">
              {displayedCaption}
            </h2>
          </div>
        </figcaption>
      </figure>

      <div
        className="
          flex gap-2 max-h-full px-2 pb-2 max-w-full
          lg:flex-col lg:items-center lg:overflow-y-auto
          lg:w-1/6 overflow-auto items-baseline
          justify-evenly
        "
      >
        {moments.map((moment, index) => (
          <button
            key={moment.id}
            onClick={() => setCurrentIndex(index)}
            className={`group flex flex-col gap-2 min-h-min rounded-lg bg-main-100 shadow cursor-pointer
              dark:bg-main-900 dark:shadow-main-0/50 overflow-hidden
              w-[200px] lg:w-full flex-shrink-0 transition-all
              border ${index === currentIndex ? "border-green-700" : "border-main-100 dark:border-main-950"} hover:border-green-700`}
          >
            {moment.mediaType === "video" ? (
              <video src={moment.mediaUrl} className="w-full aspect-video object-cover" muted />
            ) : (
              <img
                src={moment.mediaUrl}
                alt={moment.caption}
                className="w-full aspect-video object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
