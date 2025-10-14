import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

function FaceDetection({ onVerified }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
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

  const getEyeAspectRatio = (landmarks) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const eyeAspectRatio = (eye) => {
      const d1 = faceapi.euclideanDistance(eye[1], eye[5]);
      const d2 = faceapi.euclideanDistance(eye[2], eye[4]);
      const d3 = faceapi.euclideanDistance(eye[0], eye[3]);
      return (d1 + d2) / (2 * d3);
    };

    return (eyeAspectRatio(leftEye) + eyeAspectRatio(rightEye)) / 2;
  };

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    let blinkCounter = 0;
    const blinkThreshold = 0.2;

    setInterval(async () => {
      if (video && !video.paused) {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
          const landmarks = detections[0].landmarks;
          const ear = getEyeAspectRatio(landmarks);

          if (ear < blinkThreshold) {
            blinkCounter++;
          } else {
            if (blinkCounter > 1) { // Threshold for number of consecutive frames with closed eyes
              setBlinking(true);
              setTimeout(() => setBlinking(false), 2000); // Reset after 2 seconds
              setIsVerified(true);
              onVerified(true);
            }
            blinkCounter = 0;
          }
        }
      }
    }, 100);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h5 className="text-xl font-bold mb-4">Face Detection</h5>
      <div className="relative">
        <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} width="720" height="560" />
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
        {isVerified && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg text-2xl">Verified</div>}
        {blinking && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-4 rounded-lg text-2xl">Blink Detected</div>}
      </div>
    </div>
  );
}

export default FaceDetection;
