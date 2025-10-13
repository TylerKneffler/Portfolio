import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PixelRenderer from '../../components/Galaxy';
import '../../styles/pages/public/pixel_test_page.css';

function PixelTest() {
  const [pixelSize, setPixelSize] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(100);
  const [cameraAzimuth, setCameraAzimuth] = useState(0);
  const [cameraPolar, setCameraPolar] = useState(60);
  const [autoRotate, setAutoRotate] = useState(true);
  const [starCount, setStarCount] = useState(100);
  const [highlightedPlanet, setHighlightedPlanet] = useState('none');
  const [sunBrightness, setSunBrightness] = useState(2.5);
  const [cameraInfo, setCameraInfo] = useState({ distance: 100, azimuth: 0, polar: 60 });

  // Planet names for dropdown
  const planets = [
    { value: 'none', name: 'None' },
    { value: 'mercury', name: 'Mercury' },
    { value: 'venus', name: 'Venus' },
    { value: 'earth', name: 'Earth' },
    { value: 'mars', name: 'Mars' },
    { value: 'jupiter', name: 'Jupiter' },
    { value: 'saturn', name: 'Saturn' },
    { value: 'uranus', name: 'Uranus' },
    { value: 'neptune', name: 'Neptune' }
  ];

  const handleCameraChange = (info) => {
    setCameraInfo(info);
  };

  return (
    <div className="pixel-test-container">
      <header className="pixel-test-header">
        <div className="nav-links">
          <Link to="/" className="back-link">← Back to Home</Link>
          <Link to="/galaxy-test" className="galaxy-link">🌌 View Full Galaxy</Link>
        </div>
        <h1>Pixel Solar System</h1>
        <p>Test the pixel art solar system renderer with different settings</p>
      </header>

      <div className="pixel-test-content">
        {/* Controls Panel */}
        <div className="controls-panel">
          <h3>🎮 Controls</h3>
          
          <div className="control-group">
            <label>Pixel Size: {pixelSize}px</label>
            <input 
              type="range" 
              min="2" 
              max="100" 
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
              />
              <span className="checkmark"></span>
              Enable Animation
            </label>
          </div>

          <div className="control-group">
            <label>Camera Distance: {cameraDistance}</label>
            <input 
              type="range" 
              min="30" 
              max="1250" 
              value={cameraDistance}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraDistance(value);
                if (window.pixelRendererCameraControls) {
                  window.pixelRendererCameraControls.setDistance(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label>Azimuth Angle: {Math.round(cameraAzimuth)}°</label>
            <input 
              type="range" 
              min="0" 
              max="1800" 
              value={cameraAzimuth}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraAzimuth(value);
                if (window.pixelRendererCameraControls) {
                  window.pixelRendererCameraControls.setAzimuth(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label>Polar Angle: {Math.round(cameraPolar)}°</label>
            <input 
              type="range" 
              min="10" 
              max="850" 
              value={cameraPolar}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCameraPolar(value);
                if (window.pixelRendererCameraControls) {
                  window.pixelRendererCameraControls.setPolar(value);
                }
              }}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={autoRotate}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAutoRotate(checked);
                  if (window.pixelRendererCameraControls) {
                    window.pixelRendererCameraControls.setAutoRotate(checked);
                  }
                }}
              />
              <span className="checkmark"></span>
              Auto Rotate Camera
            </label>
          </div>

          <div className="control-group">
            <label>Star Count: {starCount.toLocaleString()}</label>
            <input 
              type="range" 
              min="100" 
              max="25000" 
              step="100"
              value={starCount}
              onChange={(e) => setStarCount(Number(e.target.value))}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label>Sun Brightness: {sunBrightness.toFixed(1)}</label>
            <input 
              type="range" 
              min="0.5" 
              max="25.0" 
              step="0.1"
              value={sunBrightness}
              onChange={(e) => setSunBrightness(Number(e.target.value))}
              className="pixel-slider"
            />
          </div>

          <div className="control-group">
            <label>Highlight Planet:</label>
            <select 
              value={highlightedPlanet}
              onChange={(e) => {
                const planet = e.target.value;
                setHighlightedPlanet(planet);
                if (window.pixelRendererCameraControls) {
                  window.pixelRendererCameraControls.highlightPlanet(planet);
                }
              }}
              className="planet-selector"
            >
              {planets.map(planet => (
                <option key={planet.value} value={planet.value}>
                  {planet.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Renderer Display */}
        <div className="renderer-display">
          <div className="renderer-wrapper">
            <PixelRenderer
              pixelSize={pixelSize}
              width={800}
              height={600}
              animate={animate}
              cameraControls={true}
              onCameraChange={handleCameraChange}
              starCount={starCount}
              highlightedPlanet={highlightedPlanet}
              sunBrightness={sunBrightness}
              className="test-renderer"
            />
          </div>
          
          <div className="renderer-info">
            <h4>Current Settings</h4>
            <ul>
              <li><strong>Type:</strong> 3D Solar System</li>
              <li><strong>Pixel Size:</strong> {pixelSize}px</li>
              <li><strong>Animation:</strong> {animate ? 'Enabled' : 'Disabled'}</li>
              <li><strong>Dimensions:</strong> 800×600px</li>
              <li><strong>Star Count:</strong> {starCount.toLocaleString()}</li>
              <li><strong>Sun Brightness:</strong> {sunBrightness.toFixed(1)}</li>
              <li><strong>Highlighted Planet:</strong> {highlightedPlanet === 'none' ? 'None' : highlightedPlanet.charAt(0).toUpperCase() + highlightedPlanet.slice(1)}</li>
              <li><strong>Camera Distance:</strong> {Math.round(cameraInfo.distance)}</li>
              <li><strong>Camera Azimuth:</strong> {Math.round(cameraInfo.azimuth)}°</li>
              <li><strong>Camera Polar:</strong> {Math.round(cameraInfo.polar)}°</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Gallery */}
      <div className="examples-section">
        <h3>🎯 Example Configurations</h3>
        <div className="examples-grid">
          <div className="example-item">
            <PixelRenderer
              pixelSize={8}
              width={200}
              height={200}
              animate={true}
              starCount={500}
              className="example-renderer"
            />
            <div className="example-label">
              <strong>Few Stars</strong><br/>
              500 stars (8px)
            </div>
          </div>

          <div className="example-item">
            <PixelRenderer
              pixelSize={3}
              width={200}
              height={200}
              animate={true}
              starCount={4000}
              className="example-renderer"
            />
            <div className="example-label">
              <strong>Dense Stars</strong><br/>
              4000 stars (3px)
            </div>
          </div>

          <div className="example-item">
            <PixelRenderer
              pixelSize={6}
              width={200}
              height={200}
              animate={false}
              className="example-renderer"
            />
            <div className="example-label">
              <strong>Static</strong><br/>
              No Animation (6px)
            </div>
          </div>

          <div className="example-item">
            <PixelRenderer
              pixelSize={12}
              width={200}
              height={200}
              animate={true}
              className="example-renderer"
            />
            <div className="example-label">
              <strong>Retro Style</strong><br/>
              Solar System (12px)
            </div>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="technical-info">
        <h3>🔧 Technical Details</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>3D Solar System</h4>
            <ul>
              <li>8 planets with realistic surface materials</li>
              <li>Rocky surfaces (Mercury, Mars)</li>
              <li>Gas giant atmospheres (Jupiter, Saturn, Neptune)</li>
              <li>Hybrid Earth with continents and oceans</li>
              <li>Ice giant surface (Uranus)</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>Camera Controls</h4>
            <ul>
              <li>Spherical coordinate camera system</li>
              <li>Real-time distance adjustment (30-250 units)</li>
              <li>Full 360° azimuth rotation</li>
              <li>Polar angle control (10°-170°)</li>
              <li>Optional auto-rotation mode</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>3D Rendering</h4>
            <ul>
              <li>WebGL-powered Three.js engine</li>
              <li>Hardware-accelerated GPU rendering</li>
              <li>Pixelation through render scaling</li>
              <li>Vertex color variations for stars</li>
              <li>Real-time material and lighting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PixelTest;
