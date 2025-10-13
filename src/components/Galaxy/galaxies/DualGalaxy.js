import { Galaxy } from '../Galaxy';

export default class DualGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Dual galaxy defaults - two distinct galaxies orbiting common center
    this.galaxyRadius = 2000;
    this.coreRadius = 180;
    this.hasArms = true;
    this.armCount = 2;
    
    // Two galaxy system
    this.primaryGalaxy = {
      radius: 800,
      coreRadius: 180,
      mass: 1.5,
      spiralTightness: 0.3
    };
    this.secondaryGalaxy = {
      radius: 600,
      coreRadius: 140,
      mass: 1.0,
      spiralTightness: 0.4
    };
    
    this.separation = 1200;
    this.orbitalPeriod = 300; // seconds for one orbit
    
    // Colors - distinct populations
    this.colors = {
      primary: '#FFD700',
      secondary: '#87CEEB',
      bridge: '#DDA0DD',
      halo: '#F5F5DC'
    };
    
    // Star counts - balanced distribution
    this.starCounts = {
      primaryCore: 12000,
      primaryArms: 15000,
      secondaryCore: 8000,
      secondaryArms: 10000,
      bridge: 2000
    };
    
    this.rotationSpeed = 0.15;
  }

  // Custom dual animation - binary orbital motion
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Binary orbital motion
      const orbitalAngle = (time / this.orbitalPeriod) * Math.PI * 2;
      this.galaxyGroup.rotation.y = orbitalAngle;
      
      // Individual galaxy rotations
      this.galaxyGroup.rotation.x += Math.sin(time * 0.05) * deltaTime * 0.0002;
      this.galaxyGroup.rotation.z += Math.cos(time * 0.08) * deltaTime * 0.0003;
    }
  }
}
