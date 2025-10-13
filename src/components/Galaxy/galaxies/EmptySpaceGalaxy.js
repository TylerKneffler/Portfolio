import { Galaxy } from '../Galaxy';

export default class EmptySpaceGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Empty space defaults - void regions with minimal matter
    this.galaxyRadius = 800;
    this.coreRadius = 50;
    this.hasArms = false;
    this.chaotic = false;
    
    // Void properties
    this.void = {
      density: 0.1, // Very low matter density
      expansion: 1.2, // Faster expansion than average
      darkMatterFraction: 0.95
    };
    
    // Sparse matter distribution
    this.matter = {
      gasFilaments: 3,
      isolatedStars: 200,
      darkMatterClumps: 5,
      cosmicRays: true
    };
    
    // Colors - very dim and sparse
    this.colors = {
      background: '#0A0A0A',
      filaments: '#1A1A2E',
      isolatedStars: '#F5F5DC',
      darkMatter: '#2F2F2F',
      cosmicRays: '#4169E1'
    };
    
    // Star counts - extremely sparse
    this.starCounts = {
      filaments: 500,
      isolated: 200,
      background: 100,
      foreground: 50
    };
    
    this.rotationSpeed = 0.01; // Almost no rotation
  }

  // Custom empty space animation - minimal movement representing cosmic expansion
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Very slow drift representing cosmic expansion
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.0001;
      
      // Subtle breathing effect for cosmic expansion
      const expansion = Math.sin(time * 0.01) * 0.05 + 1;
      this.galaxyGroup.scale.setScalar(expansion * 0.01 + 0.99);
      
      // Minimal perturbations
      this.galaxyGroup.rotation.x += Math.sin(time * 0.005) * deltaTime * 0.00005;
    }
  }
}
