import React from 'react';
import { Link } from 'react-router-dom';
import GalaxyBackground from '../../components/Galaxy/GalaxyBackground';

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#000000ff',
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Empty space galaxy background */}
      <GalaxyBackground
        galaxyType="empty_space"
        animate={true}
        opacity={0.6}
        cameraDistance={3000}
        rotationSpeed={0.0001}
        includeStarfield={true}
        zIndex={0}
        parallaxStrength={0.02}
      />

      {/* 404 Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '40px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(207, 193, 193, 0.2)'
      }}>
        <h1 style={{
          fontSize: '6rem',
          margin: '0',
          color: '#cfc1c1ff',
          textShadow: '0 0 20px rgba(250, 208, 208, 0.5)'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '2rem',
          margin: '20px 0',
          color: '#cfc1c1ff'
        }}>
          Page Not Found
        </h2>

        <p style={{
          fontSize: '1.2rem',
          margin: '20px 0',
          color: '#b8b8b8'
        }}>
          These aren't the pages you're looking for.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#cfc1c1ff',
            color: '#1a1a2e',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          Move Along
        </Link>
      </div>
    </div>
  );
}

export default NotFound;