import { Galaxy } from '../Galaxy';

export default class BlackHoleGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Black hole galaxy defaults - galaxy with active galactic nucleus
    this.galaxyRadius = 1500;
    this.coreRadius = 200;
    this.hasArms = true;
    this.armCount = 2;
    
    // Central black hole and accretion disk
    this.blackHole = {
      eventHorizonRadius: 10,
      accretionDiskRadius: 100,
      jetLength: 2000,
      jetWidth: 50
    };
    
    // AGN properties
    this.agn = {
      luminosity: 2.5,
      variability: 0.3,
      jetDirection: Math.PI / 4
    };
    
    // Colors - high energy emissions
    this.colors = {
      core: '#FF0000',
      accretionDisk: '#FF4500',
      jets: '#00FFFF',
      galaxy: '#FFFF00',
      halo: '#FF69B4'
    };
    
    // Star counts - disrupted by central activity
    this.starCounts = {
      core: 15000,
      innerDisk: 12000,
      outerDisk: 18000,
      jets: 1000,
      disrupted: 3000
    };
    
    this.rotationSpeed = 0.8; // Faster due to black hole influence
  }

  // Custom black hole animation - intense rotation and jet precession
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Rapid rotation from black hole
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.001;
      
      // AGN variability - pulsing effect
      const pulse = Math.sin(time * 2) * 0.3 + 1;
      this.galaxyGroup.scale.setScalar(pulse * 0.05 + 0.95);
      
      // Jet precession
      this.galaxyGroup.rotation.x += Math.sin(time * 0.3) * deltaTime * 0.0008;
      this.galaxyGroup.rotation.z += Math.cos(time * 0.2) * deltaTime * 0.0006;
    }
  }
}
