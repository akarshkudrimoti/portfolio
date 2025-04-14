'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';

interface SmileDetectorProps {
  onAuthenticated: () => void;
}

export default function SmileDetector({ onAuthenticated }: SmileDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [smileProgress, setSmileProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSmiling, setIsSmiling] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [smileCount, setSmileCount] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [facePosition, setFacePosition] = useState<'centered' | 'left' | 'right' | 'up' | 'down' | 'too-far' | 'too-close' | null>(null);
  const [matrixText, setMatrixText] = useState<string[]>([]);

  // Generate Matrix-like text effect
  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    const lines = 10;
    const newMatrixText: string[] = [];
    
    for (let i = 0; i < lines; i++) {
      let line = '';
      const length = Math.floor(Math.random() * 20) + 10;
      for (let j = 0; j < length; j++) {
        line += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      newMatrixText.push(line);
    }
    
    setMatrixText(newMatrixText);
    
    const interval = setInterval(() => {
      const updatedText = [...newMatrixText];
      const randomLine = Math.floor(Math.random() * lines);
      const randomChar = Math.floor(Math.random() * updatedText[randomLine].length);
      const newChar = characters.charAt(Math.floor(Math.random() * characters.length));
      
      updatedText[randomLine] = 
        updatedText[randomLine].substring(0, randomChar) + 
        newChar + 
        updatedText[randomLine].substring(randomChar + 1);
      
      setMatrixText(updatedText);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Use a separate useEffect to handle authentication
  useEffect(() => {
    if (smileCount > 10) {
      onAuthenticated();
    }
  }, [smileCount, onAuthenticated]);

  // Load face-api models
  useEffect(() => {
    async function loadModels() {
      try {
        setDebugInfo('Loading face detection models...');
        
        // Load the required models from CDN
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
        ]);
        
        setIsModelLoading(false);
        setDebugInfo('Models loaded successfully');
      } catch (err) {
        setError('Failed to load face detection models. Please refresh the page.');
        console.error('Model loading error:', err);
      }
    }
    loadModels();
  }, []);

  useEffect(() => {
    let video: HTMLVideoElement | null = null;
    let isDetecting = false;
    let animationFrameId: number | null = null;

    async function setupCamera() {
      try {
        setDebugInfo('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        if (videoRef.current) {
          setDebugInfo('Setting up video stream...');
          videoRef.current.srcObject = stream;
          video = videoRef.current;
          
          // Wait for video to be ready
          await new Promise((resolve) => {
            if (video) {
              video.onloadedmetadata = () => {
                setDebugInfo('Video metadata loaded, setting up canvas...');
                if (canvasRef.current && video) {
                  canvasRef.current.width = video.videoWidth;
                  canvasRef.current.height = video.videoHeight;
                  setDebugInfo(`Canvas size set to ${video.videoWidth}x${video.videoHeight}`);
                }
                resolve(true);
              };
            }
          });

          // Wait for video to actually start playing
          await new Promise((resolve) => {
            if (video) {
              video.onplaying = () => {
                setDebugInfo('Video is playing, starting detection...');
                resolve(true);
              };
            }
          });

          setIsInitialized(true);
          isDetecting = true;
          detectSmile();
        }
      } catch (err) {
        setError('Camera access denied. Please allow camera access and refresh the page.');
        console.error('Camera setup error:', err);
      }
    }

    async function detectSmile() {
      if (!video || !isDetecting || !canvasRef.current || isModelLoading) {
        setDebugInfo('Detection skipped: video, canvas, or models not ready');
        return;
      }

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setDebugInfo('Failed to get canvas context');
          return;
        }
        
        // Ensure canvas dimensions match video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          setDebugInfo(`Canvas resized to ${video.videoWidth}x${video.videoHeight}`);
        }
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Detect faces and expressions
        const detections = await faceapi.detectAllFaces(
          canvas, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
        
        if (detections.length > 0) {
          const face = detections[0];
          const expressions = face.expressions;
          const box = face.detection.box;
          
          // Get smile probability (0-1)
          const smileProbability = expressions.happy;
          
          // Convert to progress (0-100)
          const progress = Math.min(Math.max(smileProbability * 100, 0), 100);
          setSmileProgress(progress);
          
          // Check face position
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const faceCenterX = box.x + box.width / 2;
          const faceCenterY = box.y + box.height / 2;
          
          // Calculate distance from center
          const distanceX = Math.abs(faceCenterX - centerX);
          const distanceY = Math.abs(faceCenterY - centerY);
          
          // Determine face position
          let position: 'centered' | 'left' | 'right' | 'up' | 'down' | 'too-far' | 'too-close' = 'centered';
          
          // Check if face is too far or too close
          const faceSize = box.width * box.height;
          const canvasSize = canvas.width * canvas.height;
          const faceRatio = faceSize / canvasSize;
          
          if (faceRatio < 0.05) {
            position = 'too-far';
          } else if (faceRatio > 0.3) {
            position = 'too-close';
          } else if (distanceX > canvas.width * 0.2) {
            position = faceCenterX < centerX ? 'left' : 'right';
          } else if (distanceY > canvas.height * 0.2) {
            position = faceCenterY < centerY ? 'up' : 'down';
          }
          
          setFacePosition(position);
          
          // Update debug info
          setDebugInfo(
            `Face detected\n` +
            `Position: ${position}\n` +
            `Smile probability: ${(smileProbability * 100).toFixed(1)}%\n` +
            `Progress: ${progress.toFixed(0)}%`
          );
          
          // Determine if smiling (threshold at 70%)
          const smiling = smileProbability > 0.7;
          setIsSmiling(smiling);
          
          if (smiling) {
            setSmileCount(prev => prev + 1);
          } else {
            setSmileCount(0);
          }
        } else {
          setDebugInfo('No face detected');
          setIsSmiling(false);
          setSmileCount(0);
          setFacePosition(null);
        }
      } catch (err) {
        console.error('Detection error:', err);
        setDebugInfo(`Detection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsSmiling(false);
        setSmileCount(0);
        setFacePosition(null);
      }

      if (isDetecting) {
        animationFrameId = requestAnimationFrame(detectSmile);
      }
    }

    async function initialize() {
      if (!isModelLoading) {
        setDebugInfo('Initializing...');
        await setupCamera();
      }
    }

    initialize();

    return () => {
      isDetecting = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (video?.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isModelLoading]);

  const handleRecalibrate = () => {
    setSmileCount(0);
    setDebugInfo('Recalibrating... Please maintain a neutral expression');
  };

  const getPositionMessage = () => {
    switch (facePosition) {
      case 'centered':
        return 'Face centered ✓';
      case 'left':
        return 'Move face right ←';
      case 'right':
        return 'Move face left →';
      case 'up':
        return 'Move face down ↓';
      case 'down':
        return 'Move face up ↑';
      case 'too-far':
        return 'Move closer to camera';
      case 'too-close':
        return 'Move further from camera';
      default:
        return 'Position face in frame';
    }
  };

  const getPositionArrow = () => {
    switch (facePosition) {
      case 'centered':
        return '✓';
      case 'left':
        return '→';
      case 'right':
        return '←';
      case 'up':
        return '↓';
      case 'down':
        return '↑';
      case 'too-far':
        return '↔';
      case 'too-close':
        return '↔';
      default:
        return '?';
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-500 font-mono">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {matrixText.map((line, i) => (
            <div key={i} className="text-green-500 text-xs whitespace-nowrap">
              {line}
            </div>
          ))}
        </div>
        <p className="text-red-500 mb-4 relative z-10">{error}</p>
        <button
          onClick={onAuthenticated}
          className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 relative z-10"
        >
          Skip Authentication
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      {/* Matrix background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {matrixText.map((line, i) => (
          <div key={i} className="text-green-500 text-xs whitespace-nowrap">
            {line}
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-green-500 text-xl mb-4 font-bold tracking-wider">
          TERMINAL ACCESS
        </div>
        
        <div className="relative w-80 h-80 mb-4 border-2 border-green-500 rounded-lg overflow-hidden">
          {/* Target overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-green-500 rounded-full opacity-50"></div>
            <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
            
            {/* Position guidance arrows */}
            {facePosition && facePosition !== 'centered' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-green-500 text-6xl font-bold animate-pulse">
                  {getPositionArrow()}
                </div>
              </div>
            )}
            
            {/* Distance guidance */}
            {facePosition === 'too-far' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-yellow-500 rounded-full opacity-70 animate-pulse"></div>
              </div>
            )}
            {facePosition === 'too-close' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-yellow-500 rounded-full opacity-70 animate-pulse"></div>
              </div>
            )}
          </div>
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ display: 'none' }}
          />
          
          {/* Position indicator */}
          <div className="absolute top-4 right-4 flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${facePosition === 'centered' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-white font-medium text-sm">{getPositionMessage()}</span>
          </div>
          
          {/* Smile indicator */}
          <div className="absolute top-4 left-4 flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${isSmiling ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-medium text-sm">{isSmiling ? 'Smiling!' : 'Not smiling'}</span>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800 rounded">
            <motion.div
              className={`h-full rounded ${isSmiling ? 'bg-green-500' : 'bg-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${smileProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        <div className="w-80 bg-black border border-green-500 p-4 rounded-lg mb-4 font-mono text-sm">
          <div className="text-green-500 mb-2">{'>'} SYSTEM STATUS</div>
          <div className="text-green-500 mb-1">{'>'} Face Detection: {facePosition ? 'Active' : 'Inactive'}</div>
          <div className="text-green-500 mb-1">{'>'} Smile Authentication: {isSmiling ? 'Authenticated' : 'Pending'}</div>
          <div className="text-green-500 mb-1">{'>'} Progress: {smileProgress.toFixed(0)}%</div>
          <div className="text-green-500">{'>'} {debugInfo}</div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleRecalibrate}
            className="px-4 py-2 bg-transparent border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            Recalibrate
          </button>
          <button
            onClick={onAuthenticated}
            className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 transition-colors"
          >
            Skip Authentication
          </button>
        </div>
      </div>
    </div>
  );
} 