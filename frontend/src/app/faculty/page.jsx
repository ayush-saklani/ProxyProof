'use client';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

function Faculty() {
  const [location, setLocation] = useState(null);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs().add(1, 'hour'));

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

    const interval = setInterval(() => {
      setFromTime(dayjs());
      setToTime(dayjs().add(1, 'hour'));
    }, 1000 * 60 * 5); // update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleUpdateLocation = (latitude, longitude) => {
    setLocation({ latitude, longitude });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <title>RollCall | Faculty</title>
        <section className="container-fluid mt-5">
          <div className="container">
            <h1 className="center text fw-bold">Faculty</h1>
            <span>
              <p className="center text fw-bold">Select your current location and generate a QR code for students to scan and mark their attendance.</p>
            </span>
            <div className="row">
              <div className="col-md-5">
                <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-4">Course Details</h5>
                  <div className="mb-3">
                    <label htmlFor="course" className="form-label">Course</label>
                    <input type="text" className="form-control" id="course" value={course} onChange={(e) => setCourse(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="semester" className="form-label">Semester</label>
                    <input type="text" className="form-control" id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="section" className="form-label">Section</label>
                    <input type="text" className="form-control" id="section" value={section} onChange={(e) => setSection(e.target.value)} />
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-4">Time Slot</h5>
                  <div className="d-flex mb-3 gap-4 lg:flex-nowrap md:flex-wrap">
                    <TimePicker label="From" value={fromTime} onChange={setFromTime} views={['hours']} />
                    <TimePicker label="To" value={toTime} onChange={setToTime} views={['hours']} />
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className='flex flex-col md:flex-row justify-between  mb-2 gap-2'>
                    <h5 className="text-xl font-bold mb-4">Get Location</h5>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getLocation}>Get Location</button>
                  </div>
                  {location && <p className='font-medium py-2'>Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}</p>}
                  {location && (
                    <div className="mt-1">
                      <Map latitude={location.latitude} longitude={location.longitude} onUpdateLocation={handleUpdateLocation} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <QRCodeGenerator location={location} course={course} semester={semester} section={section} from={fromTime?.format('HH:mm')} to={toTime?.format('HH:mm')} />
          </div>
        </section>
      </>
    </LocalizationProvider>
  );
}

export default Faculty;
