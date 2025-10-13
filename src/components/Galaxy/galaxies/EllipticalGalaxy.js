import { Galaxy } from '../Galaxy';

export default class EllipticalGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Elliptical-specific defaults
    this.majorAxis = this.galaxyType === 'elliptical_giant' ? 1400 : 800;
    this.minorAxis = this.galaxyType === 'elliptical_giant' ? 1000 : 600;
    this.eccentricity = 0.5;
    this.flatness = this.minorAxis / this.majorAxis;
    this.hasArms = false;
    
    // Colors - more reddish for older stellar populations
    this.colors = {
      core: '#FFE4B5',
      oldStars: '#DEB887',
      halo: '#A0522D',
      nebulae: '#DA70D6'
    };
    
    // Star counts - fewer young stars
    this.starCounts = {
      coreStars: 6000,
      diskStars: 12000,
      haloStars: 3000
    };
    
    this.rotationSpeed = 0.1; // Slow rotation
  }

  // Custom elliptical animation - gentle tumbling
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.x += this.rotationSpeed * deltaTime * 0.0005;
      this.galaxyGroup.rotation.z += this.rotationSpeed * deltaTime * 0.0003;
    }
  }
}
