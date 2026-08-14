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
import tigreRutaRaw from '@/test1_tigre_ruta.csv?raw';

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

// FDR field-test route (Tigre, Buenos Aires) — validates the new heading-change
// trigger and sampling interval against a real drive. Independent of Jorge's
// Las Leñas data and the OSM piste overlay.
const TIGRE_ROUTE_COLOR = '#7c3aed';
const TIGRE_SPEED_COLORS = {
  slow: '#6b7280', // < 20 km/h — urban
  normal: '#2563eb', // 20-60 km/h
  highway: '#7c3aed', // > 60 km/h
};

function classifyTigreSpeed(speedKmh) {
  if (speedKmh < 20) return 'slow';
  if (speedKmh <= 60) return 'normal';
  return 'highway';
}

function parseTigreRuta(raw) {
  const lines = raw.trim().split('\n');
  const rows = lines.slice(1); // skip header
  return rows
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [index, latitude, longitude, speedKmh, time] = line.split(',');
      return {
        index: Number(index),
        lat: Number(latitude),
        lng: Number(longitude),
        speedKmh: Number(speedKmh),
        time,
      };
    });
}

const TIGRE_ROUTE_POINTS = parseTigreRuta(tigreRutaRaw);

// Manual digitizing editor — traces lifts/pistes missing from OSM (Minerva, Caris,
// Apolo, Jupiter) directly over the satellite imagery. Purely client-side; output
// matches the GeoJSON conventions already used in lasLenasOsmPistes.json.
const MANUAL_ELEMENT_COLOR = '#eab308';
const PISTE_DIFFICULTY_OPTIONS = ['novice', 'easy', 'intermediate', 'advanced'];

function buildManualElementsGeoJSON(elements) {
  return {
    type: 'FeatureCollection',
    features: elements.map((el) => ({
      type: 'Feature',
      properties: {
        name: el.name,
        kind: el.kind,
        source: 'manual_digitized',
        digitizedAt: el.digitizedAt,
        ...(el.kind === 'piste' && el.difficulty ? { 'piste:difficulty': el.difficulty } : {}),
      },
      geometry: {
        type: 'LineString',
        coordinates: el.vertices.map((v) => [v.lng, v.lat]),
      },
    })),
  };
}

function parseManualElementsGeoJSON(geojson) {
  if (!geojson || !Array.isArray(geojson.features)) return [];
  return geojson.features.map((feature) => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [];
    return {
      name: props.name || '',
      kind: props.kind || 'lift',
      difficulty: props['piste:difficulty'] || null,
      digitizedAt: props.digitizedAt || new Date().toISOString(),
      vertices: coords.map(([lng, lat]) => ({ lat, lng })),
    };
  });
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

  // Manual digitizing editor
  const [editorMode, setEditorMode] = useState(false);
  const [currentVertices, setCurrentVertices] = useState([]);
  const [elementName, setElementName] = useState('');
  const [elementKind, setElementKind] = useState('lift');
  const [elementDifficulty, setElementDifficulty] = useState('');
  const [savedElements, setSavedElements] = useState([]);

  const handleMapClick = (latlng) => {
    if (editorMode) {
      setCurrentVertices((prev) => [...prev, { lat: latlng.lat, lng: latlng.lng }]);
      return;
    }

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

  const handleToggleEditorMode = () => {
    setEditorMode((prev) => {
      const next = !prev;
      if (next) {
        // entering editor mode: clear any stale elevation lookup panel
        setClickedPoint(null);
        setElevation(null);
      }
      return next;
    });
  };

  const handleUndoVertex = () => {
    setCurrentVertices((prev) => prev.slice(0, -1));
  };

  const handleDiscardElement = () => {
    setCurrentVertices([]);
    setElementName('');
    setElementKind('lift');
    setElementDifficulty('');
  };

  const handleSaveElement = () => {
    if (currentVertices.length < 2) return;
    setSavedElements((prev) => [
      ...prev,
      {
        name: elementName.trim() || `Elemento ${prev.length + 1}`,
        kind: elementKind,
        difficulty: elementKind === 'piste' ? elementDifficulty || null : null,
        vertices: currentVertices,
        digitizedAt: new Date().toISOString(),
      },
    ]);
    setCurrentVertices([]);
    setElementName('');
    setElementKind('lift');
    setElementDifficulty('');
  };

  const handleExportJSON = () => {
    downloadJSON('lasLenasManualElements.json', buildManualElementsGeoJSON(savedElements));
  };

  const handleImportJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const imported = parseManualElementsGeoJSON(parsed);
        setSavedElements((prev) => [...prev, ...imported]);
      } catch (err) {
        console.error('Failed to import manual elements JSON:', err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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

            {/* Internal testing only — Google roadmap tiles for street-level route inspection */}
            <LayersControl.BaseLayer name="Calles (Google)">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                attribution="Google"
                maxZoom={20}
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

            {/* FDR field-test route — Tigre, Buenos Aires — off by default */}
            <LayersControl.Overlay name="Test FDR — Tigre">
              <LayerGroup>
                <Polyline
                  positions={TIGRE_ROUTE_POINTS.map((p) => [p.lat, p.lng])}
                  pathOptions={{
                    color: TIGRE_ROUTE_COLOR,
                    weight: 0.75,
                    opacity: 0.8,
                  }}
                />

                {TIGRE_ROUTE_POINTS.map((point) => {
                  const speedClass = classifyTigreSpeed(point.speedKmh);
                  const color = TIGRE_SPEED_COLORS[speedClass];
                  return (
                    <CircleMarker
                      key={`tigre-point-${point.index}`}
                      center={[point.lat, point.lng]}
                      radius={1.5}
                      pathOptions={{
                        color,
                        fillColor: color,
                        fillOpacity: 0.85,
                        weight: 1,
                      }}
                    >
                      <Popup>
                        <strong>Índice:</strong> {point.index}<br />
                        <strong>Velocidad:</strong> {point.speedKmh.toFixed(1)} km/h<br />
                        <strong>Hora:</strong> {point.time}
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>

          {/* Click handler — active regardless of which base layer is selected */}
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Manual digitizing — in-progress polyline + vertices */}
          {currentVertices.length >= 2 && (
            <Polyline
              positions={currentVertices.map((v) => [v.lat, v.lng])}
              pathOptions={{
                color: MANUAL_ELEMENT_COLOR,
                weight: 3,
                dashArray: '6 6',
                opacity: 0.9,
              }}
            />
          )}
          {currentVertices.map((v, index) => (
            <CircleMarker
              key={`manual-vertex-${index}`}
              center={[v.lat, v.lng]}
              radius={4}
              pathOptions={{
                color: MANUAL_ELEMENT_COLOR,
                fillColor: MANUAL_ELEMENT_COLOR,
                fillOpacity: 0.9,
                weight: 1,
              }}
            />
          ))}

          {/* Manual digitizing — saved elements */}
          {savedElements.map((el, index) => (
            <Polyline
              key={`manual-saved-${index}`}
              positions={el.vertices.map((v) => [v.lat, v.lng])}
              pathOptions={{ color: MANUAL_ELEMENT_COLOR, weight: 3, opacity: 0.95 }}
            >
              <Popup>
                <strong>{el.name}</strong><br />
                {el.kind === 'lift' ? 'Medio de elevación' : 'Pista'}
                {el.difficulty && (
                  <>
                    <br />
                    Dificultad: {el.difficulty}
                  </>
                )}
              </Popup>
            </Polyline>
          ))}

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

        {/* Manual digitizing editor — toggle + panel */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '60px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxWidth: '260px',
          }}
        >
          <button
            type="button"
            onClick={handleToggleEditorMode}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: editorMode ? '#eab308' : '#374151',
              color: editorMode ? '#111827' : '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            {editorMode ? 'Modo edición: ON' : 'Modo edición: OFF'}
          </button>

          {editorMode && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                borderRadius: '6px',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div>Vértices: {currentVertices.length}</div>
              <input
                type="text"
                placeholder="Nombre (ej: TS Minerva II)"
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
                style={{ padding: '4px 6px', fontSize: '0.8rem' }}
              />
              <select
                value={elementKind}
                onChange={(e) => setElementKind(e.target.value)}
                style={{ padding: '4px 6px', fontSize: '0.8rem' }}
              >
                <option value="lift">Medio de elevación (lift)</option>
                <option value="piste">Pista (piste)</option>
              </select>
              {elementKind === 'piste' && (
                <select
                  value={elementDifficulty}
                  onChange={(e) => setElementDifficulty(e.target.value)}
                  style={{ padding: '4px 6px', fontSize: '0.8rem' }}
                >
                  <option value="">Dificultad (opcional)</option>
                  {PISTE_DIFFICULTY_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              )}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <button type="button" onClick={handleUndoVertex} disabled={currentVertices.length === 0}>
                  Deshacer último punto
                </button>
                <button type="button" onClick={handleSaveElement} disabled={currentVertices.length < 2}>
                  Guardar elemento
                </button>
                <button type="button" onClick={handleDiscardElement} disabled={currentVertices.length === 0}>
                  Descartar
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              borderRadius: '6px',
              padding: '8px 10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div>Elementos guardados: {savedElements.length}</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleExportJSON} disabled={savedElements.length === 0}>
                Exportar JSON
              </button>
              <label
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f3f4f6',
                }}
              >
                Importar JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

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
