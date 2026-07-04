import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import styles from "./short.module.css";
import FilterVideosShort from "@/components/filterVideosShort/FilterVideosShort";
import VideoShortPlayer from "@/components/videoShortPlayer/VideoShortPlayer";
import AdCard from "@/components/adCard/AdCard";
import PublicIcon from "@mui/icons-material/Public";
import StoreIcon from "@mui/icons-material/Store";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterVideosShortMobile from "@/components/filterVideosShortsMobile/FilterVideosShortsMobile";
import Guide2 from "@/components/guide/Guide2";

const Short = () => {
  const [videoMetaData, setVideoMetadata] = useState({
    title: "Snowboard - Bariloche",
    activity: ["Snowboard"],
    destination: ["Cerro Catedral", "Bariloche", "Río Negro", "Argentina"],
    url: "URL del video",
  });
  const items = [
    { name: "Skis 4FRNT Raven", price: "759.00" },
    //{ name: "Skis 4FRNT Devastator", price: "769.00" },
    //{ name: "Skis 4FRNT Devastator", price: "769.00" },
    //{ name: "Skis 4FRNT Devastator", price: "769.00" },
  ];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.subContainer}>
        {windowWidth < 768 ? (
          <FilterVideosShortMobile
            videoMetaData={videoMetaData}
            setVideoMetadata={setVideoMetadata}
          />
        ) : (
          <FilterVideosShort
            videoMetaData={videoMetaData}
            setVideoMetadata={setVideoMetadata}
            windowWidth={windowWidth}
          />
        )}
        <div className={styles.mainContainer}>
          <VideoShortPlayer
            videoMetaData={videoMetaData}
            setVideoMetadata={setVideoMetadata}
          />
          {windowWidth > 500 && (
            <>
              <div className={styles.sideContainer}>
                {items.map((item, index) => {
                  return <AdCard item={item} key={index} color={true} />;
                })}
                <div className={styles.buttonContainer}>
                  <Link
                    to={`/store/${videoMetaData.activity}`}
                    className="button"
                  >
                    <PublicIcon />
                    Travel
                  </Link>

                  <Link
                    to={`/destination/${videoMetaData.destination}`}
                    className="button"
                  >
                    <StoreIcon />
                    Store
                  </Link>
                </div>
              </div>
              <div className={styles.guideContainer}>
                <Guide2 />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Short;
