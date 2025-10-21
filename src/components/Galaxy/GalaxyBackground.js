import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import createGalaxy from './galaxyFactory';

const GalaxyBackground = ({ 
  galaxyType,
  animate = true,
  opacity = 1.0,
  cameraDistance = 1000,
  rotationSpeed = 0.0002,
  className = '',
  style = {},
  pixelRatio = 0.75,
  includeStarfield = true,
  zIndex = 1,
  parallaxStrength = 5,
  parallaxSmoothness = 0.12,
  parallaxPixelCap = 20000,
}) => {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const currentGalaxyRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });

  // Set default galaxy type only if undefined (allow null to pass through)
  const effectiveGalaxyType = galaxyType === undefined ? 'milky_way' : galaxyType;

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const rect = mount.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    // Create scene
    const scene = new THREE.Scene();
    
    // Add ambient lighting to make stars visible (only if galaxy exists)
    if (effectiveGalaxyType) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1000, 1000, 1000);
      scene.add(directionalLight);
    }
    
    sceneRef.current = scene;

    // Create camera - positioned inside galaxy bounds for immersive view
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50000);
    camera.position.set(200, 150, cameraDistance); // Inside galaxy bounds
    camera.lookAt(0, 0, 0); // Point camera at galaxy center
    cameraRef.current = camera;

    // Create renderer with lower pixel ratio for performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing for better performance
      alpha: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true // Better depth precision to prevent z-fighting
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.sortObjects = true; // Enable depth sorting
    rendererRef.current = renderer;

    // Clear existing content
    mount.innerHTML = '';
    
    // Style the canvas for full coverage
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    
    mount.appendChild(renderer.domElement);

    // Clear any existing galaxy from scene
    if (currentGalaxyRef.current) {
      currentGalaxyRef.current.dispose();
      currentGalaxyRef.current = null;
    }

    // Create single galaxy (only if galaxyType is provided)
    let galaxy = null;
    if (effectiveGalaxyType) {
      galaxy = createGalaxy(scene, effectiveGalaxyType);
      // factory returns an instance (subclass or base) with galaxyGroup
      galaxy.galaxyGroup.position.set(0, 0, 0);
      galaxy.galaxyGroup.renderOrder = 1; // Render galaxy in front of starfield
      currentGalaxyRef.current = galaxy;
    }
    
    // Add extended starfield outside galaxy bounds
    const createExtendedStarfield = () => {
      const starfieldGeometry = new THREE.BufferGeometry();
      // Optimize star count and distribution for starfield-only display
      const starfieldCount = effectiveGalaxyType ? 4000 : 8000; 
      const positions = new Float32Array(starfieldCount * 3);
      const colors = new Float32Array(starfieldCount * 3);
      
      for (let i = 0; i < starfieldCount; i++) {
        const i3 = i * 3;
        
        // Create stars in a much larger sphere
        // More varied distribution for starfield-only mode
        const minRadius = effectiveGalaxyType ? 5000 : 1000;
        const maxRadius = effectiveGalaxyType ? 20000 : 30000;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Ensure no NaN values
        positions[i3] = isNaN(x) ? 0 : x;
        positions[i3 + 1] = isNaN(y) ? 0 : y;
        positions[i3 + 2] = isNaN(z) ? 0 : z;
        
        // More varied brightness for starfield-only mode
        const brightness = effectiveGalaxyType ? 0.15 + Math.random() * 0.05 : 0.3 + Math.random() * 0.4;
        // Add some color variation for more interesting starfield
        if (!effectiveGalaxyType && Math.random() > 0.8) {
          // 20% chance of slightly colored stars
          const colorType = Math.random();
          if (colorType < 0.33) {
            // Blue-ish stars
            colors[i3] = brightness * 0.8; // Red
            colors[i3 + 1] = brightness * 0.9; // Green  
            colors[i3 + 2] = brightness; // Blue
          } else if (colorType < 0.66) {
            // Warm/orange stars
            colors[i3] = brightness; // Red
            colors[i3 + 1] = brightness * 0.8; // Green  
            colors[i3 + 2] = brightness * 0.6; // Blue
          } else {
            // White stars
            colors[i3] = brightness; // Red
            colors[i3 + 1] = brightness; // Green  
            colors[i3 + 2] = brightness; // Blue
          }
        } else {
          // Default white stars
          colors[i3] = brightness; // Red
          colors[i3 + 1] = brightness; // Green  
          colors[i3 + 2] = brightness; // Blue
        }
      }
      
      // Create size array for custom shader
      const sizes = new Float32Array(starfieldCount);
      for (let i = 0; i < starfieldCount; i++) {
        sizes[i] = effectiveGalaxyType ? 4 : 6; // Larger stars for starfield-only mode
      }
      
      starfieldGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starfieldGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      starfieldGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Create custom shader material for square pixels
      const vertexShader = `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;
      
      const fragmentShader = `
        varying vec3 vColor;
        void main() {
          // Create square pixels instead of circles
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = max(abs(center.x), abs(center.y));
          if (dist > 0.4) discard; // Square shape
          gl_FragColor = vec4(vColor, 1.0);
        }
      `;

      const starfieldMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });
      
      const starfield = new THREE.Points(starfieldGeometry, starfieldMaterial);
      starfield.renderOrder = -1; // Render starfield first (behind galaxy)
      scene.add(starfield);
      
      return starfield;
    };
    
    const extendedStarfield = includeStarfield ? createExtendedStarfield() : null;
    if (extendedStarfield) {
      scene.add(extendedStarfield);
    }
    
    // Set initial rotation for the galaxy
    const setupGalaxyRotation = (galaxyObj) => {
      if (!galaxyObj) return;
      // Base tilt to show spiral structure
      const baseX = Math.PI * 0.4;
      const baseY = Math.PI * 0.2;
      const baseZ = Math.PI * 0.05;

      // Apply any random tilt provided by the galaxy instance
      const tilt = galaxyObj.randomTilt || { x: 0, y: 0, z: 0 };

      galaxyObj.galaxyGroup.rotation.x = baseX + tilt.x;
      galaxyObj.galaxyGroup.rotation.y = baseY + tilt.y;
      galaxyObj.galaxyGroup.rotation.z = baseZ + tilt.z;
    };

    setupGalaxyRotation(currentGalaxyRef.current);

    // Set opacity and brightness for background effect
    const applyOpacityToGalaxy = (galaxyObj) => {
      if (!galaxyObj) return;
      galaxyObj.galaxyGroup.traverse((child) => {
        if (child.material) {
          // Skip starfield materials (size 4) to keep them visible
          if (child.material.size === 4) return;
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = true;
              mat.opacity = opacity;
              mat.depthWrite = false; // Prevent z-fighting
              mat.depthTest = true;
              // Increase emissive to make stars brighter
              if (mat.emissive) {
                mat.emissive.multiplyScalar(2);
              }
              mat.needsUpdate = true;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = opacity;
            child.material.depthWrite = false; // Prevent z-fighting
            child.material.depthTest = true;
            // Increase emissive to make stars brighter
            if (child.material.emissive) {
              child.material.emissive.multiplyScalar(2);
            }
            child.material.needsUpdate = true;
          }
        }
      });
    };
    
    // Modify galaxy to make center darker and fix shape issues
    const modifyGalaxyCenter = (galaxyObj) => {
      try {
        galaxyObj.galaxyGroup.traverse((child) => {
          if (child.isPoints && child.geometry) {
            const positions = child.geometry.attributes.position;
            const colors = child.geometry.attributes.color;
            
            if (positions && colors) {
              const positionArray = positions.array;
              const colorArray = colors.array;
              
              // Debug: Log geometry info
              // console.log(`Processing geometry with ${positionArray.length} positions`);
              
              // Check for NaN or infinite values in positions
              let hasInvalidValues = false;
              let invalidCount = 0;
              for (let i = 0; i < positionArray.length; i++) {
                if (isNaN(positionArray[i]) || !isFinite(positionArray[i])) {
                  hasInvalidValues = true;
                  invalidCount++;
                }
              }
              
              if (hasInvalidValues) {
                console.warn(`Skipping geometry with ${invalidCount} invalid position values out of ${positionArray.length}`);
                // Remove this object from the scene to prevent further errors
                if (child.parent) {
                  child.parent.remove(child);
                }
                return; // Skip this geometry
              }
              
              for (let i = 0; i < positionArray.length; i += 3) {
                const x = positionArray[i];
                const y = positionArray[i + 1];
                const z = positionArray[i + 2];
                
                // Calculate distance from center
                const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
                
                // Make stars within a certain radius of center darker
                if (distanceFromCenter < 200) { // Adjust radius as needed
                  const darknessFactor = Math.max(0.1, 1 - (distanceFromCenter / 200));
                  colorArray[i] *= darknessFactor;     // R
                  colorArray[i + 1] *= darknessFactor; // G  
                  colorArray[i + 2] *= darknessFactor; // B
                }
                
                // Removed position adjustments that were creating rectangular shapes
              }
              
              positions.needsUpdate = true;
              colors.needsUpdate = true;
              
              // Override computeBoundingSphere to prevent NaN errors
              child.geometry.computeBoundingSphere = function() {
                // Always set a dummy bounding sphere to prevent Three.js from computing it
                if (!this.boundingSphere) {
                  this.boundingSphere = { center: { x: 0, y: 0, z: 0 }, radius: 10000 };
                }
                return this.boundingSphere;
              };
              
              // Final check for NaN values before computeBoundingSphere
              let hasInvalidValuesAfter = false;
              let invalidCountAfter = 0;
              for (let i = 0; i < positionArray.length; i++) {
                if (isNaN(positionArray[i]) || !isFinite(positionArray[i])) {
                  hasInvalidValuesAfter = true;
                  invalidCountAfter++;
                }
              }
              
              if (!hasInvalidValuesAfter) {
                // Safely compute bounding sphere
                try {
                  // console.log('Computing bounding sphere...');
                  // Temporarily disable computeBoundingSphere to prevent errors
                  // child.geometry.computeBoundingSphere();
                  // console.log('Bounding sphere computation skipped');
                } catch (error) {
                  console.warn('Failed to compute bounding sphere:', error);
                }
              } else {
                console.warn(`Positions became invalid after processing (${invalidCountAfter} invalid values), skipping computeBoundingSphere`);
              }
            }
          }
        });
      } catch (error) {
        console.error('Error in modifyGalaxyCenter:', error);
      }
    };
    
    // Apply modifications and opacity to the galaxy
    if (currentGalaxyRef.current) {
      modifyGalaxyCenter(currentGalaxyRef.current);
      applyOpacityToGalaxy(currentGalaxyRef.current);
      setTimeout(() => {
        applyOpacityToGalaxy(currentGalaxyRef.current);
      }, 200);
    }

    // Animation loop
    const animateScene = () => {
      if (!animate) return;

      animationFrameRef.current = requestAnimationFrame(animateScene);

      // Galaxy rotation
      rotationRef.current.y += rotationSpeed;
      rotationRef.current.x += rotationSpeed * 0.1;

      // Apply rotation to the galaxy
      if (currentGalaxyRef.current?.galaxyGroup) {
        currentGalaxyRef.current.galaxyGroup.rotation.y = rotationRef.current.y;
        currentGalaxyRef.current.galaxyGroup.rotation.x = Math.PI * 0.4 + Math.sin(rotationRef.current.x) * 0.02;
      }

      // Subtle camera movement - staying inside galaxy bounds
      if (camera) {
        camera.position.x = 200 + Math.sin(rotationRef.current.y * 0.3) * 100;
        camera.position.y = 150 + Math.cos(rotationRef.current.y * 0.2) * 50;
        camera.position.z = cameraDistance + Math.cos(rotationRef.current.y * 0.1) * 100;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    // Initial render
    renderer.render(scene, camera);

    if (animate) {
      animateScene();
    }

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const newRect = mountRef.current.getBoundingClientRect();
      const newWidth = newRect.width || window.innerWidth;
      const newHeight = newRect.height || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      
      if (!animate) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (currentGalaxyRef.current) {
        currentGalaxyRef.current.dispose();
      }

      if (renderer) {
        renderer.dispose();
      }

      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [effectiveGalaxyType, animate, opacity, cameraDistance, rotationSpeed, pixelRatio, includeStarfield]);


  return (
    <div 
      ref={containerRef}
      className={`galaxy-background ${className}`}
      style={{
        position: 'inherit',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        ...style
      }}
    >
      <div 
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default GalaxyBackground;
