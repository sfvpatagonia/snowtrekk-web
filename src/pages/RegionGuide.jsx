import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getLeadsByRegion from "@/services/getLeadsByRegion";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import PlaceSlider from "@/components/PlaceSlider";
import { fetchRegions } from "@/redux/regionSlice";
import LoadingComponent from "@/components/LoadingComponent";
import ConditionalAccordion from "@/components/conditionalAccordion/ConditionalAccordion";
import ClientLeadCard from "@/components/ClientLeadCard";
import { sortArray } from "@/utils/sortPlaceArray";
import Reveal from "../components/RevealWrapper";
import ActivitiesFilter from "../components/ActivitiesFilter";

const Region = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { region } = useParams();
  const guide = useSelector((state) => state.guide);

  const [areas, setAreas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [directDestinations, setDirectDestinations] = useState([]); // Estado para directDestinations
  const regions = useSelector((state) => state.regions.regions);
  const statusRegions = useSelector((state) => state.regions.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (statusRegions === "idle") {
      dispatch(fetchRegions());
    }
  }, [statusRegions, dispatch]);

  useEffect(() => {
    if (statusRegions === "succeeded" && regions.length !== 0) {
      const foundRegion = regions.find((co) => co.id === region);
      setCurrentRegion(foundRegion);
      if (!foundRegion) {
        navigate("/not-found");
      }
    }
  }, [statusRegions]);

  useEffect(() => {
    if (!currentRegion) return;
    const fetchData = async () => {
      const result = await getLeadsByRegion(region);

      if (result.ok) {
        setAreas(result.body.areas);
        setActivities(Object.values(result.body.activityCounts));
        setDirectDestinations(result.body.directDestinations); // Almacena directDestinations
      }
      setLoading(false);
    };
    fetchData();
  }, [currentRegion]);

  const handleActivitySelection = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const filteredAreas = areas.map((area) => {
    const filteredCities = area.Cities.map((city) => {
      const filteredDestinations = city.destinationCity.map((destination) => {
        if (selectedActivities.length > 0) {
          const filteredClients = destination.clients.filter((client) =>
            client.clientActivities.some((activity) =>
              selectedActivities.includes(activity.id)
            )
          );
          return {
            ...destination,
            clients: filteredClients,
          };
        } else {
          return destination;
        }
      });

      return {
        ...city,
        destinationCity: filteredDestinations,
      };
    });

    return {
      ...area,
      Cities: filteredCities,
    };
  });

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-full gap-2 dark:bg-main-950 lg:bg-[url('/src/assets/bg.png')] bg-repeat bg-fixed bg-blend-normal bg-main-100 min-h-[calc(100vh-256px)]">
        <main className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 px-6 pb-12">
          <h1 className="text-3xl text-main-400 font-bold uppercase pt-4">
            Welcome to{" "}
            <span className="text-green-700">{currentRegion?.name}</span>
          </h1>
          {currentRegion && (
            <PlaceSlider
              currentDestination={currentRegion}
              gallery={currentRegion.Images || []}
            />
          )}
          <h2 className="text-2xl text-left font-bold text-main-600 dark:text-main-400 mt-4">
            {/* {services.length > 0
                ? "Other Local Providers"
                : "Explore Experiences Nearby"} */}
            Explore Experiences Nearby
          </h2>
          <ActivitiesFilter
            activities={activities}
            handleActivitySelection={handleActivitySelection}
            selectedActivities={selectedActivities}
            initialActivityId={guide.selectedActivity}
          />
          {/* Renderizamos directDestinations */}
          {directDestinations.length > 0 && (
            <section className="flex flex-wrap w-full gap-4">
              <p className="text-2xl text-left font-bold text-main-600 dark:text-main-400">
                Direct Destinations
              </p>
              {directDestinations.map((destination, index) => (
                <ConditionalAccordion
                  key={index}
                  condition={destination.name !== currentRegion.name}
                  redirectTo={`/destination/${destination.id}`}
                  place="destination"
                  name={destination.name}
                >
                  <Reveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-2 pt-8 place-items-center pb-8">
                      {destination.clients.map((client, idx) => (
                        <ClientLeadCard client={client} key={idx} />
                      ))}
                    </div>
                  </Reveal>
                </ConditionalAccordion>
              ))}
            </section>
          )}
          <section className="flex flex-col w-full gap-4">
            {directDestinations.length > 0 && (
              <p className="text-2xl text-left font-bold text-main-600 dark:text-main-400">
                Areas
              </p>
            )}

            {sortArray(filteredAreas, currentRegion.name).map(
              (area, index) =>
                area.Cities.length > 0 &&
                area.Cities.some(
                  (city) =>
                    city.destinationCity.length > 0 &&
                    city.destinationCity.some((dest) => dest.clients.length > 0)
                ) && (
                  <div className="flex flex-col">
                    <ConditionalAccordion
                      condition={area.name !== currentRegion.name}
                      redirectTo={`/area/${area.id}`}
                      place="area"
                      name={area.name}
                      key={index}
                    >
                      {sortArray(area.Cities, area.name).map(
                        (city, index) =>
                          city.destinationCity.length > 0 &&
                          city.destinationCity.some(
                            (dc) => dc.clients.length > 0
                          ) && (
                            <div className="flex flex-col">
                              <ConditionalAccordion
                                condition={city.name !== area.name}
                                redirectTo={`/city/${city.id}`}
                                place="city"
                                name={city.name}
                                key={index}
                              >
                                {sortArray(city.destinationCity, city.name).map(
                                  (destination, index) =>
                                    destination.clients.length > 0 && (
                                      <ConditionalAccordion
                                        condition={
                                          city.name !== destination.name
                                        }
                                        redirectTo={`/destination/${destination.id}`}
                                        place="destination"
                                        name={destination.name}
                                        key={index}
                                      >
                                        <div className="flex w-full flex-wrap gap-4 justify-center">
                                          {destination.clients.map(
                                            (client, index) => (
                                              <ClientLeadCard
                                                client={client}
                                                key={index}
                                              />
                                            )
                                          )}
                                        </div>
                                      </ConditionalAccordion>
                                    )
                                )}
                              </ConditionalAccordion>
                            </div>
                          )
                      )}
                    </ConditionalAccordion>
                  </div>
                )
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Region;
