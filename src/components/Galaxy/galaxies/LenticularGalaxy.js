import { Galaxy } from '../Galaxy';

export default class LenticularGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Lenticular galaxy defaults - lens-shaped, between spiral and elliptical
    this.galaxyRadius = 1000;
    this.coreRadius = 300;
    this.bulgeRadius = 300;
    this.thickness = 60;
    this.flatness = this.thickness / this.galaxyRadius;
    this.hasDisk = true;
    this.hasArms = false;
    
    // Colors - older stellar populations with some young stars in disk
    this.colors = {
      core: '#FFE4B5',
      diskStars: '#DEB887',
      youngStars: '#B0E0E6',
      halo: '#A0522D'
    };
    
    // Star counts - moderate
    this.starCounts = {
      coreStars: 7000,
      diskStars: 10000,
      haloStars: 2500
    };
    
    this.rotationSpeed = 0.3;
  }

  // Custom lenticular animation - disk rotation with bulge stability
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Slow disk rotation, stable bulge
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.0008;
      this.galaxyGroup.rotation.x += Math.sin(time * 0.1) * 0.0001;
    }
  }
}
