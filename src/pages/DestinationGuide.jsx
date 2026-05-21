import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import getLeadsByDestination from "../services/getLeadsByDestination";
import { useSelector } from "react-redux";
import PlaceSlider from "../components/PlaceSlider";
import LoadingComponent from "@/components/LoadingComponent";
import ClientLeadCard from "../components/ClientLeadCard";
import service from "../services/service";
import ServiceSlide from "../components/ServiceSlide";
import Reveal from "../components/RevealWrapper";
import ServiceCard from "../components/ServiceCard";
import ActivitiesFilter from "../components/ActivitiesFilter";
import { getDestinationById } from "@/services/destinations";

const DEBUG_SCROLLSPY = false; // poner true para ver logs

const DestinationGuide = () => {
  const navigate = useNavigate();

  const { destination } = useParams();
  const guide = useSelector((state) => state.guide);

  const [currentDestination, setCurrentDestination] = useState(null);
  const [clientLeads, setClientLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [ads, setAds] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [bestScored, setBestScored] = useState(null);

  // ======================================================
  // Refs para secciones: usamos un object-ref estable
  // ======================================================
  const sectionRefs = useRef({
    recommends: null,
    trending: null,
    community: null,
    services: null,
    providers: null,
  });

  const setSectionRef = (key) => (el) => {
    sectionRefs.current[key] = el;
  };

  const [activeTab, setActiveTab] = useState("recommends");

  useEffect(() => {
    getDestinationById(destination)
      .then((response) => {
        setCurrentDestination(response.body.destination);
      })
      .catch((error) => {
        console.log(error);
        navigate("/not-found");
      });
  }, []);

  // ================= FETCH DE DATOS ======================
  useEffect(() => {
    if (!currentDestination) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLeadsByDestination(destination);
        if (result.ok) {
          setClientLeads(result.body.clientLeads);
          setActivities(result.body.activities);
        }

        const servicesResult =
          await service.getServicesByDestinationId(destination);
        if (servicesResult.ok) {
          setServices(servicesResult.body.services);
          setAds(servicesResult.body.ads);
          setMostViewed(servicesResult.body.mostViewed);
          setBestScored(servicesResult.body.bestRated[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDestination]);

  // ================= SCROLL SPY ROBUSTO =================
  useEffect(
    () => {
      if (DEBUG_SCROLLSPY)
        console.log("Mounting scrollspy, refs:", sectionRefs.current);

      let observer;
      let ticking = false;

      // IntersectionObserver: intenta usarlo primero
      try {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = entry.target.id;
                if (DEBUG_SCROLLSPY)
                  console.log("IO intersecting:", id, entry.intersectionRatio);
                setActiveTab((prev) => (prev === id ? prev : id));
              }
            });
          },
          {
            root: null,
            rootMargin: "-40% 0px -50% 0px", // como venías usando
            threshold: [0.0, 0.1, 0.5], // más robusto
          },
        );

        Object.values(sectionRefs.current).forEach((section) => {
          if (section) observer.observe(section);
        });
      } catch (err) {
        if (DEBUG_SCROLLSPY)
          console.warn("IntersectionObserver no disponible:", err);
        observer = null;
      }

      // Fallback por scroll + rAF: calcula la sección más visible
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;

          const sections = sectionRefs.current;
          if (!sections) return;

          let bestId = null;
          let bestRatio = -Infinity;

          Object.keys(sections).forEach((key) => {
            const el = sections[key];
            if (!el) return;
            const rect = el.getBoundingClientRect();

            // Calculo simple de "visibilidad" — prioriza centro de pantalla
            const viewportHeight =
              window.innerHeight || document.documentElement.clientHeight;
            const visible = Math.max(
              0,
              Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
            );
            const ratio = visible / rect.height;

            if (DEBUG_SCROLLSPY) {
              // eslint-disable-next-line no-console
              console.log(`scrollspy check ${key}`, {
                top: rect.top,
                bottom: rect.bottom,
                visible,
                ratio,
              });
            }

            // Preferimos el ratio mayor y que el elemento tenga al menos 10% visible
            if (ratio > bestRatio && ratio > 0.05) {
              bestRatio = ratio;
              bestId = key;
            }
          });

          if (bestId && bestId !== activeTab) {
            if (DEBUG_SCROLLSPY)
              console.log("scroll fallback sets activeTab ->", bestId);
            setActiveTab(bestId);
          }
        });
      };

      // Añadir listener
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      // Ejecutar una vez al montar para sincronizar
      onScroll();

      return () => {
        // cleanup
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (observer) observer.disconnect();
        if (DEBUG_SCROLLSPY) console.log("Unmounting scrollspy");
      };
      // NOTE: intencionalmente no añadimos 'activeTab' a deps para que el observer no se reinstale constantemente
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      /* solo al montar */
    ],
  );

  // ==================== HANDLERS ========================
  const handleActivitySelection = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  const filteredClientLeads = clientLeads.filter(
    (clientLead) =>
      selectedActivities.length === 0 ||
      clientLead.clientActivities.some((activity) =>
        selectedActivities.includes(activity.id),
      ),
  );

  if (loading) return <LoadingComponent />;

  return (
    <div>
      <Header />

      <div className="flex gap-2 dark:bg-main-950 lg:bg-[url('/src/assets/bg.png')] bg-repeat bg-fixed bg-blend-normal bg-main-100 min-h-[calc(100vh-256px)]">
        <main className="flex flex-col w-full gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 px-6">
          <h1 className="text-3xl text-main-400 font-bold uppercase pt-4">
            Welcome to{" "}
            <span className="text-green-700">{currentDestination?.name}</span>
          </h1>

          {currentDestination && (
            <PlaceSlider
              currentDestination={currentDestination}
              gallery={currentDestination.Images || []}
            />
          )}

          {/* TAB NAV STICKY */}
          {services.length > 0 && (
            <div className="sticky top-0 z-50 bg-main-50 dark:bg-main-950">
              <div className="flex overflow-x-auto py-1 font-semibold">
                {[
                  { id: "recommends", label: "snowtrekk Recommends" },
                  { id: "trending", label: "Trending" },
                  { id: "community", label: "Community Choice" },
                  { id: "services", label: "Services" },
                  { id: "providers", label: "Local Providers" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      sectionRefs.current[tab.id]?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                    className={`px-4 py-1 whitespace-nowrap transition cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-green-700 text-white rounded-t"
                        : "bg-main-600 dark:bg-main-400 text-main-1000 dark:text-main-1000 text-sm last:rounded-tr"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECCIONES - asignamos refs con callbacks */}
          {ads.length > 0 && (
            <section id="recommends" ref={setSectionRef("recommends")}>
              <Reveal>
                <h2 className="text-left text-2xl font-bold text-main-600 dark:text-main-400 py-4">
                  Snowtrekk Recommends
                </h2>
                <div className="hidden lg:grid grid-cols-4 gap-2 bg-main-100 dark:bg-main-900 p-2 rounded-xl">
                  {ads.slice(0, 4).map((service, index) => (
                    <ServiceCard item={service} key={index} />
                  ))}
                </div>
                <div className="block lg:hidden">
                  <ServiceSlide services={ads} />
                </div>
              </Reveal>
            </section>
          )}

          {mostViewed.length > 0 && (
            <section id="trending" ref={setSectionRef("trending")}>
              <Reveal>
                <h2 className="text-left text-2xl font-bold text-main-600 dark:text-main-400 py-4">
                  Trending
                </h2>
                <div className="hidden lg:grid grid-cols-4 gap-2 bg-main-100 dark:bg-main-900 p-2 rounded-xl">
                  {mostViewed.slice(0, 4).map((service, index) => (
                    <ServiceCard item={service} key={index} />
                  ))}
                </div>
                <div className="block lg:hidden">
                  <ServiceSlide services={services} />
                </div>
              </Reveal>
            </section>
          )}
          {bestScored && (
            <section id="community" ref={setSectionRef("community")}>
              <Reveal>
                <div className="flex flex-col w-full bg-main-100 dark:bg-main-900 text-main-0 dark:text-main-1000 p-3 rounded shadow">
                  <h2 className="text-left text-2xl font-bold py-4 text-main-600 dark:text-main-400">
                    Our Community's Choice
                  </h2>
                  <div className="flex w-full gap-2">
                    <div className="flex flex-col w-74  h-auto">
                      <img
                        src={bestScored.Images ? bestScored.Images[0]?.url : ""}
                        alt="Best Scored"
                        className="w-full aspect-square object-cover rounded "
                      />
                      <div className="flex flex-col bg-main-50 dark:bg-main-950 gap-2 p-2 rounded-b-sm border-t-3 border-main-50">
                        <Link to={`/service/${bestScored.id}`}>
                          <h4 className="font-bold hover:text-green-500 duration-200 ease-in text-left px-2">
                            {bestScored.name}
                          </h4>
                        </Link>
                        <h3 className="text-left px-3">
                          Average Score: <span>{bestScored.averageScore}</span>
                        </h3>
                        <h3 className="text-left px-3">
                          Difficulty: <span>{bestScored.difficulty}</span>
                        </h3>
                        <h3 className="text-left px-3">
                          Duration: <span>{bestScored.duration}</span>
                        </h3>
                        <h3 className="text-left px-3">
                          Price: <span>U$D {bestScored.price}</span>
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                      <p className=" p-2 text-left h-full bg-main-50 dark:bg-main-950 rounded-sm">
                        {bestScored.description}
                      </p>
                      <div className="flex justify-end p-2">
                        <Link to={`/service/${bestScored.id}`}>
                          <button className="button ">Buy</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>
          )}
          {services.length !== 0 && (
            <section id="services" ref={setSectionRef("services")}>
              <h2 className="text-left text-2xl font-bold text-main-600 dark:text-main-400 py-4">
                All Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 place-items-center  bg-main-100 dark:bg-main-900 py-2 rounded">
                {services.map((service, index) => (
                  <Reveal
                    key={index}
                    classname={"w-full flex justify-center self-start h-full"}
                  >
                    <ServiceCard key={service.id} item={service} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <section id="providers" ref={setSectionRef("providers")}>
            <h2 className="text-left text-2xl font-bold text-main-600 dark:text-main-400 mt-4 py-2">
              {services.length > 0
                ? "Other Local Providers"
                : "Explore Experiences Nearby"}
            </h2>

            <ActivitiesFilter
              activities={activities}
              handleActivitySelection={handleActivitySelection}
              selectedActivities={selectedActivities}
              initialActivityId={guide.selectedActivity}
            />

            <Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-2 pt-8 place-items-center pb-8">
                {filteredClientLeads.length === 0 ? (
                  <h3>Looks Like There Are No One Here Yet!</h3>
                ) : (
                  filteredClientLeads.map((client, index) => (
                    <ClientLeadCard client={client} key={index} />
                  ))
                )}
              </div>
            </Reveal>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationGuide;
