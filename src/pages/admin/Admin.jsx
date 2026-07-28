import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import CountryTab from "./components/CountryTab";
import ClientLeadsTab from "./components/clientLeadsTab/ClientLeadsTab";
import AreaTab from "./components/areaTab/AreaTab";
import RegionTabs from "./components/regionTab/RegionTab";
import CityTab from "./components/cityTab/CityTab";
import DestinationTab from "./components/destinationTab/DestinationTab";
import ActivityTab from "./components/activityTab/ActivityTab";
import { useSelector } from "react-redux";
import NewsTab from "./components/newsTab/NewsTab";
import SuggestionsTab from "./components/SuggestionsTab";
import EmailTab from "./components/EmailTab";
import ShopServiceTab from "./components/ShopServiceTab";
import CollectorTab from "./components/CollectorTab";
import UsersTab from "./components/usersTab/UsersTab";
import VideosTab from "./components/videosTab/VideosTab";
import ShopsTab from "./components/shopsTab/ShopsTab";
import StatsTab from "./components/statsTab/StatsTab";
import TrackMapTab from "./components/trackMapTab/TrackMapTab";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "clients";
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [leads, setLeads] = useState([]);
  const [countries, setCountries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const data = {
    leads,
    setLeads,
    countries,
    setCountries,
    areas,
    setAreas,
    cities,
    setCities,
    destinations,
    setDestinations,
    activities,
    setActivities,
  };
  const renderTab = () => {
    switch (tab) {
      case "stats":
        return <StatsTab active={tab === "stats"} />;

      case "shops":
        return <ShopsTab darkMode={darkMode} />;

      case "collector":
        return <CollectorTab darkMode={darkMode} active={tab === "collector"} />;

      case "clients":
        return (
          <ClientLeadsTab
            darkMode={darkMode}
            active={tab === "clients"}
            data={data}
          />
        );
      case "country":
        return (
          <CountryTab
            darkMode={darkMode}
            active={tab === "country"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "area":
        return (
          <AreaTab
            darkMode={darkMode}
            active={tab === "area"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "region":
        return (
          <RegionTabs
            darkMode={darkMode}
            active={tab === "region"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "city":
        return (
          <CityTab
            darkMode={darkMode}
            active={tab === "city"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "destination":
        return (
          <DestinationTab
            darkMode={darkMode}
            active={tab === "destination"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "activity":
        return (
          <ActivityTab
            darkMode={darkMode}
            active={tab === "activity"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "services":
        return (
          <ShopServiceTab darkMode={darkMode} active={tab === "services"} />
        );
      case "users":
        return <UsersTab darkMode={darkMode} active={tab === "users"} />;
      case "news":
        return (
          <NewsTab
            darkMode={darkMode}
            active={tab === "news"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "suggestions":
        return (
          <SuggestionsTab
            darkMode={darkMode}
            active={tab === "suggestions"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "emails":
        return (
          <EmailTab
            darkMode={darkMode}
            active={tab === "emails"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "videos":
        return (
          <VideosTab
            darkMode={darkMode}
            active={tab === "videos"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
      case "trackmap":
        return <TrackMapTab />;
      default:
        return (
          <ClientLeadsTab
            darkMode={darkMode}
            active={tab === "clients"}
            data={[
              leads,
              setLeads,
              countries,
              setCountries,
              areas,
              setAreas,
              cities,
              setCities,
              destinations,
              setDestinations,
              activities,
              setActivities,
            ]}
          />
        );
    }
  };

  const setTab = (newTab, value) => {
    navigate(`/admin?tab=${newTab}&value=${value || ""}`);
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-[1fr_7fr] max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] justify-start">
        <aside className="flex flex-col py-12 px-4 border-r-2 border-main-500 bg-main-100 dark:bg-main-900">
          <ul className="flex flex-col gap-4 pt-2 px-4 text-sm">
            <li className={`button`} onClick={() => setTab("stats")}>
              Stats
            </li>
            <li className={`button`} onClick={() => setTab("users")}>
              Users
            </li>
            <li className={`button `} onClick={() => setTab("clients")}>
              Client Leads
            </li>
            <li className={`button `} onClick={() => setTab("country")}>
              Countries
            </li>
            <li className={`button`} onClick={() => setTab("area")}>
              Areas
            </li>
            <li className={`button`} onClick={() => setTab("region")}>
              Regions
            </li>
            <li className={`button `} onClick={() => setTab("city")}>
              Cities
            </li>
            <li className={`button `} onClick={() => setTab("destination")}>
              Destinations
            </li>
            <li className={`button `} onClick={() => setTab("activity")}>
              Activities
            </li>
            <li className={`button `} onClick={() => setTab("shops")}>
              Shops
            </li>
            <li className={`button `} onClick={() => setTab("collector")}>
              Collector
            </li>
            <li className={`button `} onClick={() => setTab("services")}>
              Services
            </li>
            <li className={`button`} onClick={() => setTab("news")}>
              News
            </li>
            <li className={`button `} onClick={() => setTab("emails")}>
              Emails
            </li>
            <li className={`button `} onClick={() => setTab("suggestions")}>
              Suggestions
            </li>
            <li>
              <div className={`button `} onClick={() => setTab("videos")}>
                Videos
              </div>
            </li>
            <li className={`button`} onClick={() => setTab("trackmap")}>
              Mapa
            </li>
            <li>
              <Link to={"/my-profile"} className={`button `}>
                Shop Test
              </Link>
            </li>
            {/* Agregar más botones según sea necesario */}
          </ul>
        </aside>
        <div className="max-w-full py-0 px-4 overflow-x-auto bg-main-100 dark:bg-main-900">
          {renderTab()}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Admin;
