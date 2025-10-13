import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Moon extends CelestialObject {
  constructor(moonData, parentPlanet, scene, galaxy = null) {
    // Set object type and specific properties before calling parent
    moonData.type = 'moon';
    moonData.hasGravity = true;
    moonData.affectedByGravity = moonData.affectedByGravity !== false;
    moonData.density = moonData.density || 3.3; // Moon-like density
    moonData.massMultiplier = moonData.massMultiplier || 0.1; // Smaller than planets
    
    super(moonData, scene, galaxy);
    
    this.parentPlanet = parentPlanet;
    this.orbitGroup = null;
    
    // Orbital properties for independent orbital motion around parent
    this.orbitalRadius = this.data.distance || 50;
    this.orbitalAngle = this.data.startAngle || 0;
    this.orbitalSpeed = this.data.speed || 0.02;
    this.parentOffset = new THREE.Vector3(0, 0, 0);
    this.worldPosition = new THREE.Vector3(0, 0, 0);
    
    this.createMoon();
  }

  createMoon() {
    // Create orbit group for moon orbit around planet
    this.orbitGroup = new THREE.Group();
    this.orbitGroup.rotation.x = this.data.orbitTilt || 0;
    this.orbitGroup.rotation.y = this.data.startAngle || 0;
    
    // Position moon at orbital distance from planet
    const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
    this.material = this.createMoonMaterial();
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.x = this.data.distance; // Distance from planet
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    this.orbitGroup.add(this.mesh);
    
    // Add to parent planet's group
    this.parentPlanet.planetGroup.add(this.orbitGroup);
  }

  createMoonMaterial() {
    switch (this.data.type) {
      case 'rocky':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.95,
          metalness: 0.05
        });
        
      case 'icy':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.2,
          metalness: 0.1,
          transparent: true,
          opacity: 0.95
        });
        
      case 'volcanic':
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.8,
          metalness: 0.1,
          emissive: new THREE.Color(0xFF2200).multiplyScalar(0.05)
        });
        
      default:
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          roughness: 0.9,
          metalness: 0.05
        });
    }
  }

  // Override parent updateVisuals method
  updateVisuals(time, deltaTime) {
    // Add subtle surface animations for volcanic moons
    if (this.data.type === 'volcanic') {
      const glowIntensity = 0.02 + Math.sin(time * 3) * 0.01;
      this.material.emissive = new THREE.Color(0xFF2200).multiplyScalar(glowIntensity);
    }
  }
  
  // Override parent updateCustom method for moon-specific behavior
  updateCustom(time, deltaTime) {
    // Update independent position relative to parent planet
    this.updateIndependentPosition(deltaTime);
    
    // Apply default tidally locked rotation if no angular velocity is set
    if (this.angularVelocity.length() === 0) {
      this.angularVelocity.y = this.data.speed || 0.02;
    }
  }

  // Legacy method for backwards compatibility
  animate(time, deltaTime = 0.016) {
    this.update(time, deltaTime);
  }

  updateIndependentPosition(deltaTime) {
    // Update orbital motion around parent planet
    this.orbitalAngle += this.orbitalSpeed * deltaTime;
    
    // Get parent planet's current world position
    let parentWorldPos = new THREE.Vector3(0, 0, 0);
    if (this.parentPlanet && this.parentPlanet.planetGroup) {
      parentWorldPos.copy(this.parentPlanet.planetGroup.position);
    }
    
    // Calculate orbital position around parent
    const orbitalX = Math.cos(this.orbitalAngle) * this.orbitalRadius;
    const orbitalZ = Math.sin(this.orbitalAngle) * this.orbitalRadius;
    
    // Calculate final position and update both our position and orbit group
    const finalPosition = new THREE.Vector3(
      parentWorldPos.x + orbitalX + this.worldPosition.x,
      parentWorldPos.y + this.worldPosition.y,
      parentWorldPos.z + orbitalZ + this.worldPosition.z
    );
    
    // Update our position
    this.position.copy(finalPosition);
    
    // Update orbit group
    if (this.orbitGroup) {
      this.orbitGroup.position.copy(finalPosition);
    }
  }

  // Override parent setPosition to work with parent-relative positioning
  setPosition(x, y, z) {
    this.worldPosition.set(x, y, z);
    super.setPosition(x, y, z);
  }

  setOrbitalRadius(radius) {
    this.orbitalRadius = radius;
  }

  setOrbitalSpeed(speed) {
    this.orbitalSpeed = speed;
  }

  // Override parent dispose method to handle moon-specific cleanup
  dispose() {
    if (this.orbitGroup && this.parentPlanet && this.parentPlanet.planetGroup) {
      this.parentPlanet.planetGroup.remove(this.orbitGroup);
    }
    
    // Call parent dispose
    super.dispose();
  }

  // Getters for compatibility
  get name() { return this.data.name; }
  get speed() { return this.data.speed; }
}

export default Moon;
