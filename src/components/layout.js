// src/components/Layout.js
import Header from './header';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <Header />
      <main style={{ flex: 1, overflowX: 'hidden' }}>
        <Outlet /> {/* Render current page here */}
      </main>
      <Footer/>
    </div>
  );
}

export default Layout;