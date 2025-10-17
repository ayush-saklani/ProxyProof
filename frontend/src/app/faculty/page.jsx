'use client';
// import QRCodeGenerator from '@/components/QRCodeGenerator';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import DynamicOptions from '@/components/DynamicOptions';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

function Faculty() {
  const [location, setLocation] = useState(null);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs().add(1, 'hour'));
  const [subjectCode, setSubjectCode] = useState('');

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

  const [qrCode, setQrCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const generateQrCode = () => {
    if (!location) {
      alert("Please get your location first.");
      return;
    }

    const data = { location, course, semester, section, from: fromTime?.format('HH'), to: toTime?.format('HH'), subjectCode };
    const qrDataString = JSON.stringify(data);
    setQrData(qrDataString);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrDataString)}`;
    setQrCode(qrCodeUrl);
  };


  const [range, setRange] = useState(30);
  const incrementRange = () => {
    setRange((prevRange) => prevRange + 10);
  };
  const decrementRange = () => {
    setRange((prevRange) => (prevRange - 10 >= 0 ? prevRange - 10 : 0));
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <title>ProxyProof | Faculty</title>
        <section className="container-fluid mt-3">
          <div className="container">
            <h1 className="center text fw-bold">Faculty</h1>
            <span>
              <p className="center text fw-bold">Select your current location and generate a QR code for students to scan and mark their attendance.</p>
            </span>
            <div className="row">
              <div className="col-md-5">
                <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-2">Course Details</h5>
                  <DynamicOptions course={course} setCourse={setCourse} semester={semester} setSemester={setSemester} section={section} setSection={setSection} />
                  <div className="form-floating">
                    <input id="semester_option" type="text" className="mb-3 text form-control mt-3" placeholder="Subject Code" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
                    <label htmlFor="semester_option" className="heading-text">Subject Code</label>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-4">Time Slot</h5>
                  <div className="d-flex mb-3 gap-4 lg:flex-nowrap md:flex-wrap">
                    <TimePicker label="From" value={fromTime} onChange={setFromTime} views={['hours']} />
                    <TimePicker label="To" value={toTime} onChange={setToTime} views={['hours']} />
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">Location</h2>
                      {/* <h5 className="text-xl font-bold mb-4">Get Location</h5> */}
                      <p className="text-sm text-slate-500">Use your device location or adjust on the map.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg shadow-sm"
                        onClick={getLocation}
                      >
                        Get Location
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {location ? (
                      <>
                        <p className="text-sm text-slate-600 mb-2">
                          Latitude: <span className="font-medium text-slate-800">{location.latitude.toFixed(4)}</span>, Longitude:{' '}
                          <span className="font-medium text-slate-800">{location.longitude.toFixed(4)}</span>
                        </p>
                        <div className="h-64 rounded-lg overflow-hidden border border-slate-100">
                          <Map
                            latitude={location.latitude}
                            longitude={location.longitude}
                            radius={range}
                            onUpdateLocation={handleUpdateLocation}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-4 rounded-md bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-500">
                        Location not available. Click "Get Location" to retrieve your position.
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text font-medium text-slate-600">Allowed radius -
                      <span className="text font-bold text-slate-800 px-1">
                        {range}m
                      </span>
                    </label>
                    <div className="mt-2 h-6 w-full bg-slate-100 rounded-full overflow-hidden">
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={5}
                        value={range}
                        onChange={(e) => setRange(Number(e.target.value))}
                        className="w-full "
                        aria-label="Range slider"
                      />
                    </div>
                    <p className="text mt-2 text-xs text-slate-500">Adjust the acceptable check-in radius (meters).</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 my-4 border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="my-2">
                  <h5 className="text-lg font-semibold text-slate-800">Generate QR Code</h5>
                  <p className="text-sm text-slate-500 m-0">Create a QR for students to scan and record attendance.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm"
                    onClick={generateQrCode}
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>

              {qrCode ? (
                <div className="mt-5 grid gap-4 md:grid-cols-3 items-start">
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <img src={qrCode} alt="QR Code" className="w-36 h-36 object-contain" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700">
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(JSON.parse(qrData), null, 2)}</pre>
                    </div>
                    <div className="mt-3 flex gap-3">
                      <a
                        href={qrCode}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm inline-flex items-center justify-center px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                      >
                        Open Image
                      </a>
                      <button
                        onClick={() => navigator.clipboard?.writeText(qrData || '')}
                        className="text-sm inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Copy JSON
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-md bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-500">
                  No QR code generated yet. Click "Generate QR Code" to create one.
                </div>
              )}
            </div>
          </div>
        </section>
      </>
    </LocalizationProvider>
  );
}

export default Faculty;
