'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import SmileDetector from './SmileDetector';

interface IntroPageProps {
  onAuthenticated: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onAuthenticated }) => {
  const [showSmileDetector, setShowSmileDetector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Store ref in a variable to avoid the warning
    const container = containerRef.current;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create a wireframe cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      // Use the stored container variable instead of containerRef.current
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const handleStartAuthentication = () => {
    setShowSmileDetector(true);
  };

  const handleSmileAuthenticated = () => {
    setTimeout(() => {
      onAuthenticated();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="matrix-rain"></div>
      <div className="scanline"></div>
      
      {!showSmileDetector ? (
        <div className="w-full max-w-md p-8 bg-black border border-green-500 rounded-lg text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-8">Welcome Guest</h1>
          <h2 className="text-2xl font-bold text-green-500 mb-6">to The Matrix</h2>
          
          <div ref={containerRef} className="mx-auto mb-8" style={{ width: '200px', height: '200px' }} />
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleStartAuthentication}
              className="px-8 py-4 rounded-lg transition-all duration-300 text-xl font-bold tracking-wider"
              style={{ 
                backgroundColor: '#00ff00', 
                color: 'black', 
                fontWeight: 'bold', 
                fontSize: '1.25rem', 
                letterSpacing: '0.05em',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
              }}
            >
              GO TO SMILE DETECTOR
            </button>
          </div>
        </div>
      ) : (
        <SmileDetector onAuthenticated={handleSmileAuthenticated} />
      )}
    </div>
  );
};

export default IntroPage; 