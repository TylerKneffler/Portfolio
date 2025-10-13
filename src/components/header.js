// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {

  return (
    <header style={{ 
      backgroundColor: '#000000',
      color: 'white',
      padding: '15px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #333333',
      width: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          Tyler Kneffler
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        </nav>
      </div>
    </header>
  );
}

export default Header;