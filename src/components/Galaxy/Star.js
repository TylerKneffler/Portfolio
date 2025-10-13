import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Star extends CelestialObject {
  constructor(starData, scene, galaxy = null) {
    // Set object type and specific properties before calling parent
    starData.type = 'star';
    starData.hasGravity = true;
    starData.affectedByGravity = starData.affectedByGravity !== false;
    starData.density = starData.density || 1.4; // Solar density
    starData.massMultiplier = starData.massMultiplier || 1.0;
    
    super(starData, scene, galaxy);
    
    this.light = null;
    this.coronaRings = [];
    
    this.createStar();
  }

  createStar() {
    // Create star geometry with higher resolution for better sphere appearance
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
    
    // Create star material with emissive properties
    this.material = this.createStarMaterial();
    
    // Create star mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    const x = isNaN(this.data.x) ? 0 : this.data.x;
    const y = isNaN(this.data.y) ? 0 : this.data.y;
    const z = isNaN(this.data.z) ? 0 : this.data.z;
    this.mesh.position.set(x, y, z);
    
    // Add to scene
    this.scene.add(this.mesh);
    
    // Create light emission from the star
    this.createStarLight();
    
    // Add corona effects for larger stars
    if (this.data.size >= 3) {
      this.createCorona();
    }
  }

  createStarMaterial() {
    const baseColor = new THREE.Color(this.data.color);
    
    switch (this.data.type) {
      case 'G-class': // Sun-like (yellow)
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 1.2
        });
        
      case 'O-class': // Blue giant
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 1.2
        });
        
      case 'M-class': // Red dwarf
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 0.6
        });
        
      case 'K-class': // Orange dwarf
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 0.7
        });
        
      default:
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: 0.8
        });
    }
  }

  createStarLight() {
    // Create point light at star position
    this.light = new THREE.PointLight(
      this.data.color,
      this.data.intensity || 1.0,
      this.data.lightDistance || 300,
      this.data.decay || 2
    );
    
    this.light.position.copy(this.position);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 2048;
    this.light.shadow.mapSize.height = 2048;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = this.data.lightDistance || 800;
    
    // Add light to scene
    this.scene.add(this.light);
    
    // Create lens flare effect for brighter stars
    // Commented out to avoid square plane appearance
    // if (this.data.intensity && this.data.intensity > 0.8) {
    //   this.createLensFlare();
    // }
  }

  createCorona() {
    // Create multiple corona rings for realistic sun appearance
    const coronaCount = 3;
    
    for (let i = 0; i < coronaCount; i++) {
      const coronaGeometry = new THREE.SphereGeometry(
        this.radius * (1.1 + i * 0.05), 
        24, 
        24
      );
      
      const coronaMaterial = new THREE.MeshStandardMaterial({
        color: this.data.color,
        transparent: true,
        opacity: 0.1 - i * 0.02,
        emissive: new THREE.Color(this.data.color).multiplyScalar(0.3),
        side: THREE.BackSide
      });
      
      const coronaRing = new THREE.Mesh(coronaGeometry, coronaMaterial);
      coronaRing.position.copy(this.mesh.position);
      
      this.scene.add(coronaRing);
      this.coronaRings.push(coronaRing);
    }
  }

  createLensFlare() {
    // Create a simple lens flare effect using sprites
    const flareGeometry = new THREE.PlaneGeometry(this.data.size * 2, this.data.size * 2);
    const flareMaterial = new THREE.MeshBasicMaterial({
      color: this.data.color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const lensFlare = new THREE.Mesh(flareGeometry, flareMaterial);
    lensFlare.position.copy(this.mesh.position);
    lensFlare.position.z += 0.1; // Slightly offset
    
    this.scene.add(lensFlare);
    this.lensFlare = lensFlare;
  }

  // Override parent updateVisuals method
  updateVisuals(time, deltaTime) {
    // Update light position to follow star
    if (this.light) {
      this.light.position.copy(this.position);
    }
    
    // Update corona ring positions and animations
    this.coronaRings.forEach((ring, index) => {
      ring.position.copy(this.position);
      ring.rotation.x += 0.001 * (index + 1);
      ring.rotation.z += 0.0005 * (index + 1);
      
      // Subtle pulsing effect
      const pulse = 1 + Math.sin(time * 2 + index) * 0.05;
      ring.scale.setScalar(pulse);
    });
    
    // Animate material intensity for pulsing effect
    if (this.material && this.data.pulse) {
      const pulseIntensity = this.data.baseIntensity + Math.sin(time * this.data.pulseSpeed) * 0.2;
      this.material.emissiveIntensity = pulseIntensity;
    }
    
    // Update lens flare rotation and position
    if (this.lensFlare) {
      this.lensFlare.rotation.z += 0.01;
      this.lensFlare.position.copy(this.position);
    }
  }
  
  // Override parent updateCustom method for star-specific behavior
  updateCustom(time, deltaTime) {
    // Apply default rotation if no angular velocity is set
    if (this.angularVelocity.length() === 0) {
      this.angularVelocity.y = this.data.rotationSpeed || 0.003;
    }
  }

  // Legacy method for backwards compatibility
  animate(time, deltaTime = 0.016) {
    this.update(time, deltaTime);
  }

  updateLightIntensity(intensity) {
    if (this.light) {
      this.light.intensity = intensity;
    }
  }

  // Override parent dispose method to handle star-specific cleanup
  dispose() {
    // Dispose light
    if (this.light) {
      this.scene.remove(this.light);
    }
    
    // Dispose corona rings
    this.coronaRings.forEach(ring => {
      ring.geometry.dispose();
      ring.material.dispose();
      this.scene.remove(ring);
    });
    
    // Dispose lens flare
    if (this.lensFlare) {
      this.lensFlare.geometry.dispose();
      this.lensFlare.material.dispose();
      this.scene.remove(this.lensFlare);
    }
    
    // Call parent dispose
    super.dispose();
  }
}

export default Star;
