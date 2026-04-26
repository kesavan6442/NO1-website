import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Clock, MapPin, ZoomIn, X, Film, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        let found = null;
        
        // Fetch all services and search by ID or slug
        const snapshot = await getDocs(collection(db, 'services'));
        const allServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        found = allServices.find(s => String(s.id) === id || (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === id));
        
        if (found) {
          // Firebase stores media inside the document under `media`
          let gallery = [{ url: found.image || '/assets/hero.png', type: 'image' }];
          if (found.media && Array.isArray(found.media)) {
            gallery = [...gallery, ...found.media];
          }

          setService({
            title: found.name,
            cat: found.category,
            desc: found.description,
            img: found.image || '/assets/hero.png',
            gallery: gallery
          });
        }
      } catch (err) { 
        console.error('Error fetching service:', err); 
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <div className="loader" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
      <p style={{ opacity: 0.6 }}>Loading service details...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!service) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <h2 style={{ marginBottom: '2rem' }}>Service Not Found</h2>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem' : '4rem' }}
            onClick={() => setSelectedItem(null)}
          >
            <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={30} /></button>
            {selectedItem.type === 'video' ? (
              <video src={selectedItem.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '20px' }} onClick={e => e.stopPropagation()} />
            ) : (
              <img src={selectedItem.url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '20px' }} onClick={e => e.stopPropagation()} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section style={{ position: 'relative', height: isMobile ? '60vh' : '70vh', overflow: 'hidden' }}>
        <img src={service.img} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} alt={service.title} onClick={() => setSelectedItem({url: service.img, type: 'image'})} onError={(e) => e.target.src = '/assets/hero.png'} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, var(--bg-dark))' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: isMobile ? '2rem' : '4rem', left: '50%', transform: 'translateX(-50%)', width: '90%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 700 }}><ChevronLeft size={20} /> Back to Services</Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="card-tag" style={{ background: 'var(--accent)', color: '#000', marginBottom: '1rem' }}>{service.cat}</span>
            <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', marginTop: '1rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>{service.title}</h1>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.8rem' : '2rem', opacity: 0.8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={18} color="var(--accent)" /> 4.9 (120+ Reviews)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Available 24/7</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> All Over Tamil Nadu</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1fr', gap: '4rem' }}>
          <div>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '1.5rem' }}>Service Overview</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: '3rem', lineHeight: 1.8 }}>{service.desc}</p>
            
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '2rem' }}>Visual Gallery</h2>
            {service.gallery && service.gallery.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {service.gallery.map((item, i) => (
                  <motion.div 
                    key={i} whileHover={{ scale: 1.05 }} 
                    style={{ height: '180px', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery" onError={(e) => { e.target.src = '/assets/hero.png' }} />
                    )}
                    <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }}>
                      <ZoomIn size={30} color="#fff" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : <p style={{ opacity: 0.5 }}>No additional photos yet.</p>}
          </div>

          <aside>
            <div className="glass" style={{ padding: isMobile ? '2rem' : '3rem', position: isMobile ? 'static' : 'sticky', top: '120px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ready to Book?</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2.5rem' }}>Contact us to get a custom quote based on your event requirements.</p>
              <Link to="/booking" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem' }}>Book This Service</Link>
              
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '1rem' }}>Need immediate help?</p>
                <a href="https://wa.me/911234567890" target="_blank" rel="noreferrer" className="btn btn-soft" style={{ width: '100%', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#25D366" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <style>{` .img-overlay:hover { opacity: 1 !important; } `}</style>
    </div>
  );
};

export default ServiceDetail;
