import * as THREE from 'three';

export class CelestialObject {
  constructor(objectData, scene, galaxy = null) {
    this.data = objectData;
    this.scene = scene;
    this.galaxy = galaxy; // Reference to parent galaxy for inter-object interactions
    this.mesh = null;
    this.material = null;
    
    // Universal physics properties
    this.position = new THREE.Vector3(
      (this.data.x !== undefined && !isNaN(this.data.x)) ? this.data.x : 0,
      (this.data.y !== undefined && !isNaN(this.data.y)) ? this.data.y : 0,
      (this.data.z !== undefined && !isNaN(this.data.z)) ? this.data.z : 0
    );
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.forces = new THREE.Vector3(0, 0, 0);
    
    // Physical properties
    this.radius = this.data.size || 1;
    this.density = this.data.density || 1.0;
    this.mass = this.calculateMass();
    
    // Object type and behavior flags
    this.type = this.data.type || 'generic';
    this.isStatic = this.data.isStatic || false; // Objects that don't move
    this.hasGravity = this.data.hasGravity !== false; // Most objects have gravity
    this.affectedByGravity = this.data.affectedByGravity !== false; // Most objects are affected by gravity
    
    // Lifecycle state
    this.isActive = true;
    this.age = 0;
    this.lifespan = this.data.lifespan || Infinity;
    
    // Register with galaxy if provided
    if (this.galaxy) {
      this.galaxy.addCelestialObject(this);
      // Disabled logging to reduce console spam
      // console.log(`✨ Created ${this.type}: ${this.name} (mass: ${this.mass.toFixed(2)}, position: [${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)}, ${this.position.z.toFixed(1)}])`);
    }
  }

  calculateMass() {
    // Default mass calculation based on size and density
    const radius = this.radius || this.data.size || 1;
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const density = this.density || 1.0;
    const massMultiplier = this.data.massMultiplier || 1;
    return volume * density * massMultiplier;
  }

  // Core update method - called every frame
  update(time, deltaTime = 0.016) {
    if (!this.isActive) return;
    
    this.age += deltaTime;
    
    // Check lifespan
    if (this.age >= this.lifespan) {
      this.destroy();
      return;
    }
    
    // Apply physics if not static
    if (!this.isStatic) {
      this.updatePhysics(deltaTime);
    }
    
    // Update visual representation
    this.updateVisuals(time, deltaTime);
    
    // Custom object-specific updates
    this.updateCustom(time, deltaTime);
  }

  updatePhysics(deltaTime) {
    // Apply gravitational forces from other objects
    if (this.affectedByGravity && this.galaxy) {
      this.applyGravitationalForces();
    }
    
    // Apply forces to acceleration (F = ma, so a = F/m)
    this.acceleration.copy(this.forces).divideScalar(this.mass);
    
    // Update velocity with acceleration
    this.velocity.addScaledVector(this.acceleration, deltaTime);
    
    // Apply damping to prevent runaway velocities
    this.velocity.multiplyScalar(0.999);
    
    // Update position with velocity
    this.position.addScaledVector(this.velocity, deltaTime);
    
    // Update mesh position
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
    
    // Update rotation with angular velocity
    if (this.mesh) {
      this.mesh.rotation.x += this.angularVelocity.x * deltaTime;
      this.mesh.rotation.y += this.angularVelocity.y * deltaTime;
      this.mesh.rotation.z += this.angularVelocity.z * deltaTime;
    }
    
    // Reset forces for next frame
    this.forces.set(0, 0, 0);
  }

  applyGravitationalForces() {
    if (!this.galaxy || !this.galaxy.celestialObjects) return;
    
    // Apply gravity from all other objects
    this.galaxy.celestialObjects.forEach(otherObject => {
      if (otherObject === this || !otherObject.hasGravity || !otherObject.isActive) return;
      
      this.applyGravityFrom(otherObject);
    });
  }

  applyGravityFrom(otherObject) {
    // Calculate gravitational force between this object and another
    const distance = this.position.distanceTo(otherObject.position);
    
    // Avoid division by zero and objects that are too close
    if (distance < 0.1) return;
    
    // Gravitational constant (scaled for our simulation)
    const G = 0.001;
    
    // Calculate gravitational force magnitude: F = G * m1 * m2 / r^2
    const forceMagnitude = G * this.mass * otherObject.mass / (distance * distance);
    
    // Calculate direction from this object to other object
    const direction = new THREE.Vector3()
      .subVectors(otherObject.position, this.position)
      .normalize();
    
    // Apply force
    const gravitationalForce = direction.multiplyScalar(forceMagnitude);
    this.applyForce(gravitationalForce);
    
    // Debug significant gravitational interactions (disabled to reduce console spam)
    // if (forceMagnitude > 0.1) {
    //   console.log(`🌍 Strong gravity: ${this.name} ← ${otherObject.name} (F=${forceMagnitude.toFixed(3)}, d=${distance.toFixed(1)})`);
    // }
  }

  updateVisuals(time, deltaTime) {
    // Override in subclasses for object-specific visual updates
    // This is where materials, lights, effects get updated
  }

  updateCustom(time, deltaTime) {
    // Override in subclasses for object-specific behavior
    // This is where orbital mechanics, special behaviors, etc. go
  }

  // Force application methods
  applyForce(force) {
    this.forces.add(force);
  }

  applyImpulse(impulse) {
    // Apply instant velocity change (impulse = mass * velocity change)
    const velocityChange = impulse.clone().divideScalar(this.mass);
    this.velocity.add(velocityChange);
  }

  // Setters for common properties
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
  }

  setVelocity(x, y, z) {
    this.velocity.set(x, y, z);
  }

  setAngularVelocity(x, y, z) {
    this.angularVelocity.set(x, y, z);
  }

  setMass(mass) {
    this.mass = mass;
  }

  // Collision detection
  intersects(otherObject) {
    const distance = this.position.distanceTo(otherObject.position);
    return distance < (this.radius + otherObject.radius);
  }

  // Collision response
  handleCollision(otherObject) {
    // Basic elastic collision response
    // Override in subclasses for specific collision behaviors
    
    // Calculate collision normal
    const normal = new THREE.Vector3()
      .subVectors(this.position, otherObject.position)
      .normalize();
    
    // Calculate relative velocity
    const relativeVelocity = new THREE.Vector3()
      .subVectors(this.velocity, otherObject.velocity);
    
    // Calculate collision impulse
    const impulse = -2 * relativeVelocity.dot(normal) / (1/this.mass + 1/otherObject.mass);
    
    // Apply impulse to both objects
    this.velocity.addScaledVector(normal, impulse / this.mass);
    otherObject.velocity.addScaledVector(normal, -impulse / otherObject.mass);
  }

  // Lifecycle methods
  destroy() {
    this.isActive = false;
    
    // Remove from scene
    if (this.mesh && this.scene) {
      this.scene.remove(this.mesh);
    }
    
    // Remove from galaxy
    if (this.galaxy) {
      this.galaxy.removeCelestialObject(this);
    }
    
    // Dispose resources
    this.dispose();
  }

  dispose() {
    // Override in subclasses to dispose of specific resources
    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) {
        if (Array.isArray(this.mesh.material)) {
          this.mesh.material.forEach(material => material.dispose());
        } else {
          this.mesh.material.dispose();
        }
      }
    }
  }

  // Getters for compatibility
  get name() { return this.data.name || `${this.type}_${Math.random().toString(36).substr(2, 9)}`; }
  get size() { return this.radius; }
  get isDestroyed() { return !this.isActive; }
  
  // Utility methods
  distanceTo(otherObject) {
    return this.position.distanceTo(otherObject.position);
  }

  getKineticEnergy() {
    return 0.5 * this.mass * this.velocity.lengthSq();
  }

  getPotentialEnergy(referenceHeight = 0) {
    // Gravitational potential energy relative to reference height
    const g = 9.81; // Can be adjusted for different environments
    return this.mass * g * (this.position.y - referenceHeight);
  }

  getTotalEnergy(referenceHeight = 0) {
    return this.getKineticEnergy() + this.getPotentialEnergy(referenceHeight);
  }

  // Debug information
  getDebugInfo() {
    return {
      name: this.name,
      type: this.type,
      position: this.position.toArray(),
      velocity: this.velocity.toArray(),
      mass: this.mass,
      age: this.age,
      isActive: this.isActive,
      kineticEnergy: this.getKineticEnergy(),
      totalEnergy: this.getTotalEnergy()
    };
  }
}

export default CelestialObject;