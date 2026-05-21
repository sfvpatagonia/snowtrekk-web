import styles from "./filterVideosShortMobile.module.css";
import logo from "@/assets/logoST.png";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ExploreIcon from "@mui/icons-material/Explore";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import { Link } from "react-router-dom";
import { useState } from "react";

const FilterVideosShortMobile = ({ videoMetaData, setVideoMetaData }) => {
  const [isOpen, setIsOpen] = useState("");

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
  const itemList = isOpen === "Destination" ? destinations : activities;
  const [selectedDestination, setSelectedDestination] = useState(
    videoMetaData.destination[1]
  );
  const [selectedActivity, setSelectedActivity] = useState(
    videoMetaData.activity[0]
  );
  const selectedItem =
    isOpen === "Destination" ? selectedDestination : selectedActivity;
  const setSelectedItem =
    isOpen === "Destination" ? setSelectedDestination : setSelectedActivity;
  return (
    <>
      <aside className={styles.container}>
        <div className={styles.selector}>
          <Link to={"/channel"} className={styles.buttonChannel}>
            <LiveTvIcon />
          </Link>

          <Link to={"/shorts"} className={styles.buttonChannel}>
            <PhoneAndroidIcon />
            {/* Community */}
          </Link>
        </div>
        <div className={styles.filterContainer}>
          <button
            type="button"
            className={styles.buttonChannel}
            onClick={() => setIsOpen("Destination")}
          >
            <ExploreIcon />
          </button>
          <button
            type="button"
            className={styles.buttonChannel}
            onClick={() => setIsOpen("Activity")}
          >
            <SnowshoeingIcon />
          </button>
        </div>
        <div className={styles.filterContainer}>
          <button
            type="button"
            className={styles.buttonChannel}
            onClick={() => setIsOpen("Guide")}
          >
            <TravelExploreIcon />
          </button>
        </div>
      </aside>
      {isOpen === "Destination" || isOpen === "Activity" ? (
        <div className={styles.modal}>
          <ul className={styles.listContainer}>
            {itemList.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={selectedItem === item && styles.active}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className={styles.modal}>+</div>
      )}
    </>
  );
};

export default FilterVideosShortMobile;
