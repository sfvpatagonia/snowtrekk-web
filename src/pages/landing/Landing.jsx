import Footer from "@/components/footer/Footer";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import { useGeoRegion } from "./hooks/useGeoRegion";

const Landing = () => {
  const { regionData } = useGeoRegion();

  return (
    <>
      <LandingNav regionData={regionData} />
      <HeroSection regionData={regionData} />
      <Footer />
    </>
  );
};

export default Landing;
