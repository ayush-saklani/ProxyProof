import React, { useState, useRef, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const [qrData, setQrData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  };

  const handleScan = (data) => {
    if (data) {
      setQrData(data);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (video && !video.paused) {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
          // Simple blink detection logic
          const eyeBlink = detections[0].expressions.happy < 0.5; // Placeholder logic
          if (eyeBlink) {
            setIsVerified(true);
          }
        }
      }
    }, 100);
  };

  return (
    <div className="App">
      <h1>RollCall</h1>
      <div className="container">
        <div className="scanner-container">
          {isScanning && (
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              style={{ width: '100%' }}
            />
          )}
          {qrData && <p>QR Code Data: {qrData}</p>}
        </div>
        <div className="video-container">
          <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} width="720" height="560" />
          <canvas ref={canvasRef} className="overlay" />
          {isVerified && <div className="verified-overlay">Verified</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
