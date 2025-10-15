import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FaceMatchingProps {
  uploadedImage: File | null;
}

function FaceMatching({ uploadedImage }: FaceMatchingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      if (videoRef.current) {
        startVideo();
      }
    };
    loadModels();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const createFaceMatcher = async () => {
      if (uploadedImage) {
        const image = await faceapi.bufferToImage(uploadedImage);
        const detection = await faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks(true).withFaceDescriptor();
        if (detection) {
          setFaceMatcher(new faceapi.FaceMatcher(detection.descriptor));
        }
      }
    };
    createFaceMatcher();
  }, [uploadedImage]);

  const startVideo = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      console.log('Camera access granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Error accessing camera. Please check permissions and ensure your camera is not in use by another application.');
    }
  };

  const handleVideoPlay = () => {
    if (isVerified || !videoRef.current || !canvasRef.current) {
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    intervalRef.current = setInterval(async () => {
      if (video && !video.paused) {
        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        if (faceMatcher && detections.length > 0) {
          const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
          if (bestMatch.label !== 'unknown') {
            setIsVerified(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
            }
          }
        }
      }
    }, 100);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h5 className="text-xl font-bold mb-4">Face Matching</h5>
      {cameraError && <div className="alert alert-danger">{cameraError}</div>}
      <div className="relative">
        <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} width="720" height="560" />
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
        {isVerified && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg text-2xl">Verified</div>}
      </div>
    </div>
  );
}

export default FaceMatching;