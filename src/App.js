import { BrowserRouter as Router } from 'react-router-dom';
import React, { useEffect } from 'react';
import AppRoutes from './components/AppRoutes';
import { GalaxyProvider } from './contexts/GalaxyContext';

function App() {
  useEffect(() => {
    // Ensure body has a default white background
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return (
    <div>
      <Router basename={process.env.NODE_ENV === 'production' ? '/Portfolio' : ''}>
        <GalaxyProvider>
          <AppRoutes />
        </GalaxyProvider>
      </Router>
    </div>
  );
}

export default App;