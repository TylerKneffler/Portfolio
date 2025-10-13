import React, { useEffect } from 'react';
import GalaxyBackground from '../../components/Galaxy/GalaxyBackground';
import '../../styles/pages/public/pixel_test_page.css';

function GalaxyBackgroundDemo() {
  // Random galaxy type for each page load
  const galaxyTypes = [
    'milky_way', 'andromeda', 'whirlpool', 'elliptical_giant', 'dwarf_elliptical', 
    'irregular_lmc', 'irregular_starburst', 'lenticular', 'peculiar_antennae', 'ring_galaxy',
    'spiral_barred_variation', 'elliptical_flattened', 'dual_spirals', 'dual_ellipticals',
    'black_hole_spiral', 'black_hole_elliptical', 'star_field_dense', 'star_field_sparse',
    'empty_space', 'globular_cluster', 'open_cluster'
  ];
  const randomGalaxyType = galaxyTypes[Math.floor(Math.random() * galaxyTypes.length)];
  console.log('GalaxyBackgroundDemo selected:', randomGalaxyType);
  
  // Galaxy display settings
  const animate = true;
  const opacity = 0.8;
  const cameraDistance = 2500;
  const rotationSpeed = 0.0002;

  // Override body background to ensure galaxy is visible
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    const originalHtmlBackground = document.documentElement.style.backgroundColor;
    
    // Set transparent backgrounds
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundColor = originalBackground;
      document.documentElement.style.backgroundColor = originalHtmlBackground;
    };
  }, []);

  return (
    <div className="galaxy-background-demo" style={{ 
      position: 'relative',
      minHeight: '100vh', 
      color: '#ffffff',
      overflow: 'hidden',
      backgroundColor: 'transparent'
    }}>
      {/* Starfield Background - always visible */}
      <GalaxyBackground
        galaxyType={null}
        animate={animate}
        opacity={1}
        cameraDistance={cameraDistance}
        rotationSpeed={rotationSpeed}
        includeStarfield={true}
        zIndex={0}
        parallaxStrength={0.02}
      />

      {/* Current Galaxy */}
      <GalaxyBackground
        galaxyType={randomGalaxyType}
        animate={animate}
        opacity={opacity}
        cameraDistance={cameraDistance}
        rotationSpeed={rotationSpeed}
        includeStarfield={false}
        zIndex={1}
        parallaxStrength={0.08}
      />

      {/* Debug Info Panel */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>🌌 Galaxy Type: {randomGalaxyType}</div>
        <div>🔧 Physics: Check console for object creation</div>
        <div>📊 Press F12 → Console to see debug info</div>
      </div>

      {/* Scrollable content for demonstration */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: '20px',
        color: 'white',
        minHeight: '200vh' // Make page tall enough to scroll
      }}>
        <h1 style={{ marginTop: '100vh' }}>Galaxy Background Demo</h1>
        <p>Reload the page to see different random galaxy types!</p>
        <p>The galaxy background provides an immersive space environment.</p>
        <p><strong>🔍 Check the browser console (F12) to see if the new physics system is working!</strong></p>
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>More Content</h2>
            <p>The galaxy rotates and provides a beautiful background.</p>
          </div>
        </div>
        <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>End of Demo</h2>
            <p>Reload to see a different galaxy!</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default GalaxyBackgroundDemo;
