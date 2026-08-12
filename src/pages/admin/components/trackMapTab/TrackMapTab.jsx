import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Marker,
  Popup,
  CircleMarker,
  Polyline,
  LayerGroup,
  GeoJSON,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import jorgeFieldPointsRaw from '@/comparacion_ign_real_vs_gps_limpio.csv?raw';
import osmPistesGeoJSON from '@/lasLenasOsmPistes.json';

// Fix Leaflet's default icon paths broken by Vite's asset pipeline
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIcon2xPng,
  shadowUrl: markerShadowPng,
});

// Las Leñas, Mendoza, Argentina
const LAS_LENAS = { lat: -35.15, lng: -70.0833 };
const INITIAL_ZOOM = 14;

const IGN_HYBRID_URL =
  'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_hibrido@EPSG:3857@png/{z}/{x}/{-y}.png';

const IGN_TOPO_URL =
  'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{-y}.png';

const IGN_WMS_URL =
  'https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows';

// Root group layer — serves all available ortomosaico sub-layers in one request
const IGN_WMS_LAYER = 'vuelos_2011';

// Confirmed against GetCapabilities (wms.ign.gob.ar) — "lineas_hipsometricas":
// curva que une puntos de igual altitud (isohipsa / curva de nivel)
const IGN_CONTOUR_WMS_URL = 'https://wms.ign.gob.ar/geoserver/ows';
const IGN_CONTOUR_LAYER = 'ign:lineas_de_geomorfologia_CA010';

const ESRI_IMAGERY_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_ATTRIBUTION =
  'Tiles \u00a9 Esri \u2014 Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';

// Elevation-at-point via GeoServer's GetFeatureInfo, sampling a 1x1px "image"
// over a near-zero bbox centered on the clicked point (same trick IGN's own
// viewer uses internally for its "Perfil de Elevaci\u00f3n" tool). Undocumented
// but public \u2014 no auth required.
const IGN_ELEVATION_WMS_URL = 'https://imagenes.ign.gob.ar/geoserver/ows';
const IGN_ELEVATION_LAYER = 'geoprocesos:alos_unificado';

async function fetchIgnElevation(lat, lng) {
  const eps = 1e-7;
  const bbox = [lng, lat, lng + eps, lat + eps].join(',');
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    REQUEST: 'GetFeatureInfo',
    QUERY_LAYERS: IGN_ELEVATION_LAYER,
    LAYERS: IGN_ELEVATION_LAYER,
    INFO_FORMAT: 'application/json',
    FEATURE_COUNT: '1',
    X: '1',
    Y: '1',
    SRS: 'EPSG:4326',
    WIDTH: '1',
    HEIGHT: '1',
    BBOX: bbox,
  });

  const response = await fetch(`${IGN_ELEVATION_WMS_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`IGN elevation request failed: ${response.status}`);
  }
  const data = await response.json();
  const value = data?.features?.[0]?.properties?.GRAY_INDEX;
  if (typeof value !== 'number') {
    throw new Error('IGN elevation response missing GRAY_INDEX');
  }
  return value;
}

function formatElevation(elevation) {
  if (elevation === 'loading') return 'cargando...';
  if (elevation === 'error') return 'no disponible';
  if (typeof elevation === 'number') return `${Math.round(elevation)} m`;
  return null;
}

// Jorge's field-test GPS points, validated against IGN's real elevation (Step 1
// of the IGN integration work). Classified by |delta_m| = |IGN - GPS altitude|
// so unreliable GPS fixes stand out visually against the satellite base layer.
const RELIABILITY_COLORS = {
  reliable: '#22c55e',
  moderate: '#f97316',
  unreliable: '#ef4444',
};

function classifyReliability(deltaM) {
  const abs = Math.abs(deltaM);
  if (abs < 30) return 'reliable';
  if (abs < 100) return 'moderate';
  return 'unreliable';
}

function parseJorgeFieldPoints(raw) {
  const lines = raw.trim().split('\n');
  const rows = lines.slice(1); // skip header
  return rows
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [file, latitude, longitude, gpsAltitudeM, referenceElevationM, deltaM] =
        line.split(',');
      return {
        file,
        lat: Number(latitude),
        lng: Number(longitude),
        gpsAltitudeM: Number(gpsAltitudeM),
        referenceElevationM: Number(referenceElevationM),
        deltaM: Number(deltaM),
        reliability: classifyReliability(Number(deltaM)),
      };
    });
}

const JORGE_FIELD_POINTS = parseJorgeFieldPoints(jorgeFieldPointsRaw);

// Group by file; only files with 5+ points read as a continuous recording
// rather than a one-off test click.
const JORGE_FIELD_TRACKS = Array.from(
  JORGE_FIELD_POINTS.reduce((acc, point) => {
    if (!acc.has(point.file)) acc.set(point.file, []);
    acc.get(point.file).push(point);
    return acc;
  }, new Map())
)
  .filter(([, points]) => points.length >= 5)
  .map(([file, points]) => ({ file, points }));

// Real OSM piste/lift geometry for Las Leñas (Overpass API, way["piste:type"="downhill"]
// and way["aerialway"] within the resort's bbox). See lasLenasOsmPistes.json.
const AERIALWAY_COLOR = '#6b7280';

// Standard ski-map difficulty convention
const PISTE_DIFFICULTY_COLORS = {
  novice: '#22c55e',
  easy: '#3b82f6',
  intermediate: '#ef4444',
  advanced: '#111827',
};
const PISTE_DEFAULT_COLOR = '#a855f7';

const isAerialwayFeature = (feature) => Boolean(feature.properties.aerialway);
const isDownhillPisteFeature = (feature) => feature.properties.pisteType === 'downhill';

function aerialwayStyle() {
  return { color: AERIALWAY_COLOR, weight: 3, opacity: 0.85 };
}

function pisteStyle(feature) {
  const color =
    PISTE_DIFFICULTY_COLORS[feature.properties.pisteDifficulty] || PISTE_DEFAULT_COLOR;
  return { color, weight: 3, opacity: 0.85 };
}

function bindNamePopup(feature, layer) {
  if (feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const TrackMapTab = ({ geojsonPoints }) => {
  const [clickedPoint, setClickedPoint] = useState(null);
  // Elevation state machine: null (no query yet) | 'loading' | number (meters) | 'error'
  const [elevation, setElevation] = useState(null);
  const elevationRequestIdRef = useRef(0);

  const handleMapClick = (latlng) => {
    setClickedPoint(latlng);
    setElevation('loading');

    const requestId = ++elevationRequestIdRef.current;
    fetchIgnElevation(latlng.lat, latlng.lng)
      .then((value) => {
        if (elevationRequestIdRef.current === requestId) {
          setElevation(value);
        }
      })
      .catch(() => {
        if (elevationRequestIdRef.current === requestId) {
          setElevation('error');
        }
      });
  };

  return (
    <div style={{ padding: '16px', height: '100%' }}>
      <h2 style={{ marginBottom: '12px', fontSize: '1.2rem', fontWeight: 600 }}>
        Mapa — Las Leñas
      </h2>

      <div style={{ position: 'relative', width: '100%', height: '600px' }}>
        <MapContainer
          center={[LAS_LENAS.lat, LAS_LENAS.lng]}
          zoom={INITIAL_ZOOM}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Base layer switcher — top-right corner */}
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Esquemático">
              <TileLayer
                url={IGN_HYBRID_URL}
                attribution="IGN Argentina"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Imagen satelital">
              <WMSTileLayer
                url={IGN_WMS_URL}
                layers={IGN_WMS_LAYER}
                format="image/png"
                transparent={true}
                attribution="IGN Argentina - Ortomosaico"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked name="Satelital (Esri)">
              <TileLayer
                url={ESRI_IMAGERY_URL}
                attribution={ESRI_ATTRIBUTION}
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Argenmap Topográfico">
              <TileLayer
                url={IGN_TOPO_URL}
                attribution="Instituto Geográfico Nacional"
                maxNativeZoom={13}
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            {/* Contour line overlay — off by default, works on top of any base layer */}
            <LayersControl.Overlay name="Curvas de nivel (IGN)">
              <WMSTileLayer
                url={IGN_CONTOUR_WMS_URL}
                layers={IGN_CONTOUR_LAYER}
                format="image/png"
                transparent={true}
                version="1.3.0"
                attribution="IGN Argentina - Curvas de nivel"
              />
            </LayersControl.Overlay>

            {/* Jorge's field-test GPS points — off by default, color-coded by GPS reliability */}
            <LayersControl.Overlay name="Puntos de campo — Jorge">
              <LayerGroup>
                {JORGE_FIELD_TRACKS.map(({ file, points }) => (
                  <Polyline
                    key={`track-${file}`}
                    positions={points.map((p) => [p.lat, p.lng])}
                    pathOptions={{
                      color: '#3b82f6',
                      weight: 2,
                      opacity: 0.6,
                      dashArray: '4 6',
                    }}
                  />
                ))}

                {JORGE_FIELD_POINTS.map((point, index) => (
                  <CircleMarker
                    key={`point-${index}`}
                    center={[point.lat, point.lng]}
                    radius={5}
                    pathOptions={{
                      color: RELIABILITY_COLORS[point.reliability],
                      fillColor: RELIABILITY_COLORS[point.reliability],
                      fillOpacity: 0.85,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <strong>{point.file}</strong><br />
                      GPS altitude: {point.gpsAltitudeM.toFixed(1)} m<br />
                      IGN reference: {point.referenceElevationM.toFixed(1)} m<br />
                      Delta: {point.deltaM.toFixed(1)} m
                    </Popup>
                  </CircleMarker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Real OSM piste/lift geometry — off by default */}
            <LayersControl.Overlay name="Pistas oficiales (OSM)">
              <LayerGroup>
                <GeoJSON
                  data={osmPistesGeoJSON}
                  filter={isAerialwayFeature}
                  style={aerialwayStyle}
                  onEachFeature={bindNamePopup}
                />
                <GeoJSON
                  data={osmPistesGeoJSON}
                  filter={isDownhillPisteFeature}
                  style={pisteStyle}
                  onEachFeature={bindNamePopup}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>

          {/* Click handler — active regardless of which base layer is selected */}
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Temporary click marker */}
          {clickedPoint && (
            <Marker position={[clickedPoint.lat, clickedPoint.lng]}>
              <Popup>
                <strong>Punto seleccionado</strong><br />
                Lat: {clickedPoint.lat.toFixed(6)}<br />
                Lng: {clickedPoint.lng.toFixed(6)}<br />
                Elevación: {formatElevation(elevation)}
              </Popup>
            </Marker>
          )}

          {/* Optional geojsonPoints markers — future integration */}
          {Array.isArray(geojsonPoints) &&
            geojsonPoints.map((point, index) => (
              <Marker key={index} position={[point.lat, point.lng]}>
                <Popup>{point.label}</Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Floating lat/lng display panel */}
        {clickedPoint && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 18px',
              borderRadius: '6px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              zIndex: 1000,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Lat:&nbsp;{clickedPoint.lat.toFixed(6)}&nbsp;&nbsp;
            Lng:&nbsp;{clickedPoint.lng.toFixed(6)}&nbsp;&nbsp;|&nbsp;&nbsp;
            Elevación:&nbsp;{formatElevation(elevation)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackMapTab;
