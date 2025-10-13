import { Galaxy } from '../Galaxy';

export default class PeculiarGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Peculiar galaxy defaults - interacting galaxies with tidal tails
    this.galaxyRadius = 1200;
    this.coreRadius = 150;
    this.hasArms = false;
    this.chaotic = true;
    
    // Two galaxy components
    this.galaxy1 = {
      coreRadius: 150,
      diskRadius: 600,
      separation: 400
    };
    this.galaxy2 = {
      coreRadius: 120,
      diskRadius: 500,
      separation: 400
    };
    
    this.tidalTails = {
      length: 800,
      width: 100,
      particleCount: 3000
    };
    
    // Colors - mixed populations from interaction
    this.colors = {
      galaxy1Core: '#FFD700',
      galaxy2Core: '#FF6347',
      tidalTails: '#DDA0DD',
      shockRegions: '#FF69B4'
    };
    
    // Star counts - distributed across components
    this.starCounts = {
      galaxy1Core: 8000,
      galaxy1Arms: 10000,
      galaxy2Core: 6000,
      galaxy2Arms: 8000,
      tidalTails: 4000
    };
    
    this.rotationSpeed = 0.2;
  }

  // Custom peculiar animation - complex interaction dynamics
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Complex orbital motion
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.0005;
      this.galaxyGroup.rotation.x += Math.sin(time * 0.1) * deltaTime * 0.0003;
      // Simulate gravitational distortion
      this.galaxyGroup.rotation.z += Math.cos(time * 0.07) * deltaTime * 0.0002;
    }
  }
}
