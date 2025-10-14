'use client';
import React, { useState, useEffect } from 'react';
import QRScanner from '@/components/QRScanner';
import FaceDetection from '@/components/FaceDetection';

function Student() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setParsedData(parsed);
      setQrData(data);
    } catch (e) {
      setError('Invalid QR Code');
    }
  };

  const handleVerified = (verified: boolean) => {
    if (verified) {
      // Simple distance check (in degrees, not very accurate but good for a demo)
      if (!location) {
        setError('Unable to get your location');
        return;
      }
      const distance = Math.sqrt(
        Math.pow(location.latitude - parsedData.location.latitude, 2) +
        Math.pow(location.longitude - parsedData.location.longitude, 2)
      );

      // 0.0001 degrees is roughly 11 meters
      if (distance > 0.0001) {
        setError('You are not in the correct location');
        return;
      }

      const now = new Date();
      const fromTime = new Date();
      const [fromH, fromM] = parsedData.from.split(':');
      fromTime.setHours(fromH, fromM, 0, 0);

      const toTime = new Date();
      const [toH, toM] = parsedData.to.split(':');
      toTime.setHours(toH, toM, 0, 0);

      if (now < fromTime || now > toTime) {
        setError('Not within the allowed time slot');
        return;
      }

      setIsVerified(true);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  return (
    <section className="container-fluid mt-5">
      <div className="container">
        <h1 className="center text fw-bold">Student Attendance</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          {!qrData && (
            <div className="col-12">
              <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h5 className="text-xl font-bold mb-4">Scan QR Code</h5>
                {/* <QRScanner onScan={handleScan} /> */}
              </div>
            </div>
          )}

          {qrData && !isVerified && (
            <>
              <div className="col-md-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-4">Scanned Details</h5>
                  {parsedData && (
                    <ul>
                      <li>Course: {parsedData.course}</li>
                      <li>Semester: {parsedData.semester}</li>
                      <li>Section: {parsedData.section}</li>
                      <li>From: {parsedData.from}</li>
                      <li>To: {parsedData.to}</li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                  <h5 className="text-xl font-bold mb-4">Face Verification</h5>
                  <FaceDetection onVerified={handleVerified} />
                </div>
              </div>
            </>
          )}

          {isVerified && (
            <div className="col-12">
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                Attendance marked successfully!
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Student;