// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGalaxyContext } from '../contexts/GalaxyContext';
import '../styles/components/header.css';

function Header() {
  const location = useLocation();
  const { generateNewGalaxies, activeSection } = useGalaxyContext();
  
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

  // Section navigation links
  const sectionLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  // Smooth scroll handler for nav links
  const handleNavClick = (e, id) => {
    console.log('Nav click for:', id);
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 60; // Fixed header height
      const offset = window.innerWidth * 0.1; // 10vw offset
      const elementTop = el.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementTop - offset - headerHeight - 20; // account for header and slightly before
      window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
      // Removed direct style override for fade transitions
    } else {
    }
    // Optionally update hash in URL
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `/#${id}`);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">Tyler Kneffler</Link>

        <nav className="site-header__nav">
          <ul className="site-header__nav-list">
            {sectionLinks.map(link => (
              <li key={link.id} className="site-header__nav-item">
                <a
                  href={`/#${link.id}`}
                  className={`site-header__nav-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={e => handleNavClick(e, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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