import { useState } from "react";
import getInfo from "@/services/getInfo";
import { Box, TextField } from "@mui/material";
import styles from "./placeSearch.module.css";
import { Link } from "react-router-dom";

const PlaceSearch = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  async function handleEvent(event) {
    if (query === " ") {
      setQuery("");
    }
    if (query !== "") {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        setResults([]);
        getInfo(query).then((data) => setResults(data.body.results));
      }
      if (
        /^[a-zA-Z]$/.test(event.key) ||
        /^\d$/.test(event.key) ||
        event.key === " " ||
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Space"
      ) {
        getInfo(query).then((data) => setResults(data.body.results));
        query === "" && setResults([]);
      }
    } else {
      setResults([]);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.searchTitle}>🔍 Search Places</h2>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          label="Search destinations, cities, regions..."
          placeholder="Type to search..."
          fullWidth
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          className={styles.input}
          onKeyUp={(event) => handleEvent(event)}
          variant="standard"
        />
      </Box>
      <div className={styles.resultContainer}>
        {results.map((place, key) => {
          return (
            <Link
              key={key}
              className={styles.resultCard}
              to={`/${place.table}/${place.id}`}
              reloadDocument
            >
              <p className={styles.resultName}>
                {place.name}
                <span className={styles.resultTable}>({place.table})</span>
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PlaceSearch;
