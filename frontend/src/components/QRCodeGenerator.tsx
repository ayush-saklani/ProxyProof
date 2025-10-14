'use client';
import React, { useState } from 'react';



interface Location {
  latitude: number;
  longitude: number;
  // Add other properties if needed
}

interface QRCodeGeneratorProps {
  location: Location;
  course: string;
  semester: string;
  section: string;
  from: string;
  to: string;
}

function QRCodeGenerator({ location, course, semester, section, from, to }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);

  const generateQrCode = () => {
    if (!location) {
      alert("Please get your location first.");
      return;
    }

    const data = { location, course, semester, section, from, to };
    const qrDataString = JSON.stringify(data);
    setQrData(qrDataString);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrDataString)}`;
    setQrCode(qrCodeUrl);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h5 className="text-xl font-bold mb-4">Generate QR Code</h5>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generateQrCode}>Generate QR Code</button>
      {qrCode && (
        <div className="mt-4">
          <img src={qrCode} alt="QR Code" className="mt-3" />
          {qrData && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h6 className="font-bold">QR Code Data:</h6>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(JSON.parse(qrData), null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
