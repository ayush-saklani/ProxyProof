import React from 'react';

function LocationPicker({ onLocation }) {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      onLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h5 className="text-xl font-bold mb-4">Get Location</h5>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getLocation}>Get Location</button>
    </div>
  );
}

export default LocationPicker;
