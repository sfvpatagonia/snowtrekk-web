import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import styles from "./channel.module.css";
import Advertise from "@/components/advertise/Advertise";
import FilterVideos from "@/components/filterVideos/FilterVideos";
import Ads from "@/components/Ads/Ads";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import { Link } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import StoreIcon from "@mui/icons-material/Store";
import Guide2 from "@/components/guide/Guide2";

const Channel = () => {
  const videoMetaData = {};
  return (
    <div>
      <Header />
      <div className={styles.subContainer}>
        <FilterVideos />
        <main className={styles.mainContainer}>
          <VideoPlayer />
          <div className={styles.menuContainer}>
            <div className={styles.advertise}>
              <Advertise videoMetaData={videoMetaData} />
            </div>

            <div className={styles.buttonContainer}>
              <Link to={`/store/${videoMetaData.activity}`} className="button">
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
        </main>
        <div className={styles.guide}>
          <Guide2 />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Channel;
