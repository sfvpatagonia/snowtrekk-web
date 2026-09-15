import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import momentService from "@/services/moment";
import videoService from "@/services/video";
import { getDestinationById } from "@/services/destinations";
import BannerVideos from "./BannerVideos";
import LoadingComponent from "@/components/LoadingComponent";

const CAPTION_PREVIEW_LENGTH = 140;

export default function MomentsCarousel() {
  // null = still loading, [] = confirmed empty (or failed, see hasError), array = loaded moments
  const [moments, setMoments] = useState(null);
  const [hasError, setHasError] = useState(false);
  // null = not checked yet / not applicable, true = legacy Video has content
  // for this destination, false = confirmed none either.
  const [videoFallback, setVideoFallback] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState(new Set());
  // Swaps the "updating" overlay to the clickable "keep browsing" CTA after 3s.
  const [showCta, setShowCta] = useState(false);
  // null = not loaded (or fetch failed) — overlay falls back to the generic message.
  const [destinationName, setDestinationName] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const destino = searchParams.get("destino");

  useEffect(() => {
    momentService
      .getAllMoments(destino)
      .then((result) => {
        if (result.ok && Array.isArray(result.moments)) {
          if (result.moments.length === 0) {
            console.info("MomentsCarousel: no active moments yet, using fallback carousel");
          }
          setMoments(result.moments);
          setHasError(false);
        } else {
          console.warn("MomentsCarousel: failed to load moments, using fallback carousel", result.message);
          setMoments([]);
          setHasError(true);
        }
      })
      .catch((error) => {
        console.warn("MomentsCarousel: failed to load moments, using fallback carousel", error);
        setMoments([]);
        setHasError(true);
      });
  }, [destino]);

  // Priority fix: before telling the user a destination has "nothing to
  // show", check whether the legacy Video system has content for it — if it
  // does, fall through to <BannerVideos/> instead of hiding real content.
  // Only runs when Moments came back empty for a selected destination.
  useEffect(() => {
    if (!destino || !Array.isArray(moments)) {
      setVideoFallback(null);
      return;
    }
    const hasOwnContent = moments.some((moment) => moment.momentType !== "promo");
    if (hasOwnContent) {
      setVideoFallback(null);
      return;
    }
    let cancelled = false;
    videoService.getVideosByDestination(destino).then((result) => {
      if (cancelled) return;
      const hasVideos =
        result.ok &&
        Array.isArray(result.videos) &&
        result.videos.some((video) => video.videoOrder !== 0);
      setVideoFallback(hasVideos);
    });
    return () => {
      cancelled = true;
    };
  }, [destino, moments]);

  // Destination name for the "neither system has content" overlay — fetched
  // independently of the CTA timer and videoFallback check below, so a
  // slow/failed fetch never blocks either; falls back to the generic
  // message (see render) until it resolves.
  useEffect(() => {
    const hasOwnContent =
      Array.isArray(moments) && moments.some((moment) => moment.momentType !== "promo");
    if (!destino || !Array.isArray(moments) || hasOwnContent) {
      setDestinationName(null);
      return;
    }
    let cancelled = false;
    getDestinationById(destino).then((result) => {
      if (cancelled) return;
      setDestinationName(result.ok ? result.body?.destination?.name ?? null : null);
    });
    return () => {
      cancelled = true;
    };
  }, [destino, moments]);

  // Overlay CTA timer — only armed for the branch where both Moments and the
  // legacy Video system are confirmed empty for the selected destination.
  useEffect(() => {
    const hasOwnContent =
      Array.isArray(moments) && moments.some((moment) => moment.momentType !== "promo");
    if (!(destino && Array.isArray(moments) && !hasOwnContent && videoFallback === false)) {
      setShowCta(false);
      return;
    }
    const timer = setTimeout(() => setShowCta(true), 3000);
    return () => clearTimeout(timer);
  }, [destino, moments, videoFallback]);

  // Still waiting on the fetch — show a loading state, not the old video,
  // so it never flashes in only to be swapped out a moment later.
  if (moments === null) return <LoadingComponent />;

  // A real fetch/backend error always falls back to the banner, regardless
  // of destination selection — only a confirmed-empty result for a selected
  // destination gets the "updating" message below.
  if (hasError) return <BannerVideos />;

  // Promo moments are destination-agnostic, so a destination with only promo
  // moments (no real content of its own) still counts as "nothing to show".
  const hasOwnContent = moments.some((moment) => moment.momentType !== "promo");

  if (destino && !hasOwnContent) {
    // Still checking the legacy Video system — reuse the existing loading
    // state rather than flashing the "updating" message first.
    if (videoFallback === null) return <LoadingComponent />;
    if (videoFallback) return <BannerVideos />;

    // Neither system has content for this destination — keep the default
    // unfiltered banner playing in the background (BannerVideos never reads
    // destino) with a small overlay instead of hiding it behind a full box.
    return (
      <div className="relative w-full">
        <BannerVideos />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {showCta ? (
            <button
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete("destino");
                setSearchParams(next);
              }}
              className="pointer-events-auto px-4 py-2 rounded-lg bg-main-100/90 dark:bg-main-900/90 border border-main-400 font-bold text-main-600 dark:text-main-400 shadow-lg"
            >
              Hacé click acá para seguir navegando Snowtrekk
            </button>
          ) : (
            <div className="px-4 py-2 rounded-lg bg-main-100/90 dark:bg-main-900/90 border border-main-400 font-bold text-main-600 dark:text-main-400 shadow-lg">
              {destinationName
                ? `Estamos actualizando la información de ${destinationName}`
                : "Estamos actualizando el destino"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // No destination selected and fetch resolved empty — today's existing fallback.
  if (!destino && moments.length === 0) return <BannerVideos />;

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
