import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';

// Import public pages
import { Home, NotFound } from '../pages/public';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main routes with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
      
      {/* Catch-all 404 route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
