'use client';
import QRCodeGenerator from '@/components/QRCodeGenerator';

import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

function Faculty() {
  const [location, setLocation] = useState(null);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [fromHr, setFromHr] = useState('09');
  const [toHr, setToHr] = useState('10');
  const [fromAmPm, setFromAmPm] = useState('AM');
  const [toAmPm, setToAmPm] = useState('AM');

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleUpdateLocation = (latitude, longitude) => {
    setLocation({ latitude, longitude });
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <>
      <title>RollCall | Faculty</title>
      <section className="container-fluid mt-5">
        <div className="container">
          <h1 className="center text fw-bold">Faculty</h1>
          <span>
            <p className="center text fw-bold">Select your current location and generate a QR code for students to scan and mark their attendance.</p>
          </span>
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="course" className="form-label">Course</label>
                <input type="text" className="form-control" id="course" value={course} onChange={(e) => setCourse(e.target.value)} />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="semester" className="form-label">Semester</label>
                <input type="text" className="form-control" id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="section" className="form-label">Section</label>
                <input type="text" className="form-control" id="section" value={section} onChange={(e) => setSection(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="fromHr" className="form-label">From</label>
                <div className="input-group">
                  <select className="form-select" id="fromHr" value={fromHr} onChange={(e) => setFromHr(e.target.value)}>
                    {hours.map(hr => <option key={hr} value={hr}>{hr}</option>)}
                  </select>
                  <select className="form-select" value={fromAmPm} onChange={(e) => setFromAmPm(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <label htmlFor="toHr" className="form-label">To</label>
                <div className="input-group">
                  <select className="form-select" id="toHr" value={toHr} onChange={(e) => setToHr(e.target.value)}>
                    {hours.map(hr => <option key={hr} value={hr}>{hr}</option>)}
                  </select>
                  <select className="form-select" value={toAmPm} onChange={(e) => setToAmPm(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className='flex justify-between items-center mb-2'>
              <h5 className="text-xl font-bold mb-4">Get Location</h5>
              {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getLocation}>Get Location</button>
            </div>
            {location && (
              <div className="mt-1">
                <Map latitude={location.latitude} longitude={location.longitude} onUpdateLocation={handleUpdateLocation} />
              </div>
            )}
          </div>
          <QRCodeGenerator location={location} course={course} semester={semester} section={section} fromHr={fromHr} toHr={toHr} fromAmPm={fromAmPm} toAmPm={toAmPm} />
        </div>
      </section>
    </>
  );
}

export default Faculty;
