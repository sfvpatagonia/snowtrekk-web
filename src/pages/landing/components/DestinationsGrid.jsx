import { useEffect } from "react";
import { useState } from "react";
import PlaceCard from "./PlaceCard";
import { getFeaturedDestination } from "../../../services/destinations";
import Reveal from "../../../components/RevealWrapper";

export default function DestinationsGrid({ setDestinationOnSpotlight }) {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    getFeaturedDestination()
      .then((data) => {
        const featuredDestinations = data?.body?.destinations;
        const safeDestinations = Array.isArray(featuredDestinations) ? featuredDestinations : [];

        setDestinations(safeDestinations);
        setDestinationOnSpotlight(
          safeDestinations.find((destination) => destination.name === "El ChaltÃ©n") || null
        );
      })
      .catch(() => {
        setDestinations([]);
        setDestinationOnSpotlight(null);
      });
  }, []);

  return (
    <section className="flex flex-col gap-2 py-6">
      <div className="flex w-full flex-col bg-main-100 dark:bg-main-900 rounded-lg p-4 ">
        <h2 className="text-center text-2xl font-bold text-main-600 dark:text-main-400 uppercase">
          Discover where your next adventure awaits
        </h2>
        <p className="font-bold text-main-0 dark:text-main-1000">
          Check out our most popular destinations
        </p>
      </div>

      <div className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2 pb-12 px-2 sm:px-20 mx-auto">
        {destinations.map((destination, index) => (
          <Reveal key={index}>
            <PlaceCard place={destination} />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="flex px-20 justify-end">
          {/* <button className="button">See All Destinations</button> */}
        </div>
      </Reveal>
    </section>
  );
}

