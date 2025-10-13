import React, { useEffect } from 'react';
import GalaxyBackground from '../../components/Galaxy/GalaxyBackground';

function SimpleGalaxyPage() {
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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Add galaxy background */}
      <GalaxyBackground 
        galaxyType="andromeda" 
        animate={true} 
        opacity={0.6}
        cameraDistance={2500}
        rotationSpeed={0.0003}
      />
      
      {/* Page content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, // Higher than galaxy background (z-index: 1)
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '2rem',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          background: 'linear-gradient(45deg, #00ff88, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to the Galaxy
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '3rem',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          This page demonstrates how easy it is to add a stunning galaxy background 
          to any component. The background is fully interactive and performance-optimized.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>🚀 Easy Setup</h3>
            <p>Just import and add the component - it handles everything else automatically.</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#00ccff', marginBottom: '1rem' }}>⚡ High Performance</h3>
            <p>Optimized rendering with configurable quality settings for smooth performance.</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#ff6b9d', marginBottom: '1rem' }}>🎨 Customizable</h3>
            <p>Multiple galaxy types, animation controls, and visual properties to match your design.</p>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Code Example</h3>
          <pre style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'left',
            overflow: 'auto',
            fontSize: '0.9rem',
            color: '#00ccff'
          }}>
{`import GalaxyBackground from './components/Background/GalaxyBackground';

function MyPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <GalaxyBackground 
        galaxyType="andromeda" 
        animate={true} 
        opacity={0.6}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Your page content here */}
      </div>
    </div>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SimpleGalaxyPage;
