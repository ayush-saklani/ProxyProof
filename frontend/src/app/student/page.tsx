'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function Student() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Loading models...');
  const [modelsReady, setModelsReady] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState<Float32Array | null>(null);
  const [match, setMatch] = useState(false);

  // load models
  useEffect(() => {
    const loadModels = async () => {
      const url = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(url),
        faceapi.nets.faceLandmark68Net.loadFromUri(url),
        faceapi.nets.faceRecognitionNet.loadFromUri(url),
      ]);
      setModelsReady(true);
      setStatus('Models ready. Start webcam.');
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setStatus('Camera access denied.');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modelsReady) return;

    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      setReferenceDescriptor(detection.descriptor);
      setStatus('Reference face loaded. Look into camera.');
    } else {
      setStatus('No face detected in uploaded image.');
    }
  };

  // main comparison loop
  useEffect(() => {
    if (!modelsReady || !referenceDescriptor) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const det = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (!det) return;

      const distance = faceapi.euclideanDistance(det.descriptor, referenceDescriptor);
      const isSame = distance < 0.6; // lower = more similar
      setMatch(isSame);

      const box = det.detection.box;
      ctx.strokeStyle = isSame ? 'lime' : 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = 'white';
      ctx.fillText(`dist: ${distance.toFixed(3)}`, box.x, box.y - 10);
    }, 200);

    return () => clearInterval(interval);
  }, [modelsReady, referenceDescriptor]);

  return (
    <section className="container-fluid mt-5">
      <div className="container">
        <h1 className="center text fw-bold">Student Attendance</h1>
        <div className="row">
          <div className="">
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
              <h5 className="text-xl font-bold mb-4">Upload Your Image</h5>
              {/* <input type="file" onChange={handleFileChange} accept="image/*" className="mb-4" /> */}
              <main className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                <h1 className="text-2xl font-semibold">Face Match Prototype</h1>
                <p className="text-gray-300">{status}</p>

                <input type="file" accept="image/*" onChange={handleUpload} className="mt-2" />

                <div style={{ position: 'relative' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width={480}
                    height={360}
                    className="rounded-lg border border-blue-500"
                  />
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={360}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                  {match && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,255,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      SAME FACE
                    </div>
                  )}
                  {match === false && referenceDescriptor && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255,0,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      DIFFERENT FACE
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Student;