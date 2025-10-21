import React, { createContext, useContext, useState } from 'react';

const GalaxyContext = createContext();

export const useGalaxyContext = () => {
  const context = useContext(GalaxyContext);
  if (!context) {
    throw new Error('useGalaxyContext must be used within a GalaxyProvider');
  }
  return context;
};

export const GalaxyProvider = ({ children }) => {
  // Available galaxy types from the factory
  const galaxyTypes = [
    'spiral', 'milky_way', 'whirlpool',
    'elliptical', 'elliptical_giant',
    'ring', 'ring_galaxy',
    'lenticular',
    'irregular', 'irregular_lmc', 'irregular_starburst',
    'dual', 'dual_spirals', 'dual_ellipticals',
    'peculiar', 'peculiar_antennae',
    'cluster', 'globular_cluster',
    'black_hole', 'black_hole_spiral', 'black_hole_elliptical'
  ];

  // Starfield types for background
  const starfieldTypes = [
    'star_field', 'star_field_dense', 'star_field_sparse'
  ];

  // Random galaxy selection - now changeable
  const [selectedGalaxies, setSelectedGalaxies] = useState(() => {
    return {
      starfield: starfieldTypes[Math.floor(Math.random() * starfieldTypes.length)],
      main: galaxyTypes[Math.floor(Math.random() * galaxyTypes.length)]
    };
  });

  // Function to generate new random galaxies
  const generateNewGalaxies = () => {
    setSelectedGalaxies({
      starfield: starfieldTypes[Math.floor(Math.random() * starfieldTypes.length)],
      main: galaxyTypes[Math.floor(Math.random() * galaxyTypes.length)]
    });
  };

  const value = {
    selectedGalaxies,
    generateNewGalaxies,
    galaxyTypes,
    starfieldTypes
  };

  return (
    <GalaxyContext.Provider value={value}>
      {children}
    </GalaxyContext.Provider>
  );
};