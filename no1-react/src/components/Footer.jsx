import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const [settings, setSettings] = useState({
    site_name: 'Number One Events',
    phone1: '+91 12345 67890',
    email1: 'info@no1events.com',
    address: '123 Event Street, City, Tamil Nadu',
    whatsapp: '911234567890'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching settings for footer:', err);
      }
    };
    fetchSettings();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer style={{ background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid var(--border)', paddingTop: '5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '35px' }} />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem' }}>
                NO<span style={{ color: 'var(--accent)' }}>1</span>
              </span>
            </Link>
            <p style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '2rem' }}>
              Premium event management and technical production services for family parties, weddings, and grand occasions.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Quick Links</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Home</Link>
              <button onClick={() => scrollToSection('services')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Our Services</button>
              <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Contact Us</button>
              <Link to="/booking" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Book Now</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Contact Info</h4>
            <div style={{ display: 'grid', gap: '1.2rem' }}>
              <a 
                href={`tel:${settings.phone1}`} 
                onClick={() => scrollToSection('contact')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-dim)', textDecoration: 'none' }}
              >
                📞 {settings.phone1}
              </a>
              <a 
                href={`mailto:${settings.email1}`} 
                onClick={() => scrollToSection('contact')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-dim)', textDecoration: 'none' }}
              >
                📧 {settings.email1}
              </a>
              <div 
                onClick={() => scrollToSection('contact')}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                🏢 {settings.address}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', opacity: 0.4, fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} {settings.site_name}. All Rights Reserved.
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/${settings.whatsapp}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#25D366', color: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(37,211,102,0.4)', zIndex: 2000, textDecoration: 'none' }}
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </footer>
  );
};

export default Footer;
