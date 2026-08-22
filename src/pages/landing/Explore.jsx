import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import BannerVideos from "./components/BannerVideos";
import ActivitiesGuide from "./components/ActivitiesGuide";
import service from "@/services/service";
import ServiceCard from "@/components/ServiceCard";
import LearnAbout from "./components/LearnAbout";
import DestinationsGrid from "./components/DestinationsGrid";
import Reveal from "../../components/RevealWrapper";
import LandingNav from "./components/LandingNav";
import { useGeoRegion } from "./hooks/useGeoRegion";

const Explore = () => {
  const [services, setServices] = useState([]);
  const [destinationOnSpotlight, setDestinationOnSpotlight] = useState(null);
  const { regionData } = useGeoRegion();

  useEffect(() => {
    service
      .getFeaturedServices()
      .then((data) => {
        const featuredServices = data?.body?.services;
        setServices(Array.isArray(featuredServices) ? featuredServices : []);
      })
      .catch(() => {
        setServices([]);
      });
  }, []);

  return (
    <>
      <LandingNav regionData={regionData} />

      <div className="flex gap-2 bg-main-100 dark:bg-main-950 lg:bg-[url('/src/assets/bg-new4.jpg')] bg-cover bg-fixed bg-blend-normal">
        <main className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 xl:px-6">
          <div className="flex w-full flex-col bg-main-100 dark:bg-main-900 rounded-t-lg -mb-4 p-4">
            <h2 className="text-center text-2xl font-bold text-main-600 dark:text-main-400 uppercase">
              Take a look at this amazing videos
            </h2>
          </div>
          <BannerVideos />
          <Reveal>
            <section className="flex flex-col gap-6 py-6">
              <h2 className="text-center text-2xl font-bold text-main-600 dark:text-main-400 uppercase">
                Our most popular services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 place-items-center bg-main-100 dark:bg-main-900 py-2 rounded">
                {services.map((svc, index) => (
                  <Reveal key={index} classname={"w-full flex justify-center self-start h-full"}>
                    <ServiceCard key={svc.id} item={svc} />
                  </Reveal>
                ))}
              </div>
            </section>
          </Reveal>
          <Reveal>
            <DestinationsGrid setDestinationOnSpotlight={setDestinationOnSpotlight} />
          </Reveal>
          <Reveal>
            {destinationOnSpotlight && <LearnAbout destination={destinationOnSpotlight} />}
          </Reveal>
          <Reveal>
            <ActivitiesGuide />
          </Reveal>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Explore;
