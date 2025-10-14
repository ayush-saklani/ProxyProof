'use client';
import React, { useState } from 'react';

function QRCodeGenerator({ location }) {
  const [qrCode, setQrCode] = useState(null);

  const generateQrCode = async () => {
    if (!location) {
      alert("Please get your location first.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.data.qrCode);
      } else {
        throw new Error(data.message || "Failed to generate QR code");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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
