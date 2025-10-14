'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  latitude: number;
  longitude: number;
  onUpdateLocation: (latitude: number, longitude: number) => void;
}

const Map = ({ latitude, longitude, onUpdateLocation }: MapProps) => {
  if (typeof window === 'undefined') {
    return null; // Avoid server-side rendering for this component
  }

  const eventHandlers = {
    dragend(event: any) {
      const { lat, lng } = event.target.getLatLng();
      onUpdateLocation(lat, lng);
    },
  };

  return (
    <MapContainer center={[latitude, longitude]} zoom={20} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} draggable={true} eventHandlers={eventHandlers}>
        <Popup>
          Your current location. (Drag to change)
        </Popup>
      </Marker>
      <Circle center={[latitude, longitude]} radius={30} />
    </MapContainer>
  );
};

export default Map;