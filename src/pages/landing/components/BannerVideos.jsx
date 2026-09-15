import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import videoService from "@/services/video";
import shopService from "@/services/shop";
import PlaceCard from "./PlaceCard";
import LoadingComponent from "@/components/LoadingComponent";
import { Link, useSearchParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HikingIcon from "@mui/icons-material/Hiking";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SchoolIcon from "@mui/icons-material/School";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CabinIcon from "@mui/icons-material/Cabin";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";

// Same 14 Collector categories as CATEGORY_CONFIG in
// scripts/import-collector-prospects.js — generic icon fallback since Shops
// have no real photos yet.
const CATEGORY_ICONS = {
  Restaurantes: RestaurantIcon,
  Farmacias: LocalPharmacyIcon,
  "Centros Médicos": LocalHospitalIcon,
  Alojamientos: HotelIcon,
  Transporte: DirectionsBusIcon,
  Supermercados: LocalGroceryStoreIcon,
  "Tiendas de Montaña": StorefrontIcon,
  "Turismo y Actividades": HikingIcon,
  "Alquiler de Esquís": DownhillSkiingIcon,
  "Bar Apres Ski": LocalBarIcon,
  "Escuela de Esquí": SchoolIcon,
  "Experiencia Icónica": AutoAwesomeIcon,
  "Refugio de Montaña": CabinIcon,
  Embajador: PersonPinCircleIcon,
};

// Side rail card for a destination's own Shops (replaces the "other
// destinations" PlaceCard when a destination is selected). Kept separate
// from PlaceCard rather than adapting it in place — the prop shapes diverge
// (shop.Image is a single nullable object, not Destination's Images array)
// and PlaceCard has other callers this shouldn't risk touching.
function ShopRailCard({ shop, onSelect }) {
  const Icon = CATEGORY_ICONS[shop.type] || StorefrontIcon;
  const imageUrl = shop.Image?.url;

  return (
    <button
      onClick={() => onSelect(shop)}
      className="group flex flex-col gap-2 min-h-min rounded-lg bg-main-100 shadow cursor-pointer
      dark:bg-main-900 dark:shadow-main-0/50 overflow-hidden
      w-[200px] lg:w-full flex-shrink-0 transition-all
      border border-main-100 dark:border-main-950 hover:border-green-700 relative text-left"
    >
      {shop.isPreferred && (
        <span className="absolute top-1 right-1 z-10 text-yellow-400">
          <StarIcon fontSize="small" />
        </span>
      )}
      <div
        className="relative overflow-hidden rounded-t-lg border-b-2 border-main-400
                   transition-all duration-300 ease-in-out group-hover:border-green-700
                   w-full aspect-video flex items-center justify-center bg-main-200 dark:bg-main-800"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <Icon fontSize="large" className="text-main-500" />
        )}
      </div>

      <h3 className="text-main-400 font-bold text-lg py-1 px-2 truncate portrait:text-sm group-hover:text-green-700 transition-colors duration-300 ease-in-out">
        {shop.name}
      </h3>
    </button>
  );
}

export default function BannerVideos() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing] = useState(true);
  const [loading, setLoading] = useState(true);
  // const [videoLoading, setVideoLoading] = useState(false);

  // Same URL convention MomentsCarousel/DestinationPills already use: read
  // the selected destination directly from ?destino= (a Destination id),
  // no prop threading from Explore.jsx.
  const [searchParams] = useSearchParams();
  const idDestination = searchParams.get("destino");

  // 👉 índice global del video activo
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 👉 estructura agrupada por destino
  const [groupedVideos, setGroupedVideos] = useState([]);

  // 👉 Shops for the side rail when a destination is selected
  const [shops, setShops] = useState([]);

  useEffect(() => {
    setLoading(true);
    setCurrentVideoIndex(0);

    const request = idDestination
      ? videoService.getVideosByDestination(idDestination)
      : videoService.getAllVideos(null);

    request
      .then((result) => {
        if (!result.ok || !Array.isArray(result.videos)) {
          setGroupedVideos([]);
          return;
        }

        // ✅ videoOrder 0 = excluido del carrusel público (sigue visible en el admin)
        // destinationOrder sigue usándose solo como criterio de orden entre destinos
        const visible = result.videos.filter(
          (video) => video.videoOrder !== 0,
        );

        if (idDestination) {
          // Already scoped to one destination — no cross-destination
          // grouping needed, just order this destination's own videos.
          const ordered = [...visible].sort(
            (a, b) => a.videoOrder - b.videoOrder,
          );
          setGroupedVideos(
            ordered.length
              ? [
                  {
                    destination: ordered[0].Destination,
                    videos: ordered.map((video) => ({
                      id: video.id,
                      url: video.url,
                      description: video.description,
                      service: video.service || null,
                    })),
                  },
                ]
              : [],
          );
          return;
        }

        // ✅ ORDEN GLOBAL: DESTINO → VIDEO
        const ordered = [...visible].sort((a, b) => {
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
      })
      .finally(() => setLoading(false));
  }, [idDestination]);

  // 👉 Shops for the side rail — only fetched when a destination is selected
  useEffect(() => {
    if (!idDestination) {
      setShops([]);
      return;
    }
    shopService.getShopsByDestination(idDestination).then((result) => {
      setShops(result.ok && Array.isArray(result.shops) ? result.shops : []);
    });
  }, [idDestination]);

  const handleShopClick = (shop) => {
    document
      .getElementById(`service-shop-${shop.id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

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

  // ✅ Safety net: every video excluded (videoOrder = 0) or none exist yet
  if (flatVideos.length === 0) return null;

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
        {idDestination
          ? shops.map((shop) => (
              <ShopRailCard key={shop.id} shop={shop} onSelect={handleShopClick} />
            ))
          : uniqueDestinations.map((destination) => (
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
