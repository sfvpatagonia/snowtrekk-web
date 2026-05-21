import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getLeadsByCity from "@/services/getLeadsByCity";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useSelector } from "react-redux";
import PlaceSlider from "@/components/PlaceSlider.jsx";
import LoadingComponent from "@/components/LoadingComponent";
import ClientLeadCard from "@/components/ClientLeadCard";
import "@/utils/accordionStyles.css";
import { sortArray } from "@/utils/sortPlaceArray";
import ConditionalAccordion from "@/components/conditionalAccordion/ConditionalAccordion";
import ActivitiesFilter from "../components/ActivitiesFilter";
import Reveal from "../components/RevealWrapper";
import { getCityById } from "../services/cities";

const CityGuide = () => {
  const navigate = useNavigate();
  const { city } = useParams();
  const guide = useSelector((state) => state.guide);

  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentCity, setCurrentCity] = useState(null); // Añade un estado para currentCity
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCityById(city)
      .then((data) => {
        setCurrentCity(data.body.city);
      })
      .catch((error) => {
        console.log(error);
        navigate("/not-found");
      });
  }, []);

  useEffect(() => {
    if (!currentCity) return;
    const fetchData = async () => {
      const result = await getLeadsByCity(city);
      if (result.ok) {
        setDestinations(result.body.destinations);
        setActivities(Object.values(result.body.activityCounts));
      }
      setLoading(false);
    };
    fetchData();
  }, [currentCity]);

  const handleActivitySelection = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const filteredDestinations = destinations.map((destination) => {
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

  if (loading) {
    return <LoadingComponent />;
  } else {
    return (
      <div>
        <Header />
        <div className="flex flex-full gap-2 dark:bg-main-950 lg:bg-[url('/src/assets/bg.png')] bg-repeat bg-fixed bg-blend-normal bg-main-100 min-h-[calc(100vh-256px)]">
          <main className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 px-6 pb-12">
            <h1 className="text-3xl text-main-400 font-bold uppercase pt-4">
              Welcome to{" "}
              <span className="text-green-700">{currentCity?.name}</span>
            </h1>
            {currentCity && (
              <PlaceSlider
                currentDestination={currentCity}
                gallery={currentCity.Images || []}
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

            <div className="flex flex-col w-full gap-4">
              {sortArray(filteredDestinations, currentCity.name).map(
                (destination, index) => {
                  if (destination.clients.length > 0) {
                    return (
                      <ConditionalAccordion
                        condition={currentCity.name !== destination.name}
                        redirectTo={`/destination/${destination.id}`}
                        place={"destination"}
                        name={destination.name}
                        key={index}
                      >
                        <Reveal>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-2 pt-8 place-items-center pb-8">
                            {destination.clients.map((client, index) => (
                              <ClientLeadCard client={client} key={index} />
                            ))}
                          </div>
                        </Reveal>
                      </ConditionalAccordion>
                    );
                  }
                }
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
};

export default CityGuide;
