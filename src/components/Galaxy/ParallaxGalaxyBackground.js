import React, { useEffect, useRef } from 'react';

// Moves children vertically with parallax effect based on scroll
const ParallaxGalaxyBackground = ({ children, strength = 50, smoothness = 0.12, pixelCap = 20000 }) => {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let targetY = 0;
    let currentY = 0;
    let rafId = null;
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      let rawTarget = -scrollY * strength;
      if (isFinite(pixelCap)) {
        targetY = Math.max(-pixelCap, Math.min(pixelCap, rawTarget));
      } else {
        targetY = rawTarget;
      }
      if (!rafId) rafId = requestAnimationFrame(animateLoop);
    };
    const animateLoop = () => {
      currentY += (targetY - currentY) * smoothness;
      el.style.transform = `translate3d(0px, ${currentY}px, 0px)`;
      if (Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(animateLoop);
      } else {
        rafId = null;
      }
    };
    el.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [strength, smoothness, pixelCap]);
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxGalaxyBackground;