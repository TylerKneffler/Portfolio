import { Galaxy } from '../Galaxy';

export default class ClusterGalaxy extends Galaxy {
  constructor(scene, galaxyType) {
    super(scene, galaxyType);
    this.setDefaultConfig();
    this.createGalaxy(); // Create galaxy AFTER config is set
  }

  setDefaultConfig() {
    // Cluster galaxy defaults - dense galaxy cluster environment
    this.galaxyRadius = 2500;
    this.coreRadius = 300;
    this.hasArms = false;
    this.chaotic = true;
    
    // Galaxy cluster properties
    this.cluster = {
      memberCount: 15,
      centralGalaxyMass: 3.0,
      satelliteGalaxies: 14,
      viralRadius: 2000
    };
    
    // Environmental effects
    this.environment = {
      ramPressureStripping: true,
      tidalInteractions: true,
      mergerRate: 0.8,
      starFormationSuppression: 0.6
    };
    
    // Colors - evolved stellar populations
    this.colors = {
      centralGalaxy: '#FFD700',
      satellites: '#FFA500',
      intraclusterMedium: '#E6E6FA',
      shocked: '#FF6347',
      stripped: '#DDA0DD'
    };
    
    // Star counts - distributed across cluster
    this.starCounts = {
      centralCore: 20000,
      centralHalo: 15000,
      satellites: 25000,
      intracluster: 8000,
      stripped: 5000
    };
    
    this.rotationSpeed = 0.05; // Slow cluster dynamics
  }

  // Custom cluster animation - complex gravitational dynamics
  updateCustom(time, deltaTime) {
    if (this.galaxyGroup) {
      // Slow cluster rotation
      this.galaxyGroup.rotation.y += this.rotationSpeed * deltaTime * 0.0003;
      
      // Gravitational perturbations
      this.galaxyGroup.rotation.x += Math.sin(time * 0.03) * deltaTime * 0.0001;
      this.galaxyGroup.rotation.z += Math.cos(time * 0.02) * deltaTime * 0.0001;
      
      // Slight pulsing from ongoing mergers
      const pulse = Math.sin(time * 0.5) * 0.1 + 1;
      this.galaxyGroup.scale.setScalar(pulse * 0.02 + 0.98);
    }
  }
}
