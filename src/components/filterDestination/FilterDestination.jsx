import React, { useState, useEffect } from "react";
import styles from "./filterDestination.module.css";

const guideData = [
  {
    id: 1,
    destination: "Tienda de Montañismo Aventura",
    location: {
      country: "Argentina",
      province: "Mendoza",
      city: "Cacheuta",
    },
    activity: ["senderismo", "escalada"],
  },
  {
    id: 2,
    destination: "Montañas Equipamiento",
    location: {
      country: "Argentina",
      province: "Mendoza",
      city: "San Rafael",
    },
    activity: ["snowboard", "paseo"],
  },
  {
    id: 3,
    destination: "Alpes Outdoors",
    location: {
      country: "Argentina",
      province: "Neuquén",
      city: "San Martín de los Andes",
    },
    activity: ["senderismo", "clases"],
  },
  {
    id: 4,
    destination: "Cumbres Extremas",
    location: {
      country: "Chile",
      province: "Santiago",
      city: "Santiago",
    },
    activity: ["sky", "escalada", "paseo"],
  },
  {
    id: 5,
    destination: "Andes Adventure Store",
    location: {
      country: "Chile",
      province: "Valparaíso",
      city: "Viña del Mar",
    },
    activity: ["sky", "snowboard"],
  },
];

const FilterDestination = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [uniqueActivities, setUniqueActivities] = useState([]);

  useEffect(() => {
    const allActivities = guideData.reduce(
      (activities, destination) => activities.concat(destination.activity),
      []
    );
    const uniqueActivities = [...new Set(allActivities)];
    setUniqueActivities(uniqueActivities);
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    if (country === "") {
      setSelectedProvince("");
      setSelectedCity("");
      setSelectedDestination("");
    }
    if (country !== selectedCountry) {
      setSelectedProvince("");
      setSelectedCity("");
      setSelectedDestination("");
    }
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    const countryOfProvince = guideData.find(
      (item) => item.location.province === province
    );
    if (countryOfProvince) {
      const selectedCountry = countryOfProvince.location.country;
      setSelectedCountry(selectedCountry);
    }

    // SI EL USUARIO VUELVE A SELECCIONAR ANY O CAMBIA EL VALOR DEL CAMPO, ENTONCES TODOS LOS POSTERIORES PASAN A ANY
    if (province === "") {
      setSelectedCity("");
      setSelectedDestination("");
    }
    if (province !== selectedProvince) {
      setSelectedCity("");
      setSelectedDestination("");
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const locationOfCity = guideData.find(
      (item) => item.location.city === city
    );
    if (locationOfCity) {
      const selectedCountry = locationOfCity.location.country;
      const selectedProvince = locationOfCity.location.province;
      setSelectedCountry(selectedCountry);
      setSelectedProvince(selectedProvince);
    }

    // SI EL USUARIO VUELVE A SELECCIONAR ANY O CAMBIA EL VALOR DEL CAMPO, ENTONCES TODOS LOS POSTERIORES PASAN A ANY
    if (city === "") {
      setSelectedDestination("");
    }
    if (city !== selectedCity) {
      setSelectedDestination("");
    }
  };

  const handleDestinationChange = (destination) => {
    setSelectedDestination(destination);
    const locationOfDestination = guideData.find(
      (item) => item.destination === destination
    );
    if (locationOfDestination) {
      const selectedCountry = locationOfDestination.location.country;
      const selectedProvince = locationOfDestination.location.province;
      const selectedCity = locationOfDestination.location.city;
      setSelectedCountry(selectedCountry);
      setSelectedProvince(selectedProvince);
      setSelectedCity(selectedCity);
    }
  };

  const handleActivityChange = (activity) => {
    setSelectedActivity(activity);
  };

  // const handleViewDestination = () => {
  //   console.log("Información Seleccionada:", {
  //     country: selectedCountry,
  //     province: selectedProvince,
  //     city: selectedCity,
  //     destination: selectedDestination,
  //     activity: selectedActivity,
  //   });
  // };

  const uniqueCountries = [
    ...new Set(guideData.map((item) => item.location.country)),
  ];

  const uniqueProvince = [
    ...new Set(guideData.map((item) => item.location.province)),
  ];

  const uniqueCity = [...new Set(guideData.map((item) => item.location.city))];

  const uniqueDestination = [
    ...new Set(guideData.map((item) => item.destination)),
  ];

  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(10000);

  return (
    <>
      <div className={styles.padre}>
        <div>
          <p className={styles.subtitle}>Mountain Guide Global Services</p>

          <div className={styles.rangeSlider}>
            <input
              type="range"
              min="2000"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className={`${styles.rangeInput} ${styles.rangeInputMin}`}
            />
            {/* <input
            type="range"
            min="2000"
            max="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className={`${styles.rangeInput} ${styles.rangeInputMax}`}
          /> */}
            <div className={styles.sliderValue}>
              <p>
                Rango de precios: ${minPrice} - ${maxPrice}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.containerGuide}>
          <select
            onChange={(e) => handleCountryChange(e.target.value)}
            value={selectedCountry}
          >
            <option value="">Dificultad</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <>
            <select
              onChange={(e) => handleProvinceChange(e.target.value)}
              value={selectedProvince}
            >
              <option value="">Duracion</option>
              {uniqueProvince.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </>

          <>
            <select
              onChange={(e) => handleCityChange(e.target.value)}
              value={selectedCity}
            >
              <option value="">Actividad</option>
              {uniqueCity.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </>

          <>
            <select
              onChange={(e) => handleDestinationChange(e.target.value)}
              value={selectedDestination}
            >
              <option value="">Calificacion</option>
              {uniqueDestination.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </>

          <>
            <select
              onChange={(e) => handleActivityChange(e.target.value)}
              value={selectedActivity}
            >
              <option value="">Bariloche</option>
              {uniqueActivities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </>

          <>
            <select
              onChange={(e) => handleActivityChange(e.target.value)}
              value={selectedActivity}
            >
              <option value="">Frecuencia</option>
              {uniqueActivities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </>

          <>
            <select
              onChange={(e) => handleActivityChange(e.target.value)}
              value={selectedActivity}
            >
              <option value="">Participantes</option>
              {uniqueActivities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </>

          {(selectedCountry ||
            selectedProvince ||
            selectedCity ||
            selectedDestination ||
            selectedActivity) && (
            <button
              onClick={handleViewDestination}
              className={styles.destinationBtn}
            >
              See Destination
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterDestination;
