import { Galaxy } from '../Galaxy';

export default class IrregularGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Irregular galaxy defaults - smaller and more chaotic
    this.width = this.galaxyType === 'irregular_lmc' ? 800 : 600;
    this.height = this.galaxyType === 'irregular_lmc' ? 600 : 400;
    this.depth = 200;
    this.asymmetry = 0.7;
    this.chaosLevel = this.galaxyType === 'irregular_starburst' ? 1.0 : 0.8;
    this.chaotic = true;
    this.hasArms = false;
    
    // Colors - active star formation regions
    this.colors = {
      youngStars: this.galaxyType === 'irregular_starburst' ? '#00BFFF' : '#4682B4',
      oldStars: '#8B7355',
      nebulae: this.galaxyType === 'irregular_starburst' ? '#FF0080' : '#8B008B',
      gas: '#008B8B'
    };
    
    // Reduced star counts for better performance
    this.starCounts = {
      youngStars: this.galaxyType === 'irregular_starburst' ? 3000 : 2000,
      oldStars: 1500,
      nebulae: this.galaxyType === 'irregular_starburst' ? 100 : 50
    };
    
    this.rotationSpeed = this.galaxyType === 'irregular_starburst' ? 0.4 : 0.2;
  }

  // Custom irregular animation - chaotic movement
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Irregular, unpredictable rotation
      this.galaxyGroup.rotation.x += Math.sin(time * 0.1) * this.rotationSpeed * deltaTime * 0.001;
      this.galaxyGroup.rotation.y += Math.cos(time * 0.13) * this.rotationSpeed * deltaTime * 0.001;
      this.galaxyGroup.rotation.z += Math.sin(time * 0.07) * this.rotationSpeed * deltaTime * 0.0005;
    }
  }
}
