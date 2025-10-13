import * as THREE from 'three';
import { Star } from './Star';
import { Planet } from './Planet';

// Helper function to create square pixel material for stars
const createSquarePixelMaterial = (defaultColor = 0xffffff, defaultSize = 4, opacity = 1.0, transparent = false) => {
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    attribute vec3 customColor;
    varying vec3 vColor;
    uniform float defaultSize;
    void main() {
      // Use customColor if it exists, otherwise use standard color attribute
      // Check if customColor has non-zero values (indicates it was set)
      float colorSum = customColor.x + customColor.y + customColor.z;
      vColor = colorSum > 0.0 ? customColor : color;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float pointSize = size > 0.0 ? size : defaultSize;
      gl_PointSize = pointSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    uniform float opacity;
    varying vec3 vColor;
    void main() {
      // Create square pixels instead of circles
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = max(abs(center.x), abs(center.y));
      if (dist > 0.4) discard; // Square shape
      gl_FragColor = vec4(vColor, opacity);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      opacity: { value: opacity },
      defaultSize: { value: defaultSize }
    },
    transparent: transparent,
    depthWrite: false,
    depthTest: true
  });
};

export class Galaxy {
  constructor(scene, galaxyType) {
    this.scene = scene;
    this.galaxyGroup = new THREE.Group();
    this.starSystems = [];
    this.nebulae = [];
    this.spiralArms = [];
    this.galacticCore = null;
    this.galacticBar = null;
    
    // Central registry for all celestial objects for inter-object physics
    this.celestialObjects = new Map(); // Map of id -> object for fast lookup
    this.stars = new Map();
    this.planets = new Map();
    this.moons = new Map();
    this.blackHoles = new Map();
    this.asteroids = new Map();
    this.comets = new Map();
    
    // Animation timing for physics
    this.lastTime = null;
    
    // Store galaxy type
    this.galaxyType = galaxyType;
    
    // Set default parameters (subclasses will override)
    this.setDefaultGalaxyParameters();
    // Small random tilt so galaxies are not perfectly flat to the camera
    // Store as small deltas to be applied by the renderer
    this.randomTilt = {
      x: (Math.random() - 0.5) * 0.3, // +/- ~0.15 rad
      y: (Math.random() - 0.5) * 0.6, // +/- ~0.3 rad
      z: (Math.random() - 0.5) * 0.12 // +/- ~0.06 rad
    };
    
    // Only create galaxy if this is the base Galaxy class (not a subclass)
    if (this.constructor === Galaxy) {
      this.createGalaxy();
    }
    this.scene.add(this.galaxyGroup);
  }

  setDefaultGalaxyParameters() {
    // Base galaxy defaults (subclasses will override)
    this.colors = {};
    this.name = 'Unknown Galaxy';
    this.description = 'A distant galaxy';
    this.galaxyRadius = 2000;
    this.coreRadius = 200;
    this.armCount = 0;
    this.nebulaCount = 20;
    this.rotationSpeed = 0.3;
    this.armTightness = 0.3;
    this.hasArms = false;

    // Default star counts (subclasses will override)
    this.starCounts = {
      coreStars: 5000,
      armStars: 15000,
      diskStars: 10000,
      haloStars: 2000
    };
    
    // Star system count
    this.starSystemCount = 50;
    
    // Animation and depth properties
    this.animationType = this.getAnimationType();
    this.depthVariation = this.getDepthVariation();
    this.planetDepthRange = this.getPlanetDepthRange();
    this.starDepthRange = this.getStarDepthRange();
    
    // Black hole specific properties
    if (this.hasBlackHole) {
      this.accretionParticles = [];
      this.infallingMatter = [];
      this.jetParticles = [];
    }
  }

  getAnimationType() {
    // Different animation styles based on galaxy type
    switch (this.type) {
      case 'black_hole':
        return 'accretion';
      case 'dual':
        return 'orbital';
      case 'irregular':
        return 'chaotic';
      case 'ring':
        return 'expansion';
      case 'peculiar':
        return 'collision';
      case 'elliptical':
        return 'slow_rotation';
      case 'lenticular':
        return 'wobble';
      case 'spiral':
        return 'differential_rotation';
      case 'star_field':
      case 'empty':
        return 'drift';
      case 'cluster':
        return 'cluster_rotation';
      default:
        return 'standard_rotation';
    }
  }

  getDepthVariation() {
    // How much Z-depth variation for stars and planets
    switch (this.type) {
      case 'spiral':
      case 'lenticular':
        return 0.3; // Moderate thickness
      case 'elliptical':
        return 0.8; // More spherical
      case 'irregular':
        return 0.6; // Chaotic distribution
      case 'dual':
        return 0.4; // Two overlapping disks
      case 'black_hole':
        return 0.2; // Flatter accretion disk
      case 'ring':
        return 0.1; // Very thin ring
      case 'star_field':
        return 1.0; // Full 3D space
      case 'empty':
        return 1.2; // Very sparse 3D distribution
      case 'cluster':
        return 0.9; // Spherical clusters
      default:
        return 0.3;
    }
  }

  getPlanetDepthRange() {
    // Planet Z-depth randomization range
    return this.depthVariation * 200;
  }

  getStarDepthRange() {
    // Star Z-depth randomization range  
    return this.depthVariation * 150;
  }

  createGalaxy() {
    // Create spiral arms first so core can render on top
    if (this.hasArms !== false) {
      this.createSpiralArms();
    }
    
    // Create core last so it renders on top of arms near center
    this.createGalacticCore();
    
    if (this.hasRing) {
      this.createRingStructure();
    }
    
    if (this.hasDisk) {
      this.createGalacticDisk();
    }
    
    if (this.chaotic) {
      this.createChaoticStructure();
    } else if (this.type === 'elliptical' || this.type === 'dwarf-elliptical') {
      this.createEllipticalStructure();
    } else if (this.type === 'lenticular') {
      this.createLenticularDisk();
    }
    
    if (this.hasDual) {
      this.createDualGalaxies();
    }
    
    if (this.hasBlackHole) {
      this.createBlackHole();
    }
    
    if (this.hasStarField) {
      this.createStarField();
    }
    
    if (this.hasEmptySpace) {
      this.createEmptySpace();
    }
    
    if (this.hasCluster) {
      this.createStarCluster();
    }
    
    this.createNebulae();
    this.createStarSystems();
    this.createGalacticHalo();
  }

  createGalacticCore() {
    // Remove bright central bulge - just use particles for star mass
    // Add central light source (dimmed since no central sphere)
    const coreLight = new THREE.PointLight(0xFFDD88, 0.5, this.coreRadius * 2);
    coreLight.position.set(0, 0, 0);
    this.galaxyGroup.add(coreLight);
    
    // Add core particle effect (individual stars, not a solid circle)
    this.createCoreParticles();
  }

  createGalacticBar() {
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create elongated bar structure
      const t = (Math.random() - 0.5) * 2; // -1 to 1
      const x = t * this.barLength * 0.5;
      const y = (Math.random() - 0.5) * this.barWidth * 0.3;
      const z = (Math.random() - 0.5) * this.barWidth;
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Bar colors (yellow-orange older stars)
      const intensity = 0.6 + Math.random() * 0.4;
      colors[i * 3] = intensity;
      colors[i * 3 + 1] = intensity * 0.9;
      colors[i * 3 + 2] = intensity * 0.6;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.galacticBar = new THREE.Points(geometry, material);
    this.galaxyGroup.add(this.galacticBar);
  }

  createCoreParticles() {
    const particleCount = 25000; // Increased from 15000 for much denser center
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Very dense center distribution - higher power to favor smaller radii much more
      const randomValue = Math.random();
      const radius = Math.pow(randomValue, 0.3) * this.coreRadius * 0.8; // Much more dense at center
      const theta = Math.random() * Math.PI * 2; // Azimuthal angle (0-2π)
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle (0-π)
      
      // Convert spherical to cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Core colors - same as spiral arms (blue-white with some red giants)
      const distanceFromCenter = radius / (this.coreRadius * 0.8);
      const centerBoost = 1 + (1 - distanceFromCenter) * 0.8; // More brightness boost at center
      
      if (Math.random() < 0.7) {
        // Blue-white stars (young) - same as spiral arms
        colors[i * 3] = centerBoost * 0.8;
        colors[i * 3 + 1] = centerBoost * 0.9;
        colors[i * 3 + 2] = centerBoost;
      } else {
        // Red giants - same as spiral arms
        colors[i * 3] = centerBoost;
        colors[i * 3 + 1] = centerBoost * 0.3;
        colors[i * 3 + 2] = centerBoost * 0.1;
      }
    }
    
    // Create size array for custom shader
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 2; // Core star size
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = createSquarePixelMaterial(0xffffff, 2, 0.8, true);
    material.blending = THREE.AdditiveBlending;
    
    const coreParticles = new THREE.Points(geometry, material);
    this.galaxyGroup.add(coreParticles);
  }

  createSpiralArms() {
    for (let arm = 0; arm < this.armCount; arm++) {
      const armParticles = this.createSpiralArm(arm);
      this.spiralArms.push(armParticles);
      this.galaxyGroup.add(armParticles);
    }
  }

  createSpiralArm(armIndex) {
    let particleCount = 15000;
    
    // Reduce spiral arm particles for starburst galaxies by 50%
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    if (isStarburst) {
      particleCount = Math.floor(particleCount * 0.5);
    }
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const armAngleOffset = (armIndex / this.armCount) * Math.PI * 2;
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral arm equation with lower density at center
      // Use power function to concentrate particles toward outer regions
      const normalizedT = i / particleCount; // 0 to 1
      const t = Math.pow(normalizedT, 0.7) * Math.PI * 4; // Power < 1 concentrates at outer regions
      const armRadius = (t / (Math.PI * 4)) * this.galaxyRadius; // Start from 0, go to galaxyRadius
      
      // Add spiral curvature
      const spiralAngle = armAngleOffset + t * 0.3;
      
      // Add random scatter for realistic arm structure
      const scatter = (Math.random() - 0.5) * armRadius * 0.2;
      const finalRadius = armRadius + scatter;
      
      const x = finalRadius * Math.cos(spiralAngle);
      const z = finalRadius * Math.sin(spiralAngle);
      const y = (Math.random() - 0.5) * 50; // Thin galactic disk
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Arm colors with fading at edges and center
      const distance = Math.sqrt(x * x + z * z);
      const distanceRatio = distance / this.galaxyRadius;
      
      // Fade out stars at the outer edge - goes to 0 instead of minimum 0.3
      const fadeStart = 0.7; // Start fading at 70% of galaxy radius
      let brightness;
      if (distanceRatio < fadeStart) {
        brightness = Math.max(0.1, 1 - (distanceRatio / fadeStart) * 0.5);
      } else {
        // Fade out from fadeStart to galaxyRadius
        const fadeRatio = (distanceRatio - fadeStart) / (1 - fadeStart);
        brightness = Math.max(0, 0.5 * (1 - fadeRatio));
      }
      
      // Additional fade-out near center to blend with core stars
      const coreRadiusRatio = this.coreRadius / this.galaxyRadius;
      if (distanceRatio < coreRadiusRatio * 1.5) { // Fade within 1.5x core radius
        const coreFadeRatio = distanceRatio / (coreRadiusRatio * 1.5);
        brightness *= Math.max(0.1, coreFadeRatio); // Very dim near center
      }
      
      if (Math.random() < 0.7) {
        // Blue-white stars (young)
        colors[i * 3] = brightness * 0.8;
        colors[i * 3 + 1] = brightness * 0.9;
        colors[i * 3 + 2] = brightness;
      } else {
        // Red giants
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness * 0.3;
        colors[i * 3 + 2] = brightness * 0.1;
      }
      
      sizes[i] = brightness * 3 + 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }

  createEllipticalStructure() {
    const particleCount = 25000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Elliptical distribution - more concentrated toward center
      const u = Math.random();
      const radius = this.galaxyRadius * Math.pow(u, 0.3); // More central concentration
      
      // Elliptical shape (flattened sphere)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * this.flatness;
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Older, redder stars
      const distance = Math.sqrt(x * x + y * y + z * z);
      const brightness = Math.max(0.2, 1 - (distance / this.galaxyRadius));
      
      colors[i * 3] = brightness * 0.9;
      colors[i * 3 + 1] = brightness * 0.6;
      colors[i * 3 + 2] = brightness * 0.3;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    
    const ellipticalStructure = new THREE.Points(geometry, material);
    this.galaxyGroup.add(ellipticalStructure);
  }

  createChaoticStructure() {
    // Don't create chaotic colored clusters for empty or star-field-only galaxies
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    if (this.type === 'empty' || this.hasEmptySpace || this.hasStarField || isStarburst) {
      return;
    }

    // Limit the number of chaotic clusters based on configuration
    const clusterCount = Math.min(8, this.clusterCount || 8);

    for (let cluster = 0; cluster < clusterCount; cluster++) {
      const particleCount = Math.floor(1000 + Math.random() * 2000);
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Random cluster center
      const clusterX = (Math.random() - 0.5) * this.galaxyRadius;
      const clusterY = (Math.random() - 0.5) * this.galaxyRadius * 0.4;
      const clusterZ = (Math.random() - 0.5) * this.galaxyRadius;

      const clusterSize = 100 + Math.random() * 200;

      for (let i = 0; i < particleCount; i++) {
        // Gaussian distribution around cluster center
        const radius = Math.abs(this.gaussianRandom()) * clusterSize;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        const x = clusterX + radius * Math.sin(phi) * Math.cos(theta);
        const y = clusterY + radius * Math.cos(phi) * 0.5;
        const z = clusterZ + radius * Math.sin(phi) * Math.sin(theta);

        // Ensure no NaN values
        positions[i * 3] = isNaN(x) ? clusterX : x;
        positions[i * 3 + 1] = isNaN(y) ? clusterY : y;
        positions[i * 3 + 2] = isNaN(z) ? clusterZ : z;

        // Mixed star colors (active star formation)
        const starType = Math.random();
        if (starType < 0.4) {
          // Blue young stars
          colors[i * 3] = 0.6 + Math.random() * 0.4;
          colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
          colors[i * 3 + 2] = 1.0;
        } else if (starType < 0.7) {
          // Yellow stars
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.9;
          colors[i * 3 + 2] = 0.6;
        } else {
          // Red stars
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.4;
          colors[i * 3 + 2] = 0.2;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const chaoticCluster = new THREE.Points(geometry, material);
      this.galaxyGroup.add(chaoticCluster);
    }
  }

  createRingStructure() {
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Ring structure
      const ringRadius = this.ringRadius + (Math.random() - 0.5) * this.ringWidth;
      const theta = Math.random() * Math.PI * 2;
      
      const x = ringRadius * Math.cos(theta);
      const z = ringRadius * Math.sin(theta);
      const y = (Math.random() - 0.5) * 80; // Thin ring
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Ring colors (bright blue-white from shock waves)
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness * 0.8;
      colors[i * 3 + 1] = brightness * 0.9;
      colors[i * 3 + 2] = brightness;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    const ringStructure = new THREE.Points(geometry, material);
    this.galaxyGroup.add(ringStructure);
  }

  createLenticularDisk() {
    const particleCount = 20000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Very flat disk distribution
      const radius = Math.sqrt(Math.random()) * this.galaxyRadius;
      const theta = Math.random() * Math.PI * 2;
      
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = (Math.random() - 0.5) * 30; // Very thin
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Smooth gradient from center (older stars)
      const distance = radius;
      const brightness = Math.max(0.3, 1 - (distance / this.galaxyRadius));
      
      colors[i * 3] = brightness * 0.9;
      colors[i * 3 + 1] = brightness * 0.7;
      colors[i * 3 + 2] = brightness * 0.4;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    const lenticularDisk = new THREE.Points(geometry, material);
    this.galaxyGroup.add(lenticularDisk);
  }

  createGalacticDisk() {
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.sqrt(Math.random()) * this.galaxyRadius * 0.8;
      const theta = Math.random() * Math.PI * 2;
      
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = (Math.random() - 0.5) * 40;
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      const brightness = Math.max(0.4, 1 - (radius / this.galaxyRadius));
      colors[i * 3] = brightness * 0.8;
      colors[i * 3 + 1] = brightness * 0.8;
      colors[i * 3 + 2] = brightness * 0.6;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    
    const galacticDisk = new THREE.Points(geometry, material);
    this.galaxyGroup.add(galacticDisk);
  }

  gaussianRandom() {
    // Box-Muller transform for Gaussian distribution
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  createNebulae() {
    // Do not add colored nebulae for empty or star-field-only galaxies
    if (this.type === 'empty' || this.hasEmptySpace || this.hasStarField) {
      return;
    }

    for (let i = 0; i < this.nebulaCount; i++) {
      const nebula = this.createNebula();
      this.nebulae.push(nebula);
      this.galaxyGroup.add(nebula);
    }
  }

  createNebula() {
    const nebulaSize = 100 + Math.random() * 200;
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Random position in galaxy
    const angle = Math.random() * Math.PI * 2;
    const distance = this.coreRadius + Math.random() * (this.galaxyRadius - this.coreRadius);
    const centerX = distance * Math.cos(angle);
    const centerZ = distance * Math.sin(angle);
    const centerY = (Math.random() - 0.5) * 100;
    
    // Nebula color types
    const nebulaColors = [
      { r: 1, g: 0.2, b: 0.8 }, // Pink (H-alpha)
      { r: 0.2, g: 0.8, b: 1 }, // Blue (reflection)
      { r: 1, g: 0.6, b: 0.2 }, // Orange (emission)
      { r: 0.8, g: 1, b: 0.3 }, // Green (ionized oxygen)
    ];
    
    const nebulaColor = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
    
    for (let i = 0; i < particleCount; i++) {
      // Cloudy distribution
      const radius = Math.random() * nebulaSize;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
      const y = centerY + (Math.random() - 0.5) * nebulaSize * 0.3;
      const z = centerZ + radius * Math.sin(phi) * Math.sin(theta);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? centerX : x;
      positions[i * 3 + 1] = isNaN(y) ? centerY : y;
      positions[i * 3 + 2] = isNaN(z) ? centerZ : z;
      
      // Varying nebula intensity
      const intensity = Math.random() * 0.8 + 0.2;
      colors[i * 3] = nebulaColor.r * intensity;
      colors[i * 3 + 1] = nebulaColor.g * intensity;
      colors[i * 3 + 2] = nebulaColor.b * intensity;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }

  createStarSystems() {
    // Disabled detailed star systems to maintain pixel art aesthetic
    // const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    // const detailedChance = isStarburst ? 0.002 : 0.01; // much lower for starbursts
    // for (let i = 0; i < this.starSystemCount; i++) {
    //   if (Math.random() < detailedChance) {
    //     this.createDetailedStarSystem();
    //   }
    // }
  }

  createDetailedStarSystem() {
    let x, y, z;
    
    if (this.hasArms && this.armCount > 0) {
      // Random position in galaxy arms
      const armIndex = Math.floor(Math.random() * this.armCount);
      const armProgress = Math.random();
      const t = armProgress * Math.PI * 4;
      const armRadius = this.coreRadius + armProgress * (this.galaxyRadius - this.coreRadius);
      const armAngleOffset = (armIndex / this.armCount) * Math.PI * 2;
      const spiralAngle = armAngleOffset + t * 0.3;
      
      x = armRadius * Math.cos(spiralAngle) + (Math.random() - 0.5) * 100;
      z = armRadius * Math.sin(spiralAngle) + (Math.random() - 0.5) * 100;
      y = (Math.random() - 0.5) * 20;
    } else {
      // Random position in galaxy for non-spiral types
      const radius = Math.random() * this.galaxyRadius * 0.8;
      const theta = Math.random() * Math.PI * 2;
      
      x = radius * Math.cos(theta);
      z = radius * Math.sin(theta);
      y = (Math.random() - 0.5) * this.galaxyRadius * 0.1;
    }
    
    // Ensure positions are valid
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    z = isNaN(z) ? 0 : z;
    
    // Create star
    const isStarburstLocal = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    const starData = {
      name: `Star-${this.starSystems.length}`,
      size: isStarburstLocal ? (1 + Math.random() * 2) : (2 + Math.random() * 4),
      color: Math.random() < 0.7 ? 0xFFFFDD : 0xFF6600,
      type: Math.random() < 0.7 ? 'G-class' : 'K-class',
      intensity: isStarburstLocal ? (0.4 + Math.random() * 0.8) : (1 + Math.random() * 2),
      lightDistance: isStarburstLocal ? 30 : 50,
      decay: 2,
      x: x,
      y: y,
      z: z
    };
    
    const star = new Star(starData, this.scene, this);
    
  // Create planets (fewer for starburst to avoid overload)
  const planetCount = isStarburstLocal ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8) + 1;
    const starSystem = {
      star: star,
      planets: []
    };
    
    for (let p = 0; p < planetCount; p++) {
      const planetData = {
        name: `Planet-${this.starSystems.length}-${p}`,
        radius: isStarburstLocal ? (6 + p * 6) : (10 + p * 8),
        size: isStarburstLocal ? (0.4 + Math.random() * 1.0) : (0.5 + Math.random() * 2),
        color: this.getRandomPlanetColor(),
        speed: isStarburstLocal ? 0.03 / (p + 1) : 0.02 / (p + 1),
        rotationSpeed: isStarburstLocal ? 0.008 + Math.random() * 0.015 : 0.01 + Math.random() * 0.02,
        surfaceType: this.getRandomSurfaceType(),
        hasRings: Math.random() < 0.05,
        moons: [],
        // Add position data for physics system
        x: x,
        y: y,
        z: z
      };
      
      const planet = new Planet(planetData, this.scene, this);
      planet.orbitGroup.position.set(x, y, z);
      starSystem.planets.push(planet);
    }
    
    this.starSystems.push(starSystem);
  }

  createReplacementStarSystem() {
    // Create a new simple star system near the galaxy outskirts to maintain population
    const radius = this.galaxyRadius * (0.7 + Math.random() * 0.25);
    const theta = Math.random() * Math.PI * 2;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    const y = (Math.random() - 0.5) * this.galaxyRadius * 0.1;

    const starData = {
      name: `Respawn-${Date.now()}`,
      size: 1.5 + Math.random() * 3,
      color: 0xFFFFDD,
      type: 'G-class',
      intensity: 0.6 + Math.random() * 1.4,
      lightDistance: 50,
      decay: 2,
      x: x,
      y: y,
      z: z
    };

    const star = new Star(starData, this.scene, this);
    const planetCount = Math.floor(Math.random() * 3); // fewer planets for replacements
    const starSystem = { star: star, planets: [] };

    for (let p = 0; p < planetCount; p++) {
      const planetData = {
        name: `Respawn-Planet-${p}`,
        radius: 20 + p * 12,
        size: 0.5 + Math.random() * 1.5,
        color: this.getRandomPlanetColor(),
        speed: 0.02 / (p + 1),
        rotationSpeed: 0.01 + Math.random() * 0.02,
        surfaceType: this.getRandomSurfaceType(),
        hasRings: Math.random() < 0.05,
        moons: [],
        // Add position data for physics system
        x: x,
        y: y,
        z: z
      };
      const planet = new Planet(planetData, this.scene, this);
      planet.orbitGroup.position.set(x, y, z);
      starSystem.planets.push(planet);
    }

    this.starSystems.push(starSystem);
  }

  createGalacticHalo() {
    // Sparse halo stars around the galaxy
    const haloParticleCount = 2000;
    const positions = new Float32Array(haloParticleCount * 3);
    const colors = new Float32Array(haloParticleCount * 3);
    
    for (let i = 0; i < haloParticleCount; i++) {
      // Spherical halo distribution
      const radius = this.galaxyRadius + Math.random() * this.galaxyRadius * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 0.3; // Slightly flattened
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Old red stars in halo
      const brightness = 0.3 + Math.random() * 0.4;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.6;
      colors[i * 3 + 2] = brightness * 0.3;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    const halo = new THREE.Points(geometry, material);
    this.galaxyGroup.add(halo);
  }

  getRandomPlanetColor() {
    const planetColors = [
      0x4A90E2, // Blue (water world)
      0xD2691E, // Brown (desert)
      0x228B22, // Green (forest)
      0xFF6347, // Red (mars-like)
      0x9370DB, // Purple (exotic)
      0xFFD700, // Gold (gas giant)
      0x708090, // Gray (rocky)
      0xF0E68C  // Pale yellow (sulfur)
    ];
    
    return planetColors[Math.floor(Math.random() * planetColors.length)];
  }

  getRandomSurfaceType() {
    const surfaceTypes = ['rocky', 'gas', 'ice', 'mixed', 'volcanic'];
    return surfaceTypes[Math.floor(Math.random() * surfaceTypes.length)];
  }

  createDualGalaxies() {
    // Create first galaxy
    const galaxy1Config = this.galaxy1;
    const galaxy1Group = new THREE.Group();
    
    // Offset the first galaxy
    galaxy1Group.position.set(
      galaxy1Config.offset.x,
      galaxy1Config.offset.y,
      galaxy1Config.offset.z
    );
    
    // Create core for galaxy 1
    const core1Particles = this.createGalaxyCore(galaxy1Config.coreRadius, this.colors.galaxy1Core || '#FFD700', this.starCounts.galaxy1Core || 8000);
    galaxy1Group.add(core1Particles);
    
    // Create disk for galaxy 1 if it has one
    if (galaxy1Config.diskRadius) {
      const disk1Particles = this.createGalaxyDisk(galaxy1Config.diskRadius, this.colors.galaxy1Arms || '#87CEEB', this.starCounts.galaxy1Arms || 15000);
      galaxy1Group.add(disk1Particles);
    }
    
    this.galaxyGroup.add(galaxy1Group);
    
    // Create second galaxy
    const galaxy2Config = this.galaxy2;
    const galaxy2Group = new THREE.Group();
    
    // Offset the second galaxy
    galaxy2Group.position.set(
      galaxy2Config.offset.x,
      galaxy2Config.offset.y,
      galaxy2Config.offset.z
    );
    
    // Create core for galaxy 2
    const core2Particles = this.createGalaxyCore(galaxy2Config.coreRadius, this.colors.galaxy2Core || '#FF6347', this.starCounts.galaxy2Core || 6000);
    galaxy2Group.add(core2Particles);
    
    // Create disk for galaxy 2 if it has one
    if (galaxy2Config.diskRadius) {
      const disk2Particles = this.createGalaxyDisk(galaxy2Config.diskRadius, this.colors.galaxy2Arms || '#98FB98', this.starCounts.galaxy2Arms || 12000);
      galaxy2Group.add(disk2Particles);
    }
    
    this.galaxyGroup.add(galaxy2Group);
    
    // Create interaction effects if configured
    if (this.interaction && this.interaction.tidalStreams) {
      this.createTidalStreams();
    }
  }

  createGalaxyCore(radius, color, particleCount) {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 0.5) * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    return new THREE.Points(geometry, material);
  }

  createGalaxyDisk(radius, color, particleCount) {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < particleCount; i++) {
      const r = Math.sqrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * 40;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    
    return new THREE.Points(geometry, material);
  }

  createTidalStreams() {
    const particleCount = this.interaction.bridgeParticles || 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const streamColor = new THREE.Color(this.colors.interaction || '#DDA0DD');
    
    for (let i = 0; i < particleCount; i++) {
      // Create streams between galaxies
      const t = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const radius = t * (this.interaction.streamLength || 600);
      
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (Math.random() - 0.5) * 100;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      colors[i * 3] = streamColor.r;
      colors[i * 3 + 1] = streamColor.g;
      colors[i * 3 + 2] = streamColor.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    const streams = new THREE.Points(geometry, material);
    this.galaxyGroup.add(streams);
  }

  createBlackHole() {
    // Create bright accretion disk
    if (this.blackHole.accretionDisk) {
      const diskParticles = this.createAccretionDisk();
      this.galaxyGroup.add(diskParticles);
    }

    // Create relativistic jets
    if (this.blackHole.jets) {
      const jets = this.createRelativisticJets();
      this.galaxyGroup.add(jets);
    }

    // Add intense central light
    const bhLight = new THREE.PointLight(0xFFFFFF, 2, this.blackHole.diskRadius * 4 || 200);
    bhLight.position.set(0, 0, 0);
    this.galaxyGroup.add(bhLight);

    // Initialize gravitational influence properties
    this.blackHole.gravitationalRadius = this.blackHole.diskRadius * 3 || 150;
    this.blackHole.pullStrength = this.blackHole.pullStrength || 0.5;
    this.infallingMatter = this.infallingMatter || [];
  }

  createAccretionDisk() {
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Store particle data for animation
    this.accretionParticles = [];
    
    const diskColor = new THREE.Color(this.colors.accretionDisk || '#FF4500');
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.pow(Math.random(), 0.3) * (this.blackHole.diskRadius || 50);
      const theta = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 10;
      
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = height;
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Temperature gradient - hotter (brighter) at center
      const tempFactor = 1 - (radius / (this.blackHole.diskRadius || 50));
      colors[i * 3] = Math.min(1, diskColor.r * (0.5 + tempFactor));
      colors[i * 3 + 1] = Math.min(1, diskColor.g * (0.3 + tempFactor * 0.7));
      colors[i * 3 + 2] = Math.min(1, diskColor.b * (0.2 + tempFactor * 0.5));
      
      // Store particle data for animation
      this.accretionParticles.push({
        index: i,
        initialRadius: radius,
        initialY: y,
        angle: theta
      });
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    const accretionDisk = new THREE.Points(geometry, material);
    accretionDisk.userData.isAccretionDisk = true;
    return accretionDisk;
  }

  createRelativisticJets() {
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const jetColor = new THREE.Color(this.colors.jets || '#00FFFF');
    
    for (let i = 0; i < particleCount; i++) {
      // Create bipolar jets along z-axis
      const direction = Math.random() < 0.5 ? 1 : -1;
      const length = Math.pow(Math.random(), 0.5) * (this.blackHole.jetLength || 400);
      const radius = Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      
      const x = radius * Math.cos(angle);
      const z = direction * length;
      const y = radius * Math.sin(angle);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      colors[i * 3] = jetColor.r;
      colors[i * 3 + 1] = jetColor.g;
      colors[i * 3 + 2] = jetColor.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }

  createStarField() {
    // Create main star field
    const fieldParticles = this.createFieldStars();
    this.galaxyGroup.add(fieldParticles);
    
    // Create star clusters only for non-empty / non-starfield-only galaxies
    // Skip cluster fields for starburst or very chaotic irregular galaxies to avoid overpopulation
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    const isVeryChaoticIrregular = this.type === 'irregular' && this.chaosLevel && this.chaosLevel > 0.85;

    if (!(this.type === 'empty' || this.hasEmptySpace || this.hasStarField) && !isStarburst && !isVeryChaoticIrregular) {
      for (let i = 0; i < this.clusterCount; i++) {
        const cluster = this.createStarClusterField();
        this.galaxyGroup.add(cluster);
      }
    }
  }

  createFieldStars() {
    // Determine base particle count, allow config override
    let particleCount = this.starCounts.fieldStars || 50000;

    // Reduce particle count dramatically for irregular starburst types to avoid overload
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    if (isStarburst) {
      particleCount = Math.min(particleCount, 2500); // Reduced by 50% from 5000
    }
    // Also reduce for irregular variants if chaosLevel is high
    if (this.type === 'irregular' && this.chaosLevel && this.chaosLevel > 0.9) {
      particleCount = Math.min(particleCount, 12000);
    }
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const fieldSize = this.fieldSize || 2000; // Fallback value
    
    for (let i = 0; i < particleCount; i++) {
      // Random distribution within field size
      const x = (Math.random() - 0.5) * fieldSize;
      const y = (Math.random() - 0.5) * fieldSize * 0.3;
      const z = (Math.random() - 0.5) * fieldSize;
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Star colors: for empty or star_field types use pure white; otherwise mix
      if (this.type === 'empty' || this.type === 'star_field' || this.hasEmptySpace || this.hasStarField) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else {
        const starType = Math.random();
        if (starType < 0.6) {
          // Blue-white stars
          colors[i * 3] = 0.8 + Math.random() * 0.2;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 1.0;
        } else if (starType < 0.85) {
          // Yellow stars
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
        } else {
          // Red stars
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
          colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
        }
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // For starburst galaxies use smaller, dimmer points to reduce perceived brightness
    const material = new THREE.PointsMaterial({
      size: isStarburst ? 1.0 : 1.5,
      vertexColors: true,
      transparent: true,
      opacity: isStarburst ? 0.6 : 0.9
    });
    
    return new THREE.Points(geometry, material);
  }

  createStarClusterField() {
    const clusterSize = 200 + Math.random() * 300;
    // Base cluster particle count
    let particleCount = Math.floor(2000 + Math.random() * 3000);

    // Reduce cluster sizes for irregular starburst to avoid overwhelming the scene
    if (this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst')) {
      particleCount = Math.floor(Math.min(particleCount, 800));
    }
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const fieldSize = this.fieldSize || 2000; // Fallback value
    const clusterSpread = this.clusterSpread || 0.5; // Fallback value
    
    // Random cluster position with safety checks
    const clusterX = (Math.random() - 0.5) * fieldSize * clusterSpread;
    const clusterY = (Math.random() - 0.5) * fieldSize * 0.3 * clusterSpread;
    const clusterZ = (Math.random() - 0.5) * fieldSize * clusterSpread;
    
    // Ensure cluster position is valid
    const safeClusterX = isNaN(clusterX) ? 0 : clusterX;
    const safeClusterY = isNaN(clusterY) ? 0 : clusterY;
    const safeClusterZ = isNaN(clusterZ) ? 0 : clusterZ;
    
    for (let i = 0; i < particleCount; i++) {
      // Concentrated cluster distribution
      const r = Math.pow(Math.random(), 0.7) * clusterSize;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = safeClusterX + r * Math.sin(phi) * Math.cos(theta);
      const y = safeClusterY + r * Math.sin(phi) * Math.sin(theta);
      const z = safeClusterZ + r * Math.cos(phi);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? safeClusterX : x;
      positions[i * 3 + 1] = isNaN(y) ? safeClusterY : y;
      positions[i * 3 + 2] = isNaN(z) ? safeClusterZ : z;
      
      // For empty/star_field types, clusters (if any) should still be white
      if (this.type === 'empty' || this.type === 'star_field' || this.hasEmptySpace || this.hasStarField) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Bright young stars in clusters
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.95 + Math.random() * 0.05;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }

  createEmptySpace() {
    // Create dense white starfield background
    const particleCount = this.starCounts.distantStars || 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const fieldSize = this.fieldSize || 4000; // Fallback value

    for (let i = 0; i < particleCount; i++) {
      // Dense distribution across the entire field
      const x = (Math.random() - 0.5) * fieldSize;
      const y = (Math.random() - 0.5) * fieldSize * 0.3;
      const z = (Math.random() - 0.5) * fieldSize;

      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;

      // Pure white stars for empty space
      colors[i * 3] = 1.0;     // Red
      colors[i * 3 + 1] = 1.0; // Green
      colors[i * 3 + 2] = 1.0; // Blue
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const starField = new THREE.Points(geometry, material);
    this.galaxyGroup.add(starField);

    // Add very distant background stars (also white)
    const bgParticleCount = this.starCounts.veryDistant || 500;
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgColors = new Float32Array(bgParticleCount * 3);

    for (let i = 0; i < bgParticleCount; i++) {
      const distance = 3000 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);

      // Ensure no NaN values
      bgPositions[i * 3] = isNaN(x) ? 0 : x;
      bgPositions[i * 3 + 1] = isNaN(y) ? 0 : y;
      bgPositions[i * 3 + 2] = isNaN(z) ? 0 : z;

      // White background stars
      bgColors[i * 3] = 1.0;
      bgColors[i * 3 + 1] = 1.0;
      bgColors[i * 3 + 2] = 1.0;
    }

    const bgGeometry = new THREE.BufferGeometry();
    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.4
    });

    const backgroundStars = new THREE.Points(bgGeometry, bgMaterial);
    this.galaxyGroup.add(backgroundStars);
  }

  createStarCluster() {
    // Only create clusters if this galaxy is configured as a cluster
    if (!this.hasCluster && this.type !== 'cluster') {
      return;
    }

    // Do not create colored clusters for empty / star field-only galaxies
    if (this.type === 'empty' || this.hasEmptySpace || this.hasStarField) {
      return;
    }

    if (this.type === 'cluster' && this.age < 0.3) {
      // Young open cluster with nebulosity
      const cluster = this.createOpenCluster();
      this.galaxyGroup.add(cluster);
    } else {
      // Globular cluster (old, dense)
      const cluster = this.createGlobularCluster();
      this.galaxyGroup.add(cluster);
    }
  }

  createGlobularCluster() {
    let particleCount = this.starCounts.coreStars || 20000;
    
    // Reduce globular cluster stars for starburst galaxies by 50%
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    if (isStarburst) {
      particleCount = Math.floor(particleCount * 0.5);
    }
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Highly concentrated spherical distribution
      const r = Math.pow(Math.random(), 0.4) * this.haloRadius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Mix of old star colors
      const starType = Math.random();
      if (starType < 0.4) {
        // Yellow-white (turn-off stars)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      } else if (starType < 0.7) {
        // Orange (subgiants)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.4;
      } else if (starType < 0.9) {
        // Red giants
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.3;
      } else {
        // Blue stragglers (rare young stars)
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });
    
    return new THREE.Points(geometry, material);
  }

  createOpenCluster() {
    let particleCount = this.starCounts.clusterStars || 15000;
    
    // Reduce cluster stars for starburst galaxies by 50%
    const isStarburst = this.galaxyType && this.galaxyType.toString().toLowerCase().includes('starburst');
    if (isStarburst) {
      particleCount = Math.floor(particleCount * 0.5);
    }
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Less concentrated than globular clusters
      const r = Math.pow(Math.random(), 0.6) * this.spreadRadius;
      const theta = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 100;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = height;
      
      // Ensure no NaN values
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      // Young hot stars
      const starType = Math.random();
      if (starType < 0.5) {
        // Blue-white (O/B stars)
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1.0;
      } else if (starType < 0.8) {
        // White (A stars)
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Yellow-white (F stars)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.9;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }

  animate(time) {
    // Different animation types based on galaxy type
    switch (this.animationType) {
      case 'accretion':
        this.animateBlackHole(time);
        break;
      case 'orbital':
        this.animateDualOrbitals(time);
        break;
      case 'chaotic':
        this.animateChaotic(time);
        break;
      case 'expansion':
        this.animateRingExpansion(time);
        break;
      case 'collision':
        this.animateCollision(time);
        break;
      case 'slow_rotation':
        this.animateSlowRotation(time);
        break;
      case 'wobble':
        this.animateWobble(time);
        break;
      case 'differential_rotation':
        this.animateDifferentialRotation(time);
        break;
      case 'drift':
        this.animateDrift(time);
        break;
      case 'cluster_rotation':
        this.animateClusterRotation(time);
        break;
      default:
        this.animateStandardRotation(time);
    }
    
    // Calculate deltaTime for frame-rate independent physics
    const currentTime = time * 0.001; // Convert to seconds
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0.016;
    this.lastTime = currentTime;
    
    // Update all celestial objects with physics
    this.updateCelestialObjects(currentTime, deltaTime);
    
    // Legacy animation for star systems (will be phased out as objects migrate to CelestialObject)
    this.starSystems.forEach(system => {
      if (system.star.animate) {
        system.star.animate(time);
      }
      system.planets.forEach(planet => {
        if (planet.animate) {
          planet.animate(time);
        }
      });
    });
  }

  animateStandardRotation(time) {
    // Standard galaxy rotation
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
  }

  animateBlackHole(time) {
    // Black hole animation with accretion and infall
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    
    // Apply gravitational pull to nearby objects
    this.applyGravitationalPull(time);
    
    // Animate accretion disk particles spiraling inward
    if (this.accretionParticles && this.accretionParticles.length > 0) {
      // Find the accretion disk geometry and animate it
      this.galaxyGroup.traverse((child) => {
        if (child.isPoints && child.userData && child.userData.isAccretionDisk) {
          const positions = child.geometry.attributes.position;
          if (positions) {
            const positionArray = positions.array;
            
            this.accretionParticles.forEach((particle) => {
              const i = particle.index;
              // Spiral particles inward toward the black hole
              const angle = time * 0.001 + particle.angle;
              const radius = Math.max(5, particle.initialRadius * (1 - (time * 0.0001 + i * 0.001) % 1));
              
              positionArray[i * 3] = radius * Math.cos(angle);
              positionArray[i * 3 + 1] = particle.initialY * (radius / particle.initialRadius);
              positionArray[i * 3 + 2] = radius * Math.sin(angle);
            });
            
            positions.needsUpdate = true;
          }
        }
      });
    }
    
    // Create infalling matter streams
    if (Math.random() < 0.1) { // Occasional infall events
      this.createInfallingMatter();
    }
    
    // Animate existing infalling matter
    this.infallingMatter.forEach((stream, index) => {
      if (stream.userData && stream.userData.isInfallStream) {
        const age = (Date.now() - stream.userData.creationTime) * 0.001;
        const positions = stream.geometry.attributes.position;
        const initialPositions = stream.userData.initialPositions;

        if (positions && initialPositions) {
          const positionArray = positions.array;

          for (let i = 0; i < positionArray.length / 3; i++) {
            const initialX = initialPositions[i * 3];
            const initialY = initialPositions[i * 3 + 1];
            const initialZ = initialPositions[i * 3 + 2];
            const initialRadius = Math.sqrt(initialX * initialX + initialY * initialY + initialZ * initialZ);

            // Calculate spiral motion toward center
            const progress = age * 2 + i * 0.05; // Speed up the infall
            const currentRadius = Math.max(8, initialRadius * (1 - progress * 0.3));
            const angle = stream.userData.streamAngle + progress * 2;

            if (currentRadius > 10) {
              positionArray[i * 3] = currentRadius * Math.cos(angle);
              positionArray[i * 3 + 1] = initialY * (currentRadius / initialRadius) + Math.sin(progress * 3) * 5;
              positionArray[i * 3 + 2] = currentRadius * Math.sin(angle);
            } else {
              // Particles have been absorbed, fade them out
              stream.material.opacity = Math.max(0, stream.material.opacity - 0.05);
            }
          }

          positions.needsUpdate = true;

          // Remove completely faded streams
          if (stream.material.opacity <= 0) {
            this.galaxyGroup.remove(stream);
            stream.geometry.dispose();
            stream.material.dispose();
            this.infallingMatter.splice(index, 1);
          }
        }
      }
    });
  }

  applyGravitationalPull(time) {
    // Apply gravitational forces to nearby galaxy objects
    const gravitationalRadius = this.blackHole.gravitationalRadius || 150;
    const pullStrength = this.blackHole.pullStrength || 0.5;
    // Distance at which objects are considered absorbed by the black hole
    const absorbRadius = this.blackHole.absorbRadius || 8;

    // Pull star systems toward the black hole and absorb when close enough
    for (let i = this.starSystems.length - 1; i >= 0; i--) {
      const system = this.starSystems[i];
      if (!system || !system.star) continue;
      const starPos = system.star.position; // THREE.Vector3 from Star.get position
      if (!starPos) continue;

      const distance = starPos.length();

      // Apply pull if within gravitational influence
      if (distance < gravitationalRadius && distance > absorbRadius) {
        const pullForce = pullStrength * (1 - distance / gravitationalRadius);
        const direction = new THREE.Vector3().copy(starPos).normalize().negate();
        // Move star mesh and its orbitGroup (planets attach to orbitGroup)
        if (system.star.mesh) {
          system.star.mesh.position.add(direction.clone().multiplyScalar(pullForce));
        }
        if (system.planets && system.planets.length) {
          system.planets.forEach(p => {
            if (p.orbitGroup) p.orbitGroup.position.add(direction.clone().multiplyScalar(pullForce));
          });
        }
      }

      // Absorb and remove system if it crosses into the absorb radius
      if (distance <= absorbRadius) {
        // Dispose star and planets
        try {
          if (system.planets && system.planets.length) {
            system.planets.forEach(p => p.dispose && p.dispose());
          }
        } catch (err) {
          // ignore individual disposal errors
        }

        try {
          system.star.dispose && system.star.dispose();
        } catch (err) {
          // ignore
        }

        // Remove from array
        this.starSystems.splice(i, 1);

        // Spawn a replacement at galaxy edge to keep population stable
        this.createReplacementStarSystem();
      }
    }

    // Pull nebulae toward the black hole and remove if absorbed
    for (let i = this.nebulae.length - 1; i >= 0; i--) {
      const nebula = this.nebulae[i];
      if (!nebula || !nebula.position) continue;
      const distance = nebula.position.length();
      if (distance < gravitationalRadius && distance > absorbRadius) {
        const pullForce = pullStrength * (1 - distance / gravitationalRadius);
        const direction = new THREE.Vector3().copy(nebula.position).normalize().negate();
        nebula.position.add(direction.multiplyScalar(pullForce));
      }
      if (distance <= absorbRadius) {
        // Dispose geometry/material if present and remove from scene
        try {
          if (nebula.geometry) nebula.geometry.dispose();
          if (nebula.material) nebula.material.dispose();
          if (nebula.parent) nebula.parent.remove(nebula);
        } catch (err) {}
        this.nebulae.splice(i, 1);
      }
    }

    // Pull spiral arms toward the black hole (affect particle positions)
    this.spiralArms.forEach(arm => {
      if (arm && arm.geometry && arm.geometry.attributes.position) {
        const positions = arm.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];
          const distance = Math.sqrt(x * x + y * y + z * z);

          if (distance < gravitationalRadius && distance > 10) {
            const pullForce = pullStrength * (1 - distance / gravitationalRadius) * 0.1;
            const factor = 1 - pullForce / distance;
            positions[i] *= factor;
            positions[i + 1] *= factor;
            positions[i + 2] *= factor;
          }
        }
        arm.geometry.attributes.position.needsUpdate = true;
      }
    });

    // Pull galactic core particles toward center
    if (this.galacticCore && this.galacticCore.geometry && this.galacticCore.geometry.attributes.position) {
      const positions = this.galacticCore.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance > 5) {
          const pullForce = pullStrength * 0.05; // Gentle pull for core
          const factor = 1 - pullForce / distance;
          positions[i] *= factor;
          positions[i + 1] *= factor;
          positions[i + 2] *= factor;
        }
      }
      this.galacticCore.geometry.attributes.position.needsUpdate = true;
    }
  }  animateDualOrbitals(time) {
    // Dual galaxies orbiting each other
    const orbitSpeed = 0.002;
    const orbitRadius = 150;
    
    // Animate first galaxy
    if (this.galaxy1 && this.galaxy1.group) {
      this.galaxy1.group.position.x = orbitRadius * Math.cos(time * orbitSpeed);
      this.galaxy1.group.position.z = orbitRadius * Math.sin(time * orbitSpeed);
    }
    
    // Animate second galaxy (opposite phase)
    if (this.galaxy2 && this.galaxy2.group) {
      this.galaxy2.group.position.x = -orbitRadius * Math.cos(time * orbitSpeed);
      this.galaxy2.group.position.z = -orbitRadius * Math.sin(time * orbitSpeed);
    }
    
    // Overall rotation
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.005;
  }

  animateChaotic(time) {
    // Irregular, turbulent motion
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    this.galaxyGroup.rotation.x = Math.sin(time * 0.0005) * 0.1;
    this.galaxyGroup.rotation.z = Math.cos(time * 0.0003) * 0.05;
  }

  animateRingExpansion(time) {
    // Ring galaxies expand outward
    const expansionRate = 0.001;
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    
    // Animate ring particles expanding
    this.galaxyGroup.traverse((child) => {
      if (child.userData && child.userData.isRingParticle) {
        const initialRadius = child.userData.initialRadius;
        const expansion = 1 + time * expansionRate * 0.001;
        const newRadius = initialRadius * expansion;
        
        child.position.x = newRadius * Math.cos(child.userData.angle);
        child.position.z = newRadius * Math.sin(child.userData.angle);
      }
    });
  }

  animateCollision(time) {
    // Tidal interactions between galaxies
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    
    // Animate tidal tails
    if (this.tidalTails) {
      this.tidalTails.forEach((tail, index) => {
        // Wave-like motion in tails
        tail.traverse((child) => {
          if (child.userData && child.userData.isTailParticle) {
            const phase = time * 0.001 + child.userData.phase;
            child.position.y = Math.sin(phase) * 20;
          }
        });
      });
    }
  }

  animateSlowRotation(time) {
    // Very slow, stately rotation for elliptical galaxies
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.002;
  }

  animateWobble(time) {
    // Lenticular galaxies wobble slightly
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    this.galaxyGroup.rotation.x = Math.sin(time * 0.0002) * 0.05;
  }

  animateDifferentialRotation(time) {
    // Spiral arms rotate at different speeds
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    
    // Animate spiral arms with slight differential rotation
    if (this.spiralArms) {
      this.spiralArms.forEach((arm, index) => {
        arm.rotation.y = this.galaxyGroup.rotation.y * (0.8 + index * 0.1);
      });
    }
  }

  animateDrift(time) {
    // Slow drifting motion for star fields
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.001;
    this.galaxyGroup.position.x = Math.sin(time * 0.0001) * 10;
    this.galaxyGroup.position.z = Math.cos(time * 0.0001) * 10;
  }

  animateClusterRotation(time) {
    // Clusters rotate as cohesive units
    this.galaxyGroup.rotation.y += this.rotationSpeed * 0.01;
    this.galaxyGroup.rotation.x = Math.sin(time * 0.0003) * 0.02;
    this.galaxyGroup.rotation.z = Math.cos(time * 0.0003) * 0.02;
  }

  createInfallingMatter() {
    // Create streams of matter falling into black hole
    const particleCount = 20 + Math.floor(Math.random() * 30);
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const streamAngle = Math.random() * Math.PI * 2;
    const streamHeight = (Math.random() - 0.5) * 50;

    for (let i = 0; i < particleCount; i++) {
      const radius = 150 + Math.random() * 100;
      const angle = streamAngle + (Math.random() - 0.5) * 0.5;
      const height = streamHeight + (Math.random() - 0.5) * 20;

      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = radius * Math.sin(angle);

      // Orange-red colors for hot infalling matter
      colors[i * 3] = 1.0;     // Red
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // Green
      colors[i * 3 + 2] = 0.0; // Blue
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const infallStream = new THREE.Points(geometry, material);
    infallStream.userData = {
      isInfallStream: true,
      creationTime: Date.now(),
      streamAngle: streamAngle,
      streamHeight: streamHeight,
      initialPositions: positions.slice() // Store initial positions for animation
    };

    this.galaxyGroup.add(infallStream);
    this.infallingMatter.push(infallStream);

    // Remove old streams after some time
    if (this.infallingMatter.length > 15) {
      const oldStream = this.infallingMatter.shift();
      this.galaxyGroup.remove(oldStream);
      oldStream.geometry.dispose();
      oldStream.material.dispose();
    }
  }

  // Celestial object management methods
  addCelestialObject(object) {
    if (!object || !object.name) return;
    
    // Add to main registry
    this.celestialObjects.set(object.name, object);
    
    // Add to type-specific registries
    switch(object.type) {
      case 'star':
        this.stars.set(object.name, object);
        break;
      case 'planet':
        this.planets.set(object.name, object);
        break;
      case 'moon':
        this.moons.set(object.name, object);
        break;
      case 'blackhole':
        this.blackHoles.set(object.name, object);
        break;
      case 'asteroid':
        this.asteroids.set(object.name, object);
        break;
      case 'comet':
        this.comets.set(object.name, object);
        break;
      default:
        // Generic objects go only in main registry
        break;
    }
  }

  removeCelestialObject(object) {
    if (!object || !object.name) return;
    
    // Remove from main registry
    this.celestialObjects.delete(object.name);
    
    // Remove from type-specific registries
    this.stars.delete(object.name);
    this.planets.delete(object.name);
    this.moons.delete(object.name);
    this.blackHoles.delete(object.name);
    this.asteroids.delete(object.name);
    this.comets.delete(object.name);
  }

  getCelestialObject(name) {
    return this.celestialObjects.get(name);
  }

  getAllCelestialObjects() {
    return Array.from(this.celestialObjects.values());
  }

  getCelestialObjectsByType(type) {
    switch(type) {
      case 'star': return Array.from(this.stars.values());
      case 'planet': return Array.from(this.planets.values());
      case 'moon': return Array.from(this.moons.values());
      case 'blackhole': return Array.from(this.blackHoles.values());
      case 'asteroid': return Array.from(this.asteroids.values());
      case 'comet': return Array.from(this.comets.values());
      default: return [];
    }
  }

  // Get objects within a certain distance of a point
  getCelestialObjectsInRadius(centerPosition, radius) {
    return this.getAllCelestialObjects().filter(object => {
      return object.position.distanceTo(centerPosition) <= radius;
    });
  }

  // Update all celestial objects
  updateCelestialObjects(time, deltaTime = 0.016) {
    let activeObjects = 0;
    let physicsObjects = 0;
    
    this.celestialObjects.forEach(object => {
      if (object.isActive) {
        activeObjects++;
        if (object.velocity && object.velocity.length() > 0.001) {
          physicsObjects++;
        }
        object.update(time, deltaTime);
      }
    });
    
    // Debug info every 5 seconds
    if (Math.floor(time / 5000) !== Math.floor((time - 16) / 5000)) {
      console.log(`🌌 Galaxy Physics Status:`, {
        totalObjects: this.celestialObjects.size,
        activeObjects,
        objectsWithPhysics: physicsObjects,
        stars: this.stars.size,
        planets: this.planets.size,
        moons: this.moons.size,
        deltaTime: deltaTime.toFixed(4)
      });
    }
  }

  // Update method for animations - override in subclasses
  updateCustom(time, deltaTime) {
    // Base class does nothing - subclasses override for custom animations
  }

  dispose() {
    // Dispose all celestial objects
    this.celestialObjects.forEach(object => {
      object.dispose();
    });
    
    // Clear all registries
    this.celestialObjects.clear();
    this.stars.clear();
    this.planets.clear();
    this.moons.clear();
    this.blackHoles.clear();
    this.asteroids.clear();
    this.comets.clear();
    
    // Dispose all star systems
    this.starSystems.forEach(system => {
      system.star.dispose();
      system.planets.forEach(planet => planet.dispose());
    });
    
    // Dispose all geometries and materials
    this.galaxyGroup.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    this.scene.remove(this.galaxyGroup);
  }
}
