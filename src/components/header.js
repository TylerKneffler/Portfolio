// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGalaxyContext } from '../contexts/GalaxyContext';
import '../styles/components/header.css';

function Header() {
  const location = useLocation();
  const { generateNewGalaxies } = useGalaxyContext();
  
  // Only show galaxy selector on home page
  const isHomePage = location.pathname === '/';

  // Popup hint state: show transient message on page load
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;
    // Allow forcing the popup to show using ?galaxyPopup=1 in the URL (useful for testing)
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const forceShow = params && params.get('galaxyPopup') === '1';

    try {
      // If user dismissed previously, don't show unless forced
      const dismissed = localStorage.getItem('galaxyPopupDismissed');
      if (dismissed && !forceShow) return;
    } catch (e) {
      // localStorage might be unavailable in some environments; fall back to showing by default
    }

    // Show until dismissed by the user (sticky)
    setShowPopup(true);

    // No automatic timeout; user must dismiss.
    return undefined;
  }, [isHomePage]);

  // Dismiss handler: hide popup and persist dismissal so it won't show again
  const dismissPopup = () => {
    setShowPopup(false);
    try { localStorage.setItem('galaxyPopupDismissed', '1'); } catch (e) {}
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">Tyler Kneffler</Link>

        <nav className="site-header__nav">
          {isHomePage && (
            <div className="galaxy-control">
              <button
                className="galaxy-btn"
                onClick={generateNewGalaxies}
                title="Generate New Galaxy"
                aria-label="Generate New Galaxy"
                aria-describedby="galaxy-tooltip"
              >
                {/* Inline black-and-white SVG galaxy/star icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="12" r="2" fill="#ffffff" />
                  <path d="M4.5 12c0 .276-.224.5-.5.5S3.5 12.276 3.5 12 3.724 11.5 4 11.5s.5.224.5.5z" fill="#ffffff" opacity="0.9" />
                  <path d="M20.5 12c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5z" fill="#ffffff" opacity="0.9" />
                  <path d="M12 4.5c.276 0 .5-.224.5-.5S12.276 3.5 12 3.5s-.5.224-.5.5.224.5.5.5z" fill="#ffffff" opacity="0.7" />
                  <path d="M12 20.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5z" fill="#ffffff" opacity="0.7" />
                  <path d="M7.5 7.5l-.7-.7M16.2 16.2l-.7-.7M16.2 7.8l-.7.7M7.5 16.5l-.7.7" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                </svg>
                {/* Accessible label for screen readers */}
                <span id="galaxy-tooltip" className="sr-only">Generate a new galaxy background</span>
              </button>

              {showPopup && (
                <div className="galaxy-popup" role="status" aria-live="polite">
                  <span>Tap the star to generate a new galaxy</span>
                  <button className="galaxy-popup__close" aria-label="Dismiss" onClick={dismissPopup}>×</button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;