import React, { useState } from "react";
import styles from "./FilterVideos.module.css";
import logo from "@/assets/logoST.png";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ExploreIcon from "@mui/icons-material/Explore";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import { Link } from "react-router-dom";

const FilterVideos = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <section className={styles.containerGuia}>
        <img src={logo} alt="snowtrekk Logo" className={styles.logoGuide} />

        <div className={styles.directoryContainer}>
          <div className={styles.directory}>
            <p className={styles.subtitle}>Type of Content</p>
            <Link to={"/channel"} className={styles.buttonChannel}>
              <LiveTvIcon />
              Channel
            </Link>

            <Link to={"/shorts"} className={styles.buttonChannel}>
              <PhoneAndroidIcon />
              Shorts
              {/* Community */}
            </Link>
          </div>
          <hr className={styles.divider} />
          <div className={styles.directory}>
            <p className={styles.subtitle}>Channel Filters</p>
            <button
              type="button"
              className={styles.buttonChannel}
              onClick={toggleDropdown}
            >
              <ExploreIcon /> Destination
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem}>Argentina</div>
                <div className={styles.dropdownItem}>Chile</div>
                <div className={styles.dropdownItem}>Brasil</div>
              </div>
            )}
            <button className={styles.buttonChannel} type="button">
              <SnowshoeingIcon /> Activity
            </button>

            <button className="button">Search</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterVideos;
