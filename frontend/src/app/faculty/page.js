'use client';
import React, { useState } from 'react';
import LocationPicker from '@/components/LocationPicker';
import QRCodeGenerator from '@/components/QRCodeGenerator';

function Faculty() {
  const [location, setLocation] = useState(null);

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  return (
    <>
      <title>RollCall | Faculty</title>
      <section className="container-fluid mt-5">
        <div className="container">
          <h1 className="center text fw-bold">Faculty</h1>
          <span>
            <p className="center text fw-bold">Select your current location and generate a QR code for students to scan and mark their attendance.</p>
          </span>
          <LocationPicker onLocation={handleLocation} />
          {location && <p className="mt-4">Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
          <QRCodeGenerator location={location} />
        </div>
      </section>
    </>
  );
}

export default Faculty;
