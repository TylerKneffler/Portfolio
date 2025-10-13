import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GalaxyRenderer from '../../components/Galaxy/GalaxyRenderer';
import '../../styles/pages/public/pixel_test_page.css';

// Galaxy types registry to replace the JSON data
const galaxyTypes = {
  milky_way: {
    name: 'Milky Way',
    description: 'Our home galaxy - a barred spiral with distinctive arms',
    type: 'spiral',
    config: { 
      coreRadius: 200, 
      diskRadius: 2000, 
      spiralArms: 4, 
      hasBar: true, 
      barLength: 800,
      starCounts: { core: 8000, arms: 20000, disk: 15000, halo: 3000 }
    }
  },
  andromeda: {
    name: 'Andromeda Galaxy',
    description: 'Nearest major galaxy - a grand spiral approaching us',
    type: 'spiral',
    config: { 
      coreRadius: 250, 
      diskRadius: 2500, 
      spiralArms: 2, 
      hasBar: false,
      starCounts: { core: 12000, arms: 25000, disk: 18000, halo: 4000 }
    }
  },
  whirlpool: {
    name: 'Whirlpool Galaxy',
    description: 'Classic grand design spiral with prominent arms',
    type: 'spiral',
    config: { 
      coreRadius: 180, 
      diskRadius: 1800, 
      spiralArms: 2, 
      hasBar: false,
      starCounts: { core: 6000, arms: 18000, disk: 12000, halo: 2500 }
    }
  },
  elliptical_giant: {
    name: 'Giant Elliptical',
    description: 'Massive elliptical galaxy with ancient stars',
    type: 'elliptical',
    config: { 
      coreRadius: 400, 
      diskRadius: 3000, 
      spiralArms: 0,
      starCounts: { core: 20000, halo: 15000, outer: 8000 }
    }
  },
  elliptical_elongated: {
    name: 'Elongated Elliptical',
    description: 'Highly elongated elliptical galaxy',
    type: 'elliptical',
    config: { 
      coreRadius: 300, 
      diskRadius: 2200, 
      spiralArms: 0,
      starCounts: { core: 15000, halo: 12000, outer: 6000 }
    }
  },
  elliptical_dwarf: {
    name: 'Dwarf Elliptical',
    description: 'Small elliptical satellite galaxy',
    type: 'elliptical',
    config: { 
      coreRadius: 100, 
      diskRadius: 600, 
      spiralArms: 0,
      starCounts: { core: 3000, halo: 2000, outer: 1000 }
    }
  },
  irregular_large: {
    name: 'Large Irregular',
    description: 'Chaotic galaxy with active star formation',
    type: 'irregular',
    config: { 
      coreRadius: 150, 
      diskRadius: 1500, 
      spiralArms: 0,
      starCounts: { core: 5000, regions: 8000, scattered: 4000 }
    }
  },
  irregular_dwarf: {
    name: 'Dwarf Irregular',
    description: 'Small irregular galaxy with ongoing formation',
    type: 'irregular',
    config: { 
      coreRadius: 80, 
      diskRadius: 800, 
      spiralArms: 0,
      starCounts: { core: 2000, regions: 3000, scattered: 1500 }
    }
  },
  lenticular: {
    name: 'Lenticular Galaxy',
    description: 'Lens-shaped galaxy between spiral and elliptical',
    type: 'lenticular',
    config: { 
      coreRadius: 220, 
      diskRadius: 1800, 
      spiralArms: 0,
      starCounts: { core: 10000, disk: 12000, halo: 3000 }
    }
  },
  peculiar: {
    name: 'Peculiar Galaxy',
    description: 'Disturbed galaxy showing signs of interaction',
    type: 'peculiar',
    config: { 
      coreRadius: 180, 
      diskRadius: 1600, 
      spiralArms: 0,
      starCounts: { core: 6000, disturbed: 8000, tails: 3000 }
    }
  },
  ring: {
    name: 'Ring Galaxy',
    description: 'Rare galaxy with prominent ring structure',
    type: 'ring',
    config: { 
      coreRadius: 120, 
      diskRadius: 1400, 
      spiralArms: 0,
      starCounts: { core: 4000, ring: 9000, outer: 2000 }
    }
  }
};

function GalaxyTest() {
  const [pixelSize, setPixelSize] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(1500);
  const [cameraAzimuth, setCameraAzimuth] = useState(0);
  const [cameraPolar, setCameraPolar] = useState(90);
  const [galaxyType, setGalaxyType] = useState('milky_way');

  const handleCameraChange = (info) => {
    // Camera info callback - can be used for debugging
    console.log('Camera changed:', info);
  };

  // Get galaxy information for display
  const getGalaxyInfo = () => {
    const galaxyConfig = galaxyTypes[galaxyType];
    if (!galaxyConfig) return null;
    
    return {
      name: galaxyConfig.name,
      description: galaxyConfig.description,
      type: galaxyConfig.type,
      config: galaxyConfig.config
    };
  };

  const galaxyInfo = getGalaxyInfo();

  return (
    <div className="pixel-test-page" style={{ backgroundColor: '#000011', color: '#ffffff', minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '2rem', color: '#ffffff' }}>
        <h1 style={{ color: '#00ff88', fontSize: '2.5rem', marginBottom: '1rem' }}>🌌 Galaxy Renderer Test</h1>
        <p style={{ color: '#cccccc', fontSize: '1.2rem', marginBottom: '1rem' }}>Interactive spiral galaxy with star systems, nebulae, and galactic structures</p>
        <nav className="breadcrumb" style={{ color: '#00ccff' }}>
          <Link to="/" style={{ color: '#00ccff', textDecoration: 'none' }}>Home</Link> → <Link to="/pixel-test" style={{ color: '#00ccff', textDecoration: 'none' }}>Pixel Test</Link> → <span style={{ color: '#ffffff' }}>Galaxy Test</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="test-content">
        {/* Controls Panel */}
        <div className="controls-panel" style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ color: '#00ff88', marginBottom: '1.5rem' }}>🎮 Galaxy Controls</h3>
          
          <div className="control-group">
            <label style={{ color: '#ffffff' }}>Pixel Size: {pixelSize}px</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label style={{ color: '#ffffff' }}>
              <input 
                type="checkbox" 
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
              />
              Animate Galaxy
            </label>
          </div>

          <div className="control-group">
            <label style={{ color: '#ffffff' }}>Camera Distance: {cameraDistance}</label>
            <input 
              type="range" 
              min="500" 
              max="5000" 
              value={cameraDistance}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraDistance(value);
                if (window.galaxyRendererCameraControls) {
                  window.galaxyRendererCameraControls.setDistance(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label style={{ color: '#ffffff' }}>Azimuth Angle: {Math.round(cameraAzimuth)}°</label>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={cameraAzimuth}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraAzimuth(value);
                if (window.galaxyRendererCameraControls) {
                  window.galaxyRendererCameraControls.setAzimuth(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label style={{ color: '#ffffff' }}>Polar Angle: {Math.round(cameraPolar)}°</label>
            <input 
              type="range" 
              min="10" 
              max="170" 
              value={cameraPolar}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraPolar(value);
                if (window.galaxyRendererCameraControls) {
                  window.galaxyRendererCameraControls.setPolar(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label style={{ color: '#ffffff' }}>Galaxy Type: {galaxyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
            <select 
              value={galaxyType}
              onChange={(e) => setGalaxyType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                marginTop: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.8)', 
                color: '#ffffff', 
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            >
              <option value="milky_way">Milky Way (Barred Spiral)</option>
              <option value="andromeda">Andromeda (Spiral)</option>
              <option value="whirlpool">Whirlpool (Grand Design Spiral)</option>
              <option value="elliptical_giant">Giant Elliptical (E0)</option>
              <option value="elliptical_elongated">Elongated Elliptical (E5)</option>
              <option value="elliptical_dwarf">Dwarf Elliptical</option>
              <option value="irregular_large">Large Irregular</option>
              <option value="irregular_dwarf">Dwarf Irregular</option>
              <option value="lenticular">Lenticular (S0)</option>
              <option value="peculiar">Peculiar/Interacting</option>
              <option value="ring">Ring Galaxy</option>
            </select>
          </div>

          <div className="info-panel" style={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
            <h4 style={{ color: '#00ff88', marginBottom: '1rem' }}>🌟 Galaxy Features</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Galactic Core:</strong> Bright central bulge with 10K core stars</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Spiral Arms:</strong> 4 arms with 60K young blue stars</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Star Systems:</strong> 50 detailed planetary systems</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Nebulae:</strong> 20 colorful star-forming regions</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Galactic Halo:</strong> 2K old red halo stars</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Total Objects:</strong> ~82K+ celestial bodies</li>
            </ul>
          </div>

          <div className="controls-info" style={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #333', marginTop: '1rem' }}>
            <h4 style={{ color: '#00ff88', marginBottom: '1rem' }}>📊 Camera Info</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Distance:</strong> {Math.round(cameraDistance)} units</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Azimuth:</strong> {Math.round(cameraAzimuth)}°</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Polar:</strong> {Math.round(cameraPolar)}°</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Pixel Size:</strong> {pixelSize}px</li>
            </ul>
          </div>
        </div>

        {/* Galaxy Display */}
        <div className="renderer-display">
          <div className="renderer-wrapper">
            <GalaxyRenderer
              pixelSize={pixelSize}
              width={1000}
              height={700}
              animate={animate}
              galaxyType={galaxyType}
              cameraControls={{ 
                distance: cameraDistance, 
                azimuth: cameraAzimuth, 
                polar: cameraPolar 
              }}
              onCameraChange={handleCameraChange}
              className="galaxy-renderer"
            />
          </div>
          
          <div className="renderer-info" style={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.8)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', marginTop: '1rem' }}>
            <h4 style={{ color: '#00ff88', marginBottom: '1rem' }}>Galaxy Specifications</h4>
            {galaxyInfo && (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Name:</strong> {galaxyInfo.name}</li>
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Type:</strong> {galaxyInfo.type.charAt(0).toUpperCase() + galaxyInfo.type.slice(1)}</li>
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Description:</strong> {galaxyInfo.description}</li>
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Core Radius:</strong> {galaxyInfo.config.coreRadius} units</li>
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Disk Radius:</strong> {galaxyInfo.config.diskRadius} units</li>
                {galaxyInfo.config.spiralArms && (
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Spiral Arms:</strong> {galaxyInfo.config.spiralArms}</li>
                )}
                {galaxyInfo.config.hasBar && (
                  <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Bar Length:</strong> {galaxyInfo.config.barLength} units</li>
                )}
                <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#00ccff' }}>Total Stars:</strong> ~{Object.values(galaxyInfo.config.starCounts || {}).reduce((a, b) => a + b, 0).toLocaleString()}</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Galaxy Information */}
      <div className="examples-section">
        <h3>🔭 Galactic Structure Guide</h3>
        <div className="examples-grid">
          <div className="example-item">
            <h4>🌟 Galactic Core</h4>
            <p>Dense central region containing older yellow stars and the galactic center. High stellar density with gravitational interactions.</p>
          </div>
          
          <div className="example-item">
            <h4>🌀 Spiral Arms</h4>
            <p>Star-forming regions with young blue giants and stellar nurseries. Follow logarithmic spiral patterns with density waves.</p>
          </div>
          
          <div className="example-item">
            <h4>🌈 Nebulae</h4>
            <p>Colorful gas clouds where new stars are born. Pink H-alpha regions, blue reflection nebulae, and emission regions.</p>
          </div>
          
          <div className="example-item">
            <h4>🪐 Star Systems</h4>
            <p>Complete planetary systems scattered throughout the galaxy. Each system contains 1-8 planets with realistic orbital mechanics.</p>
          </div>
        </div>
      </div>

      {/* Performance Notes */}
      <div className="performance-section">
        <h3>⚡ Performance Information</h3>
        <div className="performance-grid">
          <div className="performance-item">
            <h4>🎯 Optimization</h4>
            <ul>
              <li>Point-based particle systems for efficient rendering</li>
              <li>Level-of-detail for distant star systems</li>
              <li>Instanced geometry for repeated objects</li>
              <li>Culling for off-screen objects</li>
            </ul>
          </div>
          
          <div className="performance-item">
            <h4>🖥️ System Requirements</h4>
            <ul>
              <li><strong>Recommended:</strong> Modern GPU with WebGL 2.0</li>
              <li><strong>RAM:</strong> 4GB+ for smooth interaction</li>
              <li><strong>Browser:</strong> Chrome, Firefox, Safari (latest)</li>
              <li><strong>Note:</strong> Reduce pixel size for better performance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-section">
        <Link to="/pixel-test" className="nav-button">← Back to Solar System</Link>
        <Link to="/" className="nav-button">🏠 Home</Link>
      </div>
    </div>
  );
}

export default GalaxyTest;
