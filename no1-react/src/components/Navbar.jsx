import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
      transition: '0.3s', 
      background: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      padding: '1rem 0',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" onClick={handleHomeClick} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="NO1 Logo" style={{ height: '40px', width: 'auto' }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem' }}>
            NO<span style={{ color: 'var(--accent)' }}>1</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" onClick={handleHomeClick} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <button onClick={() => scrollToSection('booking')} style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'none', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '1rem' }}>Book Now</button>
          {isAdmin ? (
            <Link to="/admin" style={{ background: 'var(--accent)', color: '#000', padding: '0.5rem 1rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>Admin</Link>
          ) : (
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
