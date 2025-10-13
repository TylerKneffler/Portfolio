import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Planet } from './Planet';
import { Star } from './Star';
import './PixelRenderer.css';

const PixelRenderer = ({ 
  pixelSize = 1,
  width = 400,
  height = 400,
  animate = true,
  className = '',
  cameraControls = false,
  onCameraChange = null,
  starCount = 100,
  highlightedPlanet = 'none',
  sunBrightness = 2.5
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 3D Solar system objects and camera state
  const solarSystemRef = useRef({
    time: 0,
    star: null, // Changed from sun to star to use Star class
    planets: [],
    starFieldData: null, // Cache starfield data
    highlightedPlanetName: 'none', // Track currently highlighted planet
    starData: {
      name: 'Sun',
      size: 8,
      color: 0xFFA500,
      type: 'G-class',
      intensity: sunBrightness,
      lightDistance: 800,
      decay: 1,
      rotationSpeed: 0.003,
      pulse: true,
      baseIntensity: 0.8,
      pulseSpeed: 1.0,
      castShadows: false
    },
    planetData: [
      { 
        radius: 15, speed: 0.020, size: 1.2, color: 0x8C7853, name: 'Mercury', orbitTilt: 0.1, hasRings: false, startAngle: 0,
        surfaceType: 'rocky', roughness: 0.9, metalness: 0.1, emissive: 0x0
      },
      { 
        radius: 22, speed: 0.015, size: 1.8, color: 0xFFC649, name: 'Venus', orbitTilt: 0.05, hasRings: false, startAngle: 1.2,
        surfaceType: 'gas', roughness: 0.1, metalness: 0.0, emissive: 0x331100
      },
      { 
        radius: 30, speed: 0.012, size: 2.0, color: 0x6B93D6, name: 'Earth', orbitTilt: 0.0, hasRings: false, startAngle: 2.8,
        surfaceType: 'mixed', roughness: 0.7, metalness: 0.2, emissive: 0x001122, 
        secondaryColor: 0x228B22, liquidColor: 0x0066CC,
        moons: [
          { name: 'Moon', size: 0.3, distance: 3.5, speed: 0.08, color: 0xC0C0C0, type: 'rocky', orbitTilt: 0.05, startAngle: 0 }
        ]
      },
      { 
        radius: 40, speed: 0.009, size: 1.5, color: 0xCD5C5C, name: 'Mars', orbitTilt: -0.08, hasRings: false, startAngle: 4.1,
        surfaceType: 'rocky', roughness: 0.95, metalness: 0.05, emissive: 0x0,
        moons: [
          { name: 'Phobos', size: 0.08, distance: 2.2, speed: 0.15, color: 0x8B7D6B, type: 'rocky', orbitTilt: 0.02, startAngle: 0 },
          { name: 'Deimos', size: 0.05, distance: 3.0, speed: 0.08, color: 0x696969, type: 'rocky', orbitTilt: -0.03, startAngle: 3.14 }
        ]
      },
      { 
        radius: 60, speed: 0.006, size: 4.0, color: 0xD8CA9D, name: 'Jupiter', orbitTilt: 0.02, hasRings: true, ringInner: 4.5, ringOuter: 6.0, ringColor: 0xB8860B, startAngle: 0.7,
        surfaceType: 'gas', roughness: 0.1, metalness: 0.0, emissive: 0x221100,
        moons: [
          { name: 'Io', size: 0.35, distance: 5.0, speed: 0.12, color: 0xFFFF99, type: 'volcanic', orbitTilt: 0.01, startAngle: 0 },
          { name: 'Europa', size: 0.30, distance: 6.2, speed: 0.09, color: 0xE6E6FA, type: 'icy', orbitTilt: 0.02, startAngle: 1.57 },
          { name: 'Ganymede', size: 0.45, distance: 8.0, speed: 0.06, color: 0x8B7D6B, type: 'rocky', orbitTilt: -0.01, startAngle: 3.14 },
          { name: 'Callisto', size: 0.40, distance: 10.5, speed: 0.04, color: 0x696969, type: 'rocky', orbitTilt: 0.03, startAngle: 4.71 }
        ]
      },
      { 
        radius: 80, speed: 0.004, size: 3.5, color: 0xFAD5A5, name: 'Saturn', orbitTilt: -0.05, hasRings: true, ringInner: 4.0, ringOuter: 7.5, ringColor: 0xDDD8B8, startAngle: 3.5,
        surfaceType: 'gas', roughness: 0.1, metalness: 0.0, emissive: 0x111100,
        moons: [
          { name: 'Titan', size: 0.42, distance: 8.5, speed: 0.05, color: 0xFFA500, type: 'icy', orbitTilt: 0.02, startAngle: 0 },
          { name: 'Enceladus', size: 0.18, distance: 6.0, speed: 0.08, color: 0xF0F8FF, type: 'icy', orbitTilt: -0.01, startAngle: 2.09 },
          { name: 'Mimas', size: 0.12, distance: 4.8, speed: 0.11, color: 0xC0C0C0, type: 'rocky', orbitTilt: 0.03, startAngle: 4.18 }
        ]
      },
      { 
        radius: 100, speed: 0.003, size: 2.8, color: 0x4FD0E3, name: 'Uranus', orbitTilt: 0.15, hasRings: true, ringInner: 3.2, ringOuter: 4.8, ringColor: 0x87CEEB, startAngle: 5.8,
        surfaceType: 'ice', roughness: 0.2, metalness: 0.1, emissive: 0x001133,
        moons: [
          { name: 'Titania', size: 0.25, distance: 5.5, speed: 0.06, color: 0xB0B0B0, type: 'icy', orbitTilt: 0.02, startAngle: 0 },
          { name: 'Oberon', size: 0.23, distance: 6.8, speed: 0.04, color: 0x8B8680, type: 'icy', orbitTilt: -0.01, startAngle: 3.14 }
        ]
      },
      { 
        radius: 120, speed: 0.002, size: 2.7, color: 0x4169E1, name: 'Neptune', orbitTilt: -0.1, hasRings: false, startAngle: 1.9,
        surfaceType: 'gas', roughness: 0.1, metalness: 0.0, emissive: 0x000022,
        moons: [
          { name: 'Triton', size: 0.32, distance: 5.2, speed: 0.07, color: 0xE0E6F8, type: 'icy', orbitTilt: 0.15, startAngle: 0 }
        ]
      }
    ],
    starField: null,
    camera: {
      autoRotate: true,
      distance: 100,
      azimuthAngle: 0,
      polarAngle: Math.PI / 3,
      target: { x: 0, y: 0, z: 0 }
    },
    starRotation: { x: 0, y: 0, z: 0 }
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    
    // Capture solar system ref for cleanup
    const solarSystem = solarSystemRef.current;

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Add ambient light to ensure planets are visible
    const ambientLight = new THREE.AmbientLight(0x404040, 0.25);
    scene.add(ambientLight);

    // Create camera with perspective
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer with pixelation effect and shadows
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Calculate proper render size for pixelation
    const renderWidth = Math.max(width / pixelSize, 64);  // Minimum 64px render width
    const renderHeight = Math.max(height / pixelSize, 48); // Minimum 48px render height
    
    renderer.setSize(renderWidth, renderHeight);
    renderer.setPixelRatio(1); // Keep pixel ratio at 1 to avoid jitter
    renderer.domElement.style.width = width + 'px';
    renderer.domElement.style.height = height + 'px';
    renderer.domElement.style.imageRendering = 'pixelated';
    
    rendererRef.current = renderer;

    // Clear and add renderer to DOM
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Seeded random number generator for consistent stars
    const seededRandom = (seed) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Generate or reuse starfield data
    const generateStarFieldData = () => {
      if (solarSystemRef.current.starFieldData && solarSystemRef.current.starFieldData.count === starCount) {
        return solarSystemRef.current.starFieldData;
      }

      const positions = [];
      const colors = [];
      const sizes = [];
      let seed = 12345; // Fixed seed for consistent results

      for (let i = 0; i < starCount; i++) {
        // Generate a random direction (sphere surface)
        const theta = seededRandom(seed++) * Math.PI * 2; // Azimuth angle
        const phi = Math.acos(2 * seededRandom(seed++) - 1); // Polar angle (uniform distribution)
        
        // Place stars outside solar system (Neptune is at radius 120, so start from 200)
        const minDistance = 200;
        const maxDistance = 800;
        const distance = minDistance + seededRandom(seed++) * (maxDistance - minDistance);
        
        // Convert spherical to cartesian coordinates
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);
        
        positions.push(x, y, z);
        
        // Brightness varies randomly for realistic star field
        const brightness = 0.3 + seededRandom(seed++) * 0.7;
        
        // Generate diverse star colors based on stellar classification
        const starType = seededRandom(seed++);
        let r, g, b;
        
        if (starType < 0.1) { // Red giants/dwarfs (10%)
          r = brightness;
          g = brightness * 0.3;
          b = brightness * 0.1;
        } else if (starType < 0.3) { // Orange stars (20%) 
          r = brightness;
          g = brightness * 0.6;
          b = brightness * 0.2;
        } else if (starType < 0.6) { // Yellow stars like Sun (30%)
          r = brightness;
          g = brightness * 0.9;
          b = brightness * 0.4;
        } else if (starType < 0.85) { // White stars (25%)
          r = brightness;
          g = brightness;
          b = brightness;
        } else { // Blue giants (15%)
          r = brightness * 0.6;
          g = brightness * 0.8;
          b = brightness;
        }
        
        colors.push(r, g, b);
        
        // Size varies with brightness
        sizes.push(brightness * 3 + 0.5);
      }

      const data = { positions, colors, sizes, count: starCount };
      solarSystemRef.current.starFieldData = data;
      return data;
    };

    // Create starfield with consistent positions
    const createStarField = () => {
      // Remove existing starfield if it exists
      if (solarSystemRef.current.starField) {
        scene.remove(solarSystemRef.current.starField);
        solarSystemRef.current.starField.geometry.dispose();
        solarSystemRef.current.starField.material.dispose();
      }

      const starData = generateStarFieldData();
      const starGeometry = new THREE.BufferGeometry();

      starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starData.positions), 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(starData.colors), 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(starData.sizes), 1));
      
      const starMaterial = new THREE.PointsMaterial({ 
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      solarSystemRef.current.starField = stars;
    };

    // Create star (Sun) using Star class
    const createStar = () => {
      const star = new Star(solarSystemRef.current.starData, scene);
      solarSystemRef.current.star = star;
    };



    // Create planets using Planet class
    const createPlanets = () => {
      solarSystemRef.current.planets = [];
      
      solarSystemRef.current.planetData.forEach((planetData, index) => {
        // Create planet using Planet class
        const planet = new Planet(planetData, scene);

        // Store planet reference
        solarSystemRef.current.planets.push(planet);
      });
    };



    // Update camera position based on spherical coordinates
    const updateCameraPosition = () => {
      const cameraState = solarSystemRef.current.camera;
      const x = cameraState.distance * Math.sin(cameraState.polarAngle) * Math.cos(cameraState.azimuthAngle);
      const y = cameraState.distance * Math.cos(cameraState.polarAngle);
      const z = cameraState.distance * Math.sin(cameraState.polarAngle) * Math.sin(cameraState.azimuthAngle);
      
      camera.position.set(
        cameraState.target.x + x,
        cameraState.target.y + y,
        cameraState.target.z + z
      );
      camera.lookAt(cameraState.target.x, cameraState.target.y, cameraState.target.z);

      if (onCameraChange) {
        onCameraChange({
          distance: cameraState.distance,
          azimuth: cameraState.azimuthAngle * (180 / Math.PI),
          polar: cameraState.polarAngle * (180 / Math.PI)
        });
      }
    };

    // Animation loop
    const animateScene = () => {
      if (!animate) return;

      // Update time
      solarSystemRef.current.time += 0.01;

      // Animate star (Sun)
      if (solarSystemRef.current.star) {
        solarSystemRef.current.star.animate(solarSystemRef.current.time);
      }

      // Slowly rotate star field to create depth illusion
      if (solarSystemRef.current.starField) {
        solarSystemRef.current.starRotation.x += 0.0002;
        solarSystemRef.current.starRotation.y += 0.0003;
        solarSystemRef.current.starRotation.z += 0.0001;
        
        solarSystemRef.current.starField.rotation.x = solarSystemRef.current.starRotation.x;
        solarSystemRef.current.starField.rotation.y = solarSystemRef.current.starRotation.y;
        solarSystemRef.current.starField.rotation.z = solarSystemRef.current.starRotation.z;
      }

      // Animate planets
      solarSystemRef.current.planets.forEach(planet => {
        planet.animate(solarSystemRef.current.time);
        
        // Animate highlight ring if it exists
        if (planet.highlightMesh) {
          planet.highlightMesh.rotation.z += 0.01; // Rotate the highlight ring
          
          // Add pulsing effect
          const time = solarSystemRef.current.time;
          const pulseIntensity = 0.4 + Math.sin(time * 2) * 0.3;
          planet.highlightMesh.material.opacity = pulseIntensity;
        }
      });

      // Auto-rotate camera if enabled (smoother rotation)
      if (solarSystemRef.current.camera.autoRotate) {
        solarSystemRef.current.camera.azimuthAngle += 0.003;
      }

      // Update camera position
      updateCameraPosition();

      // Render scene
      renderer.render(scene, camera);
      
      animationRef.current = requestAnimationFrame(animateScene);
    };

    // Apply planet highlighting based on stored state
    const applyPlanetHighlight = () => {
      // Remove all existing highlights
      solarSystemRef.current.planets.forEach(planet => {
        if (planet.highlightMesh) {
          planet.planetGroup.remove(planet.highlightMesh);
          planet.highlightMesh.geometry.dispose();
          planet.highlightMesh.material.dispose();
          planet.highlightMesh = null;
        }
      });

      // Add highlight to selected planet
      const planetName = solarSystemRef.current.highlightedPlanetName;
      if (planetName !== 'none') {
        const targetPlanet = solarSystemRef.current.planets.find(planet => 
          planet.name.toLowerCase() === planetName.toLowerCase()
        );
        
        if (targetPlanet) {
          // Create highlight ring
          const ringGeometry = new THREE.RingGeometry(
            targetPlanet.data.size * 1.5, 
            targetPlanet.data.size * 1.8, 
            32
          );
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            emissive: 0xffff00,
            emissiveIntensity: 0.2
          });
          
          const highlightRing = new THREE.Mesh(ringGeometry, ringMaterial);
          highlightRing.rotation.x = Math.PI / 2;
          targetPlanet.planetGroup.add(highlightRing);
          targetPlanet.highlightMesh = highlightRing;
        }
      }
    };

    // Expose camera controls
    if (cameraControls) {
      window.pixelRendererCameraControls = {
        setDistance: (distance) => {
          solarSystemRef.current.camera.distance = Math.max(20, Math.min(300, distance));
          updateCameraPosition();
          if (!animate) renderer.render(scene, camera);
        },
        setAzimuth: (angle) => {
          solarSystemRef.current.camera.azimuthAngle = angle * (Math.PI / 180);
          updateCameraPosition();
          if (!animate) renderer.render(scene, camera);
        },
        setPolar: (angle) => {
          solarSystemRef.current.camera.polarAngle = Math.max(0.1, Math.min(Math.PI - 0.1, angle * (Math.PI / 180)));
          updateCameraPosition();
          if (!animate) renderer.render(scene, camera);
        },
        setAutoRotate: (enabled) => {
          solarSystemRef.current.camera.autoRotate = enabled;
        },
        highlightPlanet: (planetName) => {
          // Store the highlighted planet name
          solarSystemRef.current.highlightedPlanetName = planetName;
          
          // Apply highlight immediately
          applyPlanetHighlight();

          if (!animate) renderer.render(scene, camera);
        }
      };
    }

    // Initialize 3D solar system
    createStarField();
    createStar();
    createPlanets();
    
    // Apply initial highlighting based on props
    solarSystemRef.current.highlightedPlanetName = highlightedPlanet;
    applyPlanetHighlight();
    
    setIsLoaded(true);
    
    // Start animation
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
      
      // Cleanup planets using Planet class dispose method
      if (solarSystem.planets) {
        solarSystem.planets.forEach(planet => planet.dispose());
      }
      
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [pixelSize, width, height, animate, cameraControls, onCameraChange, starCount, highlightedPlanet, sunBrightness]);

  // Handle planet highlighting changes
  useEffect(() => {
    if (window.pixelRendererCameraControls && window.pixelRendererCameraControls.highlightPlanet) {
      window.pixelRendererCameraControls.highlightPlanet(highlightedPlanet);
    }
  }, [highlightedPlanet]);

  return (
    <div className={`pixel-renderer ${className}`}>
      <div
        ref={mountRef}
        className={`pixel-canvas ${!isLoaded ? 'loading' : ''}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      {!isLoaded && (
        <div className="pixel-loading">
          <div className="loading-pixels">Loading 3D Scene...</div>
        </div>
      )}
    </div>
  );
};

export default PixelRenderer;
