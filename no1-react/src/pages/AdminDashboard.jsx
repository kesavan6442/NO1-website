import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  WandSparkles, 
  CalendarCheck, 
  Users, 
  Star, 
  LogOut,
  Menu,
  X,
  Home as HomeIcon,
  User,
  TrendingUp,
  Image as ImageIcon,
  Settings as SettingsIcon
} from 'lucide-react';

// Components
import Overview from './admin/Overview';
import Bookings from './admin/Bookings';
import Services from './admin/Services';
import Categories from './admin/Categories';
import Customers from './admin/Customers';
import Reviews from './admin/Reviews';
import Analytics from './admin/Analytics';
import MediaGallery from './admin/MediaGallery';
import Settings from './admin/Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth <= 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <TrendingUp size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <WandSparkles size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Media', path: '/admin/media', icon: <ImageIcon size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon size={20} /> },
    { name: 'View Website', path: '/', icon: <HomeIcon size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="admin-container" style={{ display: 'flex', background: '#0b0f1a', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'rgba(15, 23, 42, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        height: '100vh',
        position: 'fixed',
        left: isSidebarOpen ? '0' : '-280px',
        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        <div style={{ padding: '2.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="glass" style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>n1</div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Admin<span style={{ color: 'var(--accent)' }}>Pro</span></span>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}><X size={24} /></button>}
        </div>

        <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.8rem 1.5rem', 
                color: location.pathname === item.path ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                borderRadius: '12px',
                marginBottom: '0.5rem',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: '0.3s'
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '2rem 1rem' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, marginLeft: isMobile ? '0' : (isSidebarOpen ? '280px' : '0'), transition: '0.3s' }}>
        <header style={{ 
          height: '70px', 
          background: 'rgba(15, 23, 42, 0.4)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 1.5rem' : '0 3rem',
          position: 'sticky',
          top: 0,
          zIndex: 900
        }}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <Menu size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{localStorage.getItem('userName') || 'Admin'}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Super Admin</div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent)' }}>
              <User size={20} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </header>

        <main style={{ padding: isMobile ? '1.5rem' : '3rem' }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/media" element={<MediaGallery />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
