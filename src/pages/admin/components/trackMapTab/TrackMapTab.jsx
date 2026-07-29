import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';

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

const IGN_WMS_URL =
  'https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows';

// Root group layer — serves all available ortomosaico sub-layers in one request
const IGN_WMS_LAYER = 'vuelos_2011';

const ESRI_IMAGERY_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_ATTRIBUTION =
  'Tiles \u00a9 Esri \u2014 Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';

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
          </LayersControl>

          {/* Click handler — active regardless of which base layer is selected */}
          <MapClickHandler onMapClick={(latlng) => setClickedPoint(latlng)} />

          {/* Temporary click marker */}
          {clickedPoint && (
            <Marker position={[clickedPoint.lat, clickedPoint.lng]}>
              <Popup>
                <strong>Punto seleccionado</strong><br />
                Lat: {clickedPoint.lat.toFixed(6)}<br />
                Lng: {clickedPoint.lng.toFixed(6)}
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
            Lng:&nbsp;{clickedPoint.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackMapTab;
