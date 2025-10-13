import { Galaxy } from '../Galaxy';

export default class SpiralGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Override with spiral-specific defaults
    this.coreRadius = 200;
    this.galaxyRadius = 1000;
    this.thickness = 100;
    this.armCount = 4;
    this.hasArms = true;
    this.hasBar = this.galaxyType === 'milky_way' || this.galaxyType === 'spiral_barred_variation';
    this.barLength = this.hasBar ? 300 : 0;
    this.barWidth = this.hasBar ? 80 : 0;
    
    // Colors
    this.colors = {
      core: '#FFD700',
      youngStars: '#87CEEB', 
      oldStars: '#FFA500',
      halo: '#8B4513',
      nebulae: '#FF69B4'
    };
    
    // Star counts
    this.starCounts = {
      coreStars: 8000,
      armStars: 25000,
      diskStars: 15000,
      haloStars: 2000
    };
    
    this.rotationSpeed = 0.5;
    this.armTightness = 0.3;
    this.flatness = this.thickness / this.galaxyRadius;
  }

  // Custom spiral animation
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Subtle spiral arm rotation
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.001;
    }
  }
}
