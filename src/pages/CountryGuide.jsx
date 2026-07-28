import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getLeadsByCountry from "@/services/getLeadsByCountry";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useSelector } from "react-redux";
import PlaceSlider from "@/components/PlaceSlider";
import LoadingComponent from "@/components/LoadingComponent";
import ConditionalAccordion from "@/components/conditionalAccordion/ConditionalAccordion";
import ClientLeadCard from "@/components/ClientLeadCard";
import { sortArray } from "@/utils/sortPlaceArray";
import Reveal from "../components/RevealWrapper";
import ActivitiesFilter from "../components/ActivitiesFilter";
import { getCountryById } from "../services/countries";

const CountryGuide = () => {
  const guide = useSelector((state) => state.guide);

  const navigate = useNavigate();
  const { country } = useParams();
  const [areas, setAreas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null); // Añade un estado para currentCountry
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountryById(country)
      .then((data) => {
        setCurrentCountry(data.body.country);
      })
      .catch((error) => {
        console.log(error);
        navigate("/not-found");
      });
  }, []);

  useEffect(() => {
    if (currentCountry === null) return;
    const fetchData = async () => {
      const result = await getLeadsByCountry(country);
      if (result.ok) {
        setAreas(result.body.areas);
        setActivities(Object.values(result.body.activityCounts)); // Asumiendo que los contadores de actividades vienen así
      }
      setLoading(false);
    };
    fetchData();
  }, [currentCountry]);

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
            <span className="text-green-700">{currentCountry?.name}</span>
          </h1>
          {currentCountry && (
            <PlaceSlider
              currentDestination={currentCountry}
              gallery={currentCountry.Images || []}
            />
          )}
          <ActivitiesFilter
            activities={activities}
            handleActivitySelection={handleActivitySelection}
            selectedActivities={selectedActivities}
            initialActivityId={guide.selectedActivity}
          />
          <section className="flex flex-col w-full gap-4">
            {sortArray(filteredAreas, currentCountry?.name).map(
              (area, index) => {
                if (
                  area.Cities.length > 0 &&
                  area.Cities.some(
                    (city) =>
                      city.destinationCity.length > 0 &&
                      city.destinationCity.some(
                        (dest) => dest.clients.length > 0
                      )
                  )
                ) {
                  return (
                    <ConditionalAccordion
                      condition={area.name !== currentCountry?.name}
                      redirectTo={`/area/${area.id}`}
                      place={"area"}
                      name={area.name}
                      key={index}
                    >
                      {sortArray(area.Cities, area.name).map((city, index) => {
                        if (
                          city.destinationCity.length > 0 &&
                          city.destinationCity.some(
                            (dc) => dc.clients.length > 0
                          )
                        ) {
                          return (
                            <ConditionalAccordion
                              condition={city.name !== area.name}
                              redirectTo={`/city/${city.id}`}
                              place={"city"}
                              name={city.name}
                              key={index}
                            >
                              {sortArray(city.destinationCity, city.name).map(
                                (destination, index) => {
                                  if (destination.clients.length > 0) {
                                    return (
                                      <ConditionalAccordion
                                        condition={
                                          city.name !== destination.name
                                        }
                                        redirectTo={`/destination/${destination.id}`}
                                        place={"destination"}
                                        name={destination.name}
                                        key={index}
                                      >
                                        <Reveal>
                                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-2 pt-8 place-items-center pb-8">
                                            {destination.clients.map(
                                              (client, index) => (
                                                <ClientLeadCard
                                                  client={client}
                                                  key={index}
                                                />
                                              )
                                            )}
                                          </div>
                                        </Reveal>
                                      </ConditionalAccordion>
                                    );
                                  }
                                }
                              )}
                            </ConditionalAccordion>
                          );
                        }
                      })}
                    </ConditionalAccordion>
                  );
                }
              }
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CountryGuide;
