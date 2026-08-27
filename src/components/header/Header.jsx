import { useState, useEffect } from "react";
import logo from "@/assets/logoST.png"; // LOGO PROVISORIO
import defaultAvatar from "@/assets/bonfire.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { changeTheme } from "@/redux/themeSlice";
// icons
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "./components/CartDrawer";
import { Badge } from "@mui/material";
import NotificationButton from "./notificationButton/NotificationButton";
import HeaderMobile from "./components/HeaderMobile.jsx";
import DrawerGuide from "../DrawerGuide.jsx";

import { fetchDestinations } from "@/redux/destinationSlice";
import { fetchAreas } from "@/redux/areaSlice";
import { fetchCities } from "@/redux/citySlice";
import { fetchRegions } from "@/redux/regionSlice";
import { fetchActivities } from "@/redux/activitySlice";
import { fetchCountries } from "../../redux/countrySlice.js";
import {
  setSelectedActivity,
  setSelectedArea,
  setSelectedCity,
  setSelectedCountry,
  setSelectedDestination,
  setSelectedRegion,
} from "@/redux/guideSlice.js";

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [openGuide, setOpenGuide] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const dispatch = useDispatch();

  const countryStatus = useSelector((state) => state.countries.status);
  const destinationStatus = useSelector((state) => state.destinations.status);
  const cityStatus = useSelector((state) => state.cities.status);
  const areaStatus = useSelector((state) => state.areas.status);
  const regionStatus = useSelector((state) => state.regions.status);
  const activityStatus = useSelector((state) => state.activities.status);

  useEffect(() => {
    const states = [
      { status: countryStatus, thunk: fetchCountries },
      { status: destinationStatus, thunk: fetchDestinations },
      { status: cityStatus, thunk: fetchCities },
      { status: areaStatus, thunk: fetchAreas },
      { status: regionStatus, thunk: fetchRegions },
      { status: activityStatus, thunk: fetchActivities },
    ];

    states.forEach(({ status, thunk }) => {
      if (status === "idle") {
        dispatch(thunk());
      }
    });
  }, [
    dispatch,
    countryStatus,
    destinationStatus,
    cityStatus,
    areaStatus,
    regionStatus,
    activityStatus,
  ]);

  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const section = pathParts[0]; // 'destination', 'area', etc.
    const id = pathParts[1] || "";

    // Lista de secciones válidas del guide
    const mapping = {
      destination: setSelectedDestination,
      area: setSelectedArea,
      activity: setSelectedActivity,
      city: setSelectedCity,
      region: setSelectedRegion,
      country: setSelectedCountry,
    };

    if (mapping[section]) {
      // Si la URL coincide con una sección, seteamos el ID correspondiente
      dispatch(mapping[section](id));
    } else {
      // Si no coincide con nada, reseteamos todo
      dispatch(setSelectedDestination(""));
      dispatch(setSelectedArea(""));
      dispatch(setSelectedActivity(""));
      dispatch(setSelectedCity(""));
      dispatch(setSelectedRegion(""));
      dispatch(setSelectedCountry(""));
    }
  }, [location.pathname, dispatch]);

  const toggleDarkMode = () => {
    dispatch(changeTheme(!darkMode));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    if (darkMode !== null) {
      return;
    }

    dispatch(changeTheme(prefersDark.matches));

    const handleChange = (e) => {
      dispatch(changeTheme(e.matches));
    };

    prefersDark.addEventListener("change", handleChange);
    return () => prefersDark.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <header className="flex justify-evenly items-center bg-[#444] h-max">
      {/* Logo */}
      <div className="flex h-[60px]">
        <Link to="/" className="flex h-full items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-full w-auto object-contain p-1"
          />
        </Link>
      </div>

      {/* Nav principal */}
      <nav className="hidden sm:flex">
        <ul className="flex gap-5 items-baseline">
          <li
            className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
            onClick={() => setOpenGuide(true)}
          >
            Search
          </li>
          <li>
            <Link
              to="/news"
              className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
            >
              News
            </Link>
          </li>
          {/* <li>
            <Link
              to="/shop"
              className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
            >
              Shop
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* Controles personales */}
      <div className="hidden sm:flex gap-8 items-center">
        {user.id ? (
          <Link
            to="/my-profile"
            className="flex items-center gap-2 text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
          >
            <img
              src={user.image || defaultAvatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
            {user.name}
          </Link>
        ) : (
          <Link
            to="/join"
            className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
          >
            Sumate
          </Link>
        )}

        <button
          onClick={toggleDarkMode}
          className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
        >
          {darkMode ? <DarkModeIcon /> : <WbSunnyIcon />}
        </button>

        <Link
          onClick={() => setOpenCart(true)}
          className="text-[#f3f3f3] transition-all duration-300 text-[1.15em] relative cursor-pointer hover:text-[var(--color-500)]"
        >
          <Badge
            badgeContent={cart.totalQuantity > 99 ? "99+" : cart.totalQuantity}
            color="primary"
          />
          <ShoppingCartIcon />
        </Link>

        <NotificationButton />
      </div>

      {/* Guide */}
      {openGuide && <DrawerGuide open={openGuide} setOpen={setOpenGuide} />}
      {/* Header Mobile */}
      {isMobile && (
        <HeaderMobile setOpenCart={setOpenCart} setOpenGuide={setOpenGuide} />
      )}

      {/* Dropdown y Cart Drawer */}
      <CartDrawer open={openCart} setOpen={setOpenCart} />
      </header>

      {/* Aviso temporal — la plataforma está en ajustes */}
      <div className="w-full bg-[var(--color-500)]/10 border-b border-[var(--color-500)]/25 py-1.5 px-4 text-center">
        <p className="text-xs sm:text-sm text-[#333] dark:text-[#f3f3f3]">
          Estamos afinando la plataforma — algunas funciones pueden variar en los próximos días.
        </p>
      </div>
    </>
  );
};

export default Header;
