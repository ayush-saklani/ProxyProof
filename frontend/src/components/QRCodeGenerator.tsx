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
  fromHr: string;
  toHr: string;
  fromAmPm: string;
  toAmPm: string;
}

function QRCodeGenerator({ location, course, semester, section, fromHr, toHr, fromAmPm, toAmPm }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateQrCode = () => {
    if (!location) {
      alert("Please get your location first.");
      return;
    }

    const qrData = JSON.stringify({ location, course, semester, section, from: `${fromHr} ${fromAmPm}`, to: `${toHr} ${toAmPm}` });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    setQrCode(qrCodeUrl);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h5 className="text-xl font-bold mb-4">Generate QR Code</h5>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generateQrCode}>Generate QR Code</button>
      {qrCode && <img src={qrCode} alt="QR Code" className="mt-3" />}
    </div>
  );
}

export default QRCodeGenerator;
