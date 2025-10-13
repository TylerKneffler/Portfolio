import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Galaxy } from './Galaxy';
import './PixelRenderer.css';

const GalaxyRenderer = ({ 
  pixelSize = 1,
  width = 800,
  height = 600,
  animate = true,
  className = '',
  cameraControls = false,
  onCameraChange = null,
  galaxyType
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const galaxyRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005); // Very dark space
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.set(0, 500, 1500); // Start outside the galaxy
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    
    // Calculate render size for pixelation
    const renderWidth = Math.max(width / pixelSize, 64);
    const renderHeight = Math.max(height / pixelSize, 48);
    
    renderer.setSize(renderWidth, renderHeight);
    renderer.setPixelRatio(1);
    renderer.domElement.style.width = width + 'px';
    renderer.domElement.style.height = height + 'px';
    renderer.domElement.style.imageRendering = 'pixelated';
    
    rendererRef.current = renderer;

    // Clear and add renderer to DOM
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Create galaxy
    const galaxy = new Galaxy(scene, galaxyType);
    galaxyRef.current = galaxy;

    // Camera controls - controlled by external sliders
    let cameraDistance = cameraControls?.distance || 1500;
    let cameraAzimuth = cameraControls?.azimuth || 0;
    let cameraPolar = cameraControls?.polar || 90;

    const updateCameraPosition = () => {
      const radiansPolar = THREE.MathUtils.degToRad(cameraPolar);
      const radiansAzimuth = THREE.MathUtils.degToRad(cameraAzimuth);
      
      const x = cameraDistance * Math.sin(radiansPolar) * Math.cos(radiansAzimuth);
      const y = cameraDistance * Math.cos(radiansPolar);
      const z = cameraDistance * Math.sin(radiansPolar) * Math.sin(radiansAzimuth);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      
      if (onCameraChange) {
        onCameraChange({
          distance: cameraDistance,
          azimuth: cameraAzimuth,
          polar: cameraPolar
        });
      }
    };

    // Expose camera controls to external components
    window.galaxyRendererCameraControls = {
      setDistance: (value) => { 
        cameraDistance = value; 
        updateCameraPosition(); 
      },
      setAzimuth: (value) => { 
        cameraAzimuth = value; 
        updateCameraPosition(); 
      },
      setPolar: (value) => { 
        cameraPolar = value; 
        updateCameraPosition(); 
      }
    };

    // Initialize camera position
    updateCameraPosition();

    // Animation loop
    const animateScene = () => {
      if (!animate) return;
      
      const time = Date.now();
      
      // Animate galaxy
      if (galaxyRef.current) {
        galaxyRef.current.animate(time);
      }
      
      // Render
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animateScene);
    };

    setIsLoaded(true);

    if (animate) {
      animateScene();
    } else {
      renderer.render(scene, camera);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (galaxyRef.current) {
        galaxyRef.current.dispose();
      }
      
      // Clean up camera controls
      if (window.galaxyRendererCameraControls) {
        delete window.galaxyRendererCameraControls;
      }
      
      renderer.dispose();
      
      // Clean up DOM
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [pixelSize, width, height, animate, cameraControls, onCameraChange, galaxyType]);

  return (
    <div className={`pixel-renderer ${className}`}>
      <div ref={mountRef} style={{ width, height }} />
      {!isLoaded && (
        <div className="loading-overlay">
          <div className="loading-text">Generating Galaxy...</div>
        </div>
      )}
    </div>
  );
};

export default GalaxyRenderer;
