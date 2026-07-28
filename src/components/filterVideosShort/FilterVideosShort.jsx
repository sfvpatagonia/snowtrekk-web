import { useState } from "react";
import styles from "./filterVideosShort.module.css";
import logo from "@/assets/logoST.png";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ExploreIcon from "@mui/icons-material/Explore";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import { Link } from "react-router-dom";
import FilterList from "../filterList/FilterList";
import FilterSelect from "../filterSelect/FilterSelect";

const FilterVideosShort = ({
  videoMetaData,
  setVideoMetaData,
  windowWidth,
}) => {
  const activities = [
    "Arborismo",
    "Arquería y Paintball",
    "Ascenso",
    "Backcountry",
    "Baño de Bosque",
    "Bicicleta",
    "Bodegas",
    "Buceo",
    "Bungee & Puenting",
    "Cabalgata",
    "Canoa y Remo",
    "Canopy - Tirolesa",
    "Citytour",
    "Clases y Cursos",
    "Escalada",
    "Esquí",
    "Esquí Acuático y Wakeboard",
    "Excursión",
    "Expedición & Travesía",
    "Fotografía",
    "Globo Aerostático y Parasailing",
    "Golf",
    "Guía Privado",
    "Hidrospeed - Coolriver",
    "Kayak - Doky",
    "Minas & Arqueología",
    "Moto y Cuatriciclo",
    "Navegación",
    "Observación Naturaleza",
    "Otros",
    "Parapente - Paracaídas",
    "Parque Aventura",
    "Pase",
    "Pesca",
    "Planeador - Aladeltismo",
    "Rafting",
    "Rapel",
    "Raquetas de nieve",
    "Safari Fotográfico",
    "Snowboard",
    "Spa, Yoga y Meditación",
    "Stand Up Paddle",
    "Todoterreno & 4X4",
    "Trail Running",
    "Traslados",
    "Trekking",
    "Trineo",
    "Tubing & SnowTubing",
    "Windsurf - Surf",
  ];
  const destinations = [
    "San Martin de los Andes",
    "Ushuaia",
    "Bariloche",
    "Neuquen",
    "Villa la Angostura",
    "Mendoza",
    "Malargue",
    "Santiago",
    "Santa Cruz",
    "Esquel",
    "El Bolson",
    "Wyoming",
    "Trentino - Alto Adige",
    "California",
    "Aosta",
    "Westschweiz und Wallis",
    "Genova",
    "Lleida",
    "Madrid",
    "Huesca",
    "Granada",
    "Buenos Aires",
    "Pyrenees Andorra",
    "Hokkaido",
    "San Luis",
    "San Juan",
    "Junin de los Andes",
    "El Chalten",
    "Rio Grande",
    "Tierra del Fuego",
    "Cordoba",
    "Savoya",
    "Haute-Savoie",
    "Isere",
    "Pyrenees Atlantiques",
    "Hautes Pyrenees",
    "Ariege Pyrenees",
    "Southern Alps",
    "Pyrenees Orientales",
    "Jura",
    "Auvergne",
    "Haute Garonne",
    "Valley of Isere",
    "Rosario",
    "Valais",
    "Grimentz",
    "Morgins",
    "Western Switzerland and Valais",
  ];

  const [selectedDestination, setSelectedDestination] = useState(
    videoMetaData.destination[1],
  );
  const [selectedActivity, setSelectedActivity] = useState(
    videoMetaData.activity[0],
  );

  return (
    <section className={styles.containerGuia}>
      <div className={styles.row}>
        <img src={logo} alt="snowtrekk Logo" className={styles.logoGuide} />

        <div className={styles.directory}>
          <p className={styles.subtitle}>Mountain Guide Global Services</p>
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
      </div>
      <hr className={styles.divider} />
      <div className={styles.directoryContainer}>
        <p className={styles.subtitle}>Filters</p>

        <div className={styles.secondRow}>
          <div className={styles.column}>
            <h2 className={styles.filterTitle}>
              <ExploreIcon /> Destination
            </h2>
            {windowWidth < 1024 ? (
              <FilterSelect
                itemList={destinations}
                selectedItem={selectedDestination}
                setSelectedItem={setSelectedDestination}
              />
            ) : (
              <FilterList
                itemList={destinations}
                selectedItem={selectedDestination}
                setSelectedItem={setSelectedDestination}
              />
            )}
          </div>
          <div className={styles.column}>
            <h2 className={styles.filterTitle}>
              <SnowshoeingIcon /> Activity
            </h2>
            {windowWidth < 1024 ? (
              <FilterSelect
                itemList={activities}
                selectedItem={selectedActivity}
                setSelectedItem={setSelectedActivity}
              />
            ) : (
              <FilterList
                itemList={activities}
                selectedItem={selectedActivity}
                setSelectedItem={setSelectedActivity}
              />
            )}
          </div>
        </div>
        <button className="button" type="button">
          Search
        </button>
      </div>
    </section>
  );
};

export default FilterVideosShort;
