import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlaceSlider from "@/components/PlaceSlider";
import { fetchActivities } from "@/redux/activitySlice";
import getClientLeadsByActivity from "@/services/getClientLeadsByActivity";
import ClientLeadCard from "@/components/ClientLeadCard";
import LoadingComponent from "@/components/LoadingComponent";

const ActivityGuide = () => {
  const navigate = useNavigate();
  const { activity } = useParams();
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.activities);
  const statusActivities = useSelector((state) => state.activities.status);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (statusActivities === "idle") {
      dispatch(fetchActivities());
    }
  }, [statusActivities, dispatch]);

  useEffect(() => {
    if (statusActivities === "succeeded" && activities.length !== 0) {
      const foundActivity = activities.find((act) => act.id === activity);
      setCurrentActivity(foundActivity); // Actualiza el estado de currentDestination
      if (!foundActivity) {
        navigate("/not-found");
      }
    }
  }, [statusActivities]);

  useEffect(() => {
    if (!currentActivity) return;
    getClientLeadsByActivity(activity)
      .then((data) => {
        setLeads(data.body.leads);
      })
      .finally(() => setLoading(false));
    setLoading(false);
  }, [currentActivity]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />
      <div className="flex gap-2 dark:bg-main-950 lg:bg-[url('/src/assets/bg.png')] bg-repeat bg-fixed bg-blend-normal bg-main-100 min-h-[calc(100vh-256px)]">
        <main className="flex flex-col w-full overflow-hidden gap-4 xl:max-w-7xl mx-auto bg-main-50 dark:bg-main-950 px-6 ">
          <h1 className="text-3xl text-main-400 font-bold uppercase pt-4">
            {currentActivity?.name}
          </h1>
          {currentActivity && (
            <PlaceSlider
              currentDestination={currentActivity}
              gallery={currentActivity.Images || []}
            />
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 w-full p-2 place-items-center">
            {leads.length === 0 ? (
              <h3 className="text-lg text-center w-full font-bold text-main-0 dark:text-main-1000">
                Looks Like There Are No One Here Yet!
              </h3>
            ) : (
              leads.map((client, index) => (
                <ClientLeadCard client={client} index={client.id} />
              ))
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityGuide;
