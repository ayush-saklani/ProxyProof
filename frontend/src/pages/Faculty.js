import React, { useState } from 'react';
import LocationPicker from '../components/LocationPicker';
import QRCodeGenerator from '../components/QRCodeGenerator';

function Faculty() {
  const [location, setLocation] = useState(null);

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Faculty</h1>
      <LocationPicker onLocation={handleLocation} />
      {location && <p className="mt-4">Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
      <QRCodeGenerator location={location} />
    </div>
  );
}

export default Faculty;
