'use client';
import React, { useState } from 'react';
// import QRScanner from '@/components/QRScanner';
import FaceDetection from '@/components/FaceDetection';

function Student() {
  const [qrData, setQrData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleScan = (data) => {
    setQrData(data);
  };

  const handleVerified = (verified) => {
    setIsVerified(verified);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student</h1>
      {/* {!qrData && <QRScanner onScan={handleScan} />} */}
      {qrData && !isVerified && <FaceDetection onVerified={handleVerified} />}
      {isVerified && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">Attendance marked successfully!</div>}
    </div>
  );
}

export default Student;
