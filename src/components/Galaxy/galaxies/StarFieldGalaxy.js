import { Galaxy } from '../Galaxy';
import * as THREE from 'three';

export default class StarFieldGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Star field specific defaults
    this.galaxyRadius = 3000;
    this.hasArms = false;
    this.type = 'star_field';
    this.hasStarField = true;
    
    // Disable all galaxy components except stars
    this.nebulaCount = 0;
    this.starSystemCount = 0;
    this.coreRadius = 0;
    
    // Colors - varied stellar types
    this.colors = {
      fieldStars: '#FFFFFF',
      youngStars: '#87CEEB',
      oldStars: '#FFA500'
    };
    
    // Star counts - adjusted for density
    this.starCounts = {
      fieldStars: this.galaxyType === 'star_field_dense' ? 8000 : 4000,
      coreStars: 0,
      armStars: 0,
      diskStars: 0,
      haloStars: 0
    };
    
    this.rotationSpeed = 0.02; // Very slow drift
    this.fieldSize = 3000; // Size of the star field
  }

  // Override createGalaxy to only create stars
  createGalaxy() {
    // Only create the star field - no core, arms, nebulae, or systems
    this.createStarField();
  }

  // Override createStarField to be pure stars only
  createStarField() {
    const fieldParticles = this.createPureFieldStars();
    this.galaxyGroup.add(fieldParticles);
  }

  createPureFieldStars() {
    const particleCount = this.starCounts.fieldStars;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random distribution in 3D space
      const x = (Math.random() - 0.5) * this.fieldSize;
      const y = (Math.random() - 0.5) * this.fieldSize * 0.4; // Slightly flattened
      const z = (Math.random() - 0.5) * this.fieldSize;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Pure white stars with slight size variation
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    return new THREE.Points(geometry, material);
  }

  // Custom star field animation - gentle drift
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Very slow, gentle movement
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.0002;
      this.galaxyGroup.position.x = Math.sin(time * 0.01) * 5;
      this.galaxyGroup.position.z = Math.cos(time * 0.015) * 3;
    }
  }
}
