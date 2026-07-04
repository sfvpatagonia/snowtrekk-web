import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import videoService from "@/services/video";
import PlaceCard from "./PlaceCard";
import LoadingComponent from "@/components/LoadingComponent";
import { Link } from "react-router-dom";
import logo from "@/assets/logoST.png";

export default function BannerVideos() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  // const [videoLoading, setVideoLoading] = useState(false);

  // 👉 índice global del video activo
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 👉 estructura agrupada por destino
  const [groupedVideos, setGroupedVideos] = useState([]);

  useEffect(() => {
    videoService
      .getAllVideos(null)
      .then((result) => {
        if (result.ok && Array.isArray(result.videos)) {
          // ✅ ORDEN GLOBAL: DESTINO → VIDEO
          const ordered = [...result.videos].sort((a, b) => {
            if (a.destinationOrder !== b.destinationOrder) {
              return a.destinationOrder - b.destinationOrder;
            }
            return a.videoOrder - b.videoOrder;
          });

          // ✅ AGRUPAR POR DESTINO
          const grouped = Object.values(
            ordered.reduce((acc, video) => {
              const destId = video.idDestination;

              if (!acc[destId]) {
                acc[destId] = {
                  destination: video.Destination,
                  videos: [],
                };
              }

              acc[destId].videos.push({
                id: video.id,
                url: video.url,
                description: video.description,
                service: video.service || null,
              });

              return acc;
            }, {}),
          );

          setGroupedVideos(grouped);
        } else {
          setGroupedVideos([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ LISTA PLANA PARA REPRODUCTOR
  const flatVideos = useMemo(() => {
    return groupedVideos.flatMap((group) =>
      group.videos.map((v, index) => ({
        ...v,
        destination: group.destination,
        indexInDestination: index + 1,
        totalInDestination: group.videos.length,
      })),
    );
  }, [groupedVideos]);

  const uniqueDestinations = useMemo(
    () => groupedVideos.map((group) => group.destination),
    [groupedVideos],
  );

  const changeVideo = (destinationId) => {
    const index = flatVideos.findIndex(
      (video) => video.destination.id === destinationId,
    );
    if (index !== -1) {
      setCurrentVideoIndex(index);
    }
  };

  // ✅ AVANZAR AL SIGUIENTE VIDEO
  const nextVideo = () => {
    if (currentVideoIndex < flatVideos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else {
      setCurrentVideoIndex(0); // vuelve al inicio
    }
  };

  const currentVideo = flatVideos[currentVideoIndex];

  // const fetchServices = async () => {
  //   const servicesObj = {};
  //   await Promise.all(
  //     uniqueDestinations.map(async (destination) => {
  //       const result = await service.getServicesByDestinationId(destination.id);
  //       servicesObj[destination.id] = result.ok ? result.body.services : [];
  //     })
  //   );
  //   setServicesByDestination(servicesObj);
  // };

  // useEffect(() => {
  //   if (uniqueDestinations.length > 0) fetchServices();
  // }, [uniqueDestinations]);

  if (loading) return <LoadingComponent />;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col lg:flex-row overflow-hidden  border-b-4 border-main-400 transition-all duration-300 `}
    >
      <figure className="relative group flex flex-col justify-center items-start lg:w-5/6 w-full bg-main-100 rounded-sm dark:bg-main-900  aspect-video">
        <ReactPlayer
          ref={videoRef}
          url={currentVideo?.url}
          playing={playing}
          onEnded={nextVideo}
          muted
          width="100%"
          height="100%"
          // onStart={() => setVideoLoading(false)}
          // onReady={() => setVideoLoading(true)}
          controls
        />
        {/* {videoLoading && (
          <div className="absolute top-0 left-0 w-full aspect-video flex flex-col items-center justify-center bg-main-200 border-y-2 border-main-600 dark:border-main-400 ">
            <img src={logo} alt="Loading..." className="w-60 md:w-[600px]" />
            <div className="w-1/2 lg:w-2/5 h-[10px] bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full w-0 bg-main-600 dark:bg-main-400 
                    animate-fill"
              />
            </div>
          </div>
        )} */}

        {/* ✅ OVERLAY DE CONTROL */}

        <div className="absolute group-hover:opacity-100 opacity-0 top-3 right-3 bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-4">
          <span className="text-sm font-semibold">
            {currentVideo?.indexInDestination} /{" "}
            {currentVideo?.totalInDestination}
          </span>

          <button
            onClick={nextVideo}
            className="button px-3 py-1 rounded text-sm font-bold"
          >
            Next ▶
          </button>
        </div>

        <figcaption className=" flex justify-between w-full bg-main-100 dark:bg-main-900 items-center px-4">
          <div className="flex flex-col items-start py-4 w-full">
            <h1 className="text-2xl font-bold uppercase text-green-800 dark:text-green-200 ">
              {currentVideo?.destination.name || ""}
            </h1>
            <div className="flex w-full justify-between items-start py-4 text-left">
              <h2 className="sm:text-lg font-bold  text-main-600 dark:text-main-400">
                {currentVideo?.description || ""}
              </h2>
              {currentVideo?.service ? (
                <Link
                  to={`/service/${currentVideo?.service.id}`}
                  className="button"
                >
                  Buy
                </Link>
              ) : (
                <Link
                  to={`/destination/${currentVideo?.destination.id}`}
                  className="button whitespace-nowrap"
                >
                  Go to destination
                </Link>
              )}
            </div>
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
        {uniqueDestinations.map((destination) => (
          <PlaceCard
            key={destination.id}
            changeVideo={changeVideo}
            place={destination}
          />
        ))}
      </div>
    </div>
  );
}
