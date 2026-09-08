import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFeaturedDestination } from "@/services/destinations";

export default function DestinationPills() {
  const [destinations, setDestinations] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("destino");

  useEffect(() => {
    getFeaturedDestination()
      .then((data) => {
        const featuredDestinations = data?.body?.destinations;
        setDestinations(Array.isArray(featuredDestinations) ? featuredDestinations : []);
      })
      .catch(() => {
        setDestinations([]);
      });
  }, []);

  const selectDestination = (id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("destino", id);
      return next;
    });
  };

  const clearDestination = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("destino");
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2 items-center py-2">
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={clearDestination}
          className={`px-4 py-1 rounded-full text-sm font-semibold border transition-all ${
            !selectedId
              ? "bg-main-600 dark:bg-main-400 text-white border-main-600 dark:border-main-400"
              : "bg-main-50 dark:bg-main-900 border-main-300 dark:border-main-700 text-main-600 dark:text-main-400"
          }`}
        >
          Todos
        </button>

        {destinations.map((destination) => {
          const isSelected = destination.id === selectedId;
          return (
            <button
              type="button"
              key={destination.id}
              onClick={() => selectDestination(destination.id)}
              className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-semibold border transition-all ${
                isSelected
                  ? "bg-main-600 dark:bg-main-400 text-white border-main-600 dark:border-main-400"
                  : "bg-main-50 dark:bg-main-900 border-main-300 dark:border-main-700 text-main-600 dark:text-main-400"
              }`}
            >
              {destination.name}
              {isSelected && (
                <span
                  role="button"
                  aria-label={`Quitar filtro ${destination.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDestination();
                  }}
                >
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
