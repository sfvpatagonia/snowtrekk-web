import { useState, useEffect } from 'react';
import { getRegionData } from '../data/regionContent';

export function useGeoRegion() {
  const [regionData, setRegionData] = useState(getRegionData(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setRegionData(getRegionData(data.country_code));
      })
      .catch(() => {
        // silently fall back to DEFAULT on network errors
      })
      .finally(() => setLoading(false));
  }, []);

  return { regionData, loading };
}
