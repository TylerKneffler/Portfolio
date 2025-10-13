import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';
import { Moon } from './Moon';

export class Planet extends CelestialObject {
  constructor(planetData, scene, galaxy = null) {
    // Set object type and specific properties before calling parent
    planetData.type = 'planet';
    planetData.hasGravity = true;
    planetData.affectedByGravity = planetData.affectedByGravity !== false;
    planetData.density = planetData.density || 5.5; // Earth-like density
    planetData.massMultiplier = planetData.massMultiplier || 1.0;
    
    super(planetData, scene, galaxy);
    
    this.rings = null;
    this.orbitGroup = null;
    this.planetGroup = null;
    this.moons = [];
    
    // Orbital properties for independent orbital motion
    this.orbitalRadius = this.data.radius || 100;
    this.orbitalAngle = this.data.startAngle || 0;
    this.orbitalSpeed = this.data.speed || 0.01;
    this.orbitalCenter = new THREE.Vector3(0, 0, 0);
    this.worldPosition = new THREE.Vector3(0, 0, 0);
    
    this.createPlanet();
  }

  createPlanet() {
    // Create orbit group for tilted orbits
    this.orbitGroup = new THREE.Group();
    this.orbitGroup.rotation.x = this.data.orbitTilt;
    this.orbitGroup.rotation.y = this.data.startAngle;
    this.scene.add(this.orbitGroup);

    // Create planet group (for planet + rings)
    this.planetGroup = new THREE.Group();
    this.planetGroup.position.x = this.data.radius;

    // Create planet geometry
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    
    // Create material based on surface type
    this.material = this.createSurfaceMaterial();
    
    // Create planet mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.planetGroup.add(this.mesh);

    // Add continent layer for Earth-like planets
    if (this.data.surfaceType === 'mixed') {
      this.createContinents();
    }

    // Add rings if this planet has them
    if (this.data.hasRings) {
      this.createRings();
    }

    // Add moons if this planet has them
    if (this.data.moons && this.data.moons.length > 0) {
      this.createMoons();
    }

    this.orbitGroup.add(this.planetGroup);
  }

  createSurfaceMaterial() {
    const surfaceType = this.data.surfaceType || 'rocky';
    
    switch (surfaceType) {
      case 'rocky':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.9,
          metalness: 0.1,
          bumpScale: 0.1
        });
        
      case 'gas':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.3,
          metalness: 0.0,
          transparent: true,
          opacity: 0.9,
          emissive: new THREE.Color(this.data.color).multiplyScalar(0.1)
        });
        
      case 'ice':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.1,
          metalness: 0.0,
          transparent: true,
          opacity: 0.95,
          emissive: new THREE.Color(0x004488).multiplyScalar(0.08)
        });
        
      case 'mixed': // Earth-like with oceans and continents
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.7,
          metalness: 0.0,
          emissive: new THREE.Color(0x001122).multiplyScalar(0.08)
        });
        
      case 'volcanic':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.8,
          metalness: 0.2,
          emissive: new THREE.Color(0xFF4400).multiplyScalar(0.15)
        });
        
      default:
        return new THREE.MeshBasicMaterial({ color: this.data.color });
    }
  }

  createContinents() {
    // Create a slightly larger geometry for continents
    const continentGeometry = new THREE.SphereGeometry(this.data.size * 1.005, 32, 32);
    
    // Create continent material (green-brown landmasses)
    const continentMaterial = new THREE.MeshStandardMaterial({
      color: this.data.secondaryColor || 0x228B22, // Forest green
      roughness: 0.8,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9
    });
    
    // Create continent mesh
    const continents = new THREE.Mesh(continentGeometry, continentMaterial);
    this.mesh.add(continents);
    
    // Create cloud layer for atmosphere
    const cloudGeometry = new THREE.SphereGeometry(this.data.size * 1.015, 24, 24);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.mesh.add(clouds);
    
    // Store cloud reference for animation
    this.clouds = clouds;
  }

  createMoons() {
    this.data.moons.forEach(moonData => {
      const moon = new Moon(moonData, this, this.scene, this.galaxy);
      this.moons.push(moon);
    });
  }

  createRings() {
    const ringGeometry = new THREE.RingGeometry(
      this.data.ringInner, 
      this.data.ringOuter, 
      64, 
      8
    );
    
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: this.data.ringColor || 0x888888,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });
    
    this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
    this.rings.rotation.x = Math.PI / 2;
    this.planetGroup.add(this.rings);
  }

  // Animation methods
  updateOrbit(speed) {
    if (this.orbitGroup) {
      this.orbitGroup.rotation.y += speed;
    }
  }

  updateRotation(speed) {
    if (this.mesh) {
      this.mesh.rotation.y += speed;
    }
  }

  updateRings(speed) {
    if (this.rings) {
      this.rings.rotation.z += speed;
    }
  }

  // Surface animation based on type
  updateSurface() {
    if (!this.material) return;

    switch (this.data.surfaceType) {
      case 'gas':
        // Animate gas giant bands
        if (this.material.emissive) {
          const time = Date.now() * 0.001;
          const intensity = 0.05 + Math.sin(time * 2) * 0.02;
          this.material.emissive = new THREE.Color(this.data.color).multiplyScalar(intensity);
        }
        break;
        
      case 'volcanic':
        // Animate volcanic glow
        if (this.material.emissive) {
          const time = Date.now() * 0.002;
          const intensity = 0.08 + Math.sin(time * 3) * 0.04;
          this.material.emissive = new THREE.Color(0xFF4400).multiplyScalar(intensity);
        }
        break;
        
      case 'ice':
        // Subtle ice shimmer
        if (this.material.emissive) {
          const time = Date.now() * 0.0005;
          const intensity = 0.03 + Math.sin(time) * 0.01;
          this.material.emissive = new THREE.Color(0x004488).multiplyScalar(intensity);
        }
        break;
        
      default:
        // No surface animation for other types
        break;
    }
  }

  // Override parent updateVisuals method
  updateVisuals(time, deltaTime) {
    // Update rings if this planet has them
    if (this.data.hasRings) {
      this.updateRings(0.002);
    }
    
    // Update surface animations for gas giants and volcanic planets
    this.updateSurface();
    
    // Animate clouds for Earth-like planets
    if (this.clouds) {
      this.clouds.rotation.y += 0.001; // Clouds rotate slightly faster than planet
    }
  }
  
  // Override parent updateCustom method for planet-specific behavior
  updateCustom(time, deltaTime) {
    // Update independent position combining orbital motion with world position
    this.updateIndependentPosition(deltaTime);
    
    // Apply default rotation if no angular velocity is set
    if (this.angularVelocity.length() === 0) {
      this.angularVelocity.y = 0.005;
    }
    
    // Animate moons with independent physics
    this.moons.forEach(moon => {
      moon.update(time, deltaTime);
    });
  }

  // Legacy method for backwards compatibility
  animate(time, deltaTime = 0.016) {
    this.update(time, deltaTime);
  }

  updateIndependentPosition(deltaTime) {
    // Update orbital motion independently
    this.orbitalAngle += this.orbitalSpeed * deltaTime;
    
    // Calculate orbital position
    const orbitalX = this.orbitalCenter.x + Math.cos(this.orbitalAngle) * this.orbitalRadius;
    const orbitalZ = this.orbitalCenter.z + Math.sin(this.orbitalAngle) * this.orbitalRadius;
    
    // Combine orbital position with world position offset
    const finalPosition = new THREE.Vector3(
      orbitalX + this.worldPosition.x,
      this.orbitalCenter.y + this.worldPosition.y,
      orbitalZ + this.worldPosition.z
    );
    
    // Update both our position and mesh position
    this.position.copy(finalPosition);
    
    if (this.planetGroup) {
      this.planetGroup.position.copy(finalPosition);
    }
    
    // Update orbit group position if it exists
    if (this.orbitGroup) {
      this.orbitGroup.position.copy(this.worldPosition);
    }
  }

  // Override parent setPosition to work with orbital mechanics
  setPosition(x, y, z) {
    this.worldPosition.set(x, y, z);
    super.setPosition(x, y, z);
    if (this.orbitGroup) {
      this.orbitGroup.position.copy(this.worldPosition);
    }
  }

  setOrbitalCenter(x, y, z) {
    this.orbitalCenter.set(x, y, z);
  }

  setOrbitalRadius(radius) {
    this.orbitalRadius = radius;
  }

  setOrbitalSpeed(speed) {
    this.orbitalSpeed = speed;
  }

  // Override parent dispose method to handle planet-specific cleanup
  dispose() {
    if (this.rings) {
      this.rings.geometry.dispose();
      this.rings.material.dispose();
    }
    if (this.clouds) {
      this.clouds.geometry.dispose();
      this.clouds.material.dispose();
    }
    // Dispose moons
    this.moons.forEach(moon => moon.dispose());
    if (this.orbitGroup) {
      this.scene.remove(this.orbitGroup);
    }
    
    // Call parent dispose
    super.dispose();
  }

  // Getters for compatibility
  get speed() { return this.data.speed; }
  get hasRings() { return this.data.hasRings; }
  get name() { return this.data.name; }
}

export default Planet;
