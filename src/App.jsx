import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import "./App.css";
import ActivityGuide from "./pages/ActivityGuide";
import DestinationGuide from "./pages/DestinationGuide";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Service from "./pages/service/Service";
import Login from "./pages/LogIn";
import Admin from "./pages/admin/Admin";
import RegionGuide from "./pages/RegionGuide";
import Area from "./pages/AreaGuide";
import News from "./pages/news/News";
import CityGuide from "./pages/CityGuide";
//private route
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";
import BusinessRoute from "./utils/BusinessRoute";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import ShopProfile from "./pages/shopProfile/ShopProfile";
import MyProfile from "./pages/myProfile/MyProfile";
import Shop from "./pages/shop/Shop";
import ShopChat from "./pages/shopChat/ShopChat";
import Maintenance from "./pages/maintenance/Maintenance";
import AvailabilityTab from "./pages/shopProfile/components/availabilityTab/AvailabilityTab";
import SalesTab from "./pages/shopProfile/components/salesTab/SalesTab";
import UpdateServiceTab from "./pages/shopProfile/components/updateServiceTab/UpdateServiceTab";
import UserChat from "./pages/userChat/UserChat";
import Landing from "./pages/landing/Landing";
import Explore from "./pages/landing/Explore";
import CountryGuide from "./pages/CountryGuide";
import CheckoutPage from "./pages/CheckoutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import CancellationPolicyPage from "./pages/CancellationPolicyPage";
import AboutUs from "./pages/AboutUs";
import UserPage from "./pages/UserPage";
import StoreRegister from "./pages/storeRegister/StoreRegister";
import CredentialsLogin from "./pages/credentialsLogin/CredentialsLogin";
import BusinessActivate from "./pages/businessActivate/BusinessActivate";
import BusinessDashboard from "./pages/businessDashboard/BusinessDashboard";

import ConsentManager from "./components/ConsentManager";
import ConsentPreferencesModal from "./components/ConsentPreferencesModal";
import SnowtrekAIChat from "./components/SnowtrekAIChat/SnowtrekAIChat";
import VisitorTracker from "./components/VisitorTracker";
import SilentAuth from "./components/SilentAuth";
import VerifyEmail from "./pages/VerifyEmail";
import TravelerJoin from "./pages/TravelerJoin";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#f909b4",
        dark: "#002884",
        contrastText: "var(--color-0)",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <VisitorTracker />
      <SilentAuth />
      <ConsentManager />
      <ConsentPreferencesModal />
      <Router>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" Component={Admin} />
          </Route>

          <Route element={<BusinessRoute />}>
            <Route path="/business/dashboard" Component={BusinessDashboard} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/my-profile" Component={MyProfile} />
            <Route path="/checkout" Component={CheckoutPage} />
            <Route path="/explore" Component={Explore} />

            <Route path="/my-shop" Component={ShopProfile} />
            <Route
              path="/my-shop/add-availability"
              Component={AvailabilityTab}
            />
            <Route
              path="/my-shop/update-service"
              Component={UpdateServiceTab}
            />
            <Route path="sales" element={<SalesTab />} />
            <Route path="/shop/:id/chat/:idOrder" Component={ShopChat} />
            <Route path="/user/:id/chat/:idOrder" Component={UserChat} />
            <Route path="/shop/:id" Component={Shop} />
            <Route path="/user/:id" Component={UserPage} />
          </Route>

          <Route exact path="/news" Component={News} />
          <Route exact path="/" Component={Landing} />
          <Route path="*" Component={NotFound} />
          <Route path="/maintenance" Component={Maintenance} />

          <Route
            path="/destination/:destination"
            Component={DestinationGuide}
          />

          {/* geograficos */}
          <Route path="/country/:country" Component={CountryGuide} />
          <Route path="/region/:region" Component={RegionGuide} />
          <Route path="/area/:area" Component={Area} />
          <Route path="/city/:city" Component={CityGuide} />

          <Route path="/activity/:activity" Component={ActivityGuide} />
          {/* <Route path="/channel/" Component={Channel} />
          <Route path="/shorts/" Component={Short} /> */}
          <Route path="/service/:id" Component={Service} />
          <Route path="/login" Component={Login} />
          <Route path="/verify-email" Component={VerifyEmail} />
          <Route path="/join" Component={TravelerJoin} />
          <Route path="/stores/register" Component={StoreRegister} />
          <Route
            path="/admin/login"
            element={<CredentialsLogin allowedRole="admin" />}
          />
          <Route
            path="/business/login"
            element={<CredentialsLogin allowedRole="business" />}
          />
          <Route path="/business/activate" Component={BusinessActivate} />

          {/* 
        LEGAL
         */}

          <Route
            exact
            path="/legal/privacy-policy"
            Component={PrivacyPolicyPage}
          />
          <Route
            exact
            path="/legal/terms-and-conditions"
            Component={TermsAndConditionsPage}
          />
          <Route
            exact
            path="/legal/cancellation-policy"
            Component={CancellationPolicyPage}
          />
          <Route exact path="/legal/about-us" Component={AboutUs} />

          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
      <SnowtrekAIChat />
    </ThemeProvider>
  );
}

export default App;



