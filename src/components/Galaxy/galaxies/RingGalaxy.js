import { Galaxy } from '../Galaxy';

export default class RingGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Ring galaxy defaults - formed by galactic collision
    this.galaxyRadius = 800;
    this.coreRadius = 100;
    this.ringRadius = 600;
    this.ringWidth = 80;
    this.spokeCount = 6;
    this.expansionSpeed = 0.1;
    this.hasRing = true;
    this.hasArms = false;
    
    // Colors - active star formation in ring
    this.colors = {
      core: '#FFD700',
      ringStars: '#87CEEB',
      youngStars: '#00BFFF',
      shockWave: '#FF69B4'
    };
    
    // Star counts - concentrated in ring
    this.starCounts = {
      coreStars: 3000,
      ringStars: 12000,
      youngStars: 5000
    };
    
    this.rotationSpeed = 0.4;
  }

  // Custom ring animation - expanding ring with spoke rotation
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Ring expansion and rotation
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.001;
      // Simulate slight ring pulsing from shockwave
      const pulseFactor = 1 + Math.sin(time * 0.2) * 0.02;
      this.galaxyGroup.scale.setScalar(pulseFactor);
    }
  }
}
