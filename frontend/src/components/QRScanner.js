import React from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';

function QRScanner({ onScan }) {
  const handleScan = (data) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h5 className="text-xl font-bold mb-4">Scan QR Code</h5>
      <QrScanner
        onDecode={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default QRScanner;
