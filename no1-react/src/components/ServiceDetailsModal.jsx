import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceDetailsModal = ({ service, onClose }) => {
  if (!service) return null;

  // Mock varieties - in real world, fetch these from Firestore based on category
  const varieties = [
    { name: 'Traditional Melam', price: '₹15,000', img: '/assets/drums.png' },
    { name: 'Western Fusion', price: '₹25,000', img: '/assets/hero.png' },
    { name: 'Grand Entrance Set', price: '₹10,000', img: '/assets/papershot.png' }
  ];

  const gallery = [
    { type: 'image', url: '/assets/drums.png' },
    { type: 'video', url: '/assets/hero.png', thumbnail: '/assets/hero.png' },
    { type: 'image', url: '/assets/papershot.png' },
    { type: 'image', url: '/assets/djlights.png' }
  ];

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            maxHeight: '90vh', 
            background: 'var(--glass-bg)', 
            borderRadius: '30px', 
            border: '1px solid var(--border)', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Header */}
          <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800 }}>{service.cat}</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{service.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
              
              {/* Left Column: Media & Description */}
              <div>
                <img src={service.img} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '20px', marginBottom: '2rem' }} alt={service.title} />
                <h3 style={{ marginBottom: '1rem' }}>Description</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '3rem' }}>
                  {service.desc}. This service includes high-quality equipment, professional performers, and complete setup. We ensure the best experience for your special day.
                </p>

                <h3 style={{ marginBottom: '1.5rem' }}>Photos & Videos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {gallery.map((item, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden', aspectRatio: '1', border: '1px solid var(--border)' }}>
                      <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery" />
                      {item.type === 'video' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={24} fill="#fff" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Varieties & Action */}
              <div>
                <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--accent)' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Calendar size={20} color="var(--accent)" /> Available Varieties
                  </h3>
                  <div style={{ display: 'grid', gap: '1.2rem' }}>
                    {varieties.map((v, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                        <img src={v.img} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} alt={v.name} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.name}</div>
                          <div style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>Starts from {v.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/booking" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', fontSize: '1.2rem' }}>
                  Book Now
                </Link>
                <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.4, fontSize: '0.8rem' }}>Price may vary based on location and hours.</p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ServiceDetailsModal;
