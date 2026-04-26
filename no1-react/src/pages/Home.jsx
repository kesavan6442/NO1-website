import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import api from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [dbServices, setDbServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({
    phone1: '+91 12345 67890',
    phone2: '+91 98765 43210',
    email1: 'info@no1events.com',
    email2: 'booking@no1events.com',
    address: '123 Event Street, City Center, Chennai, Tamil Nadu - 600001',
    whatsapp: '911234567890'
  });

  useEffect(() => {
    // Fetch categories from SQL
    api.get('/categories')
      .then(res => {
        const data = res.data.map(c => ({
          id: c.id,
          title: c.name,
          tag: 'Service',
          desc: `Professional ${c.name} services for your event.`,
          img: c.cover_image || '/assets/hero.png'
        }));
        setCategories(data);
      })
      .catch(err => console.error('Error fetching categories:', err));

    // Fetch services for fallback/search
    api.get('/services')
      .then(res => setDbServices(res.data))
      .catch(err => console.error('Error fetching services:', err));

    // Fetch site settings
    api.get('/settings')
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const allCategories = categories;

  return (
    <div className="home">
      <header className="section-padding" style={{ paddingTop: '10rem' }}>
        <div className="container hero-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="reveal">
            <span className="card-tag">Experience Our Best Party</span>
            <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '2rem' }}>
              Make Your <br/><span style={{ color: 'var(--accent)' }}>Party Best!</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', marginBottom: '2.5rem', maxWidth: '500px' }}>
              We give the best music, colorful lights, and funny teddy show for your family weddings and parties.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#services" className="btn btn-primary">See Our Photos</a>
              <a href="#booking" className="btn btn-soft">Book Now</a>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--accent)', borderRadius: '20px', zIndex: -1, opacity: 0.5 }}></div>
            <img 
              src={settings.hero_image?.startsWith('http') ? settings.hero_image : `http://127.0.0.1:5000${settings.hero_image || '/assets/hero.png'}`} 
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '30px', 
                boxShadow: 'var(--shadow)', 
                border: '2px solid rgba(255,255,255,0.1)' 
              }} 
              alt="Hero" 
            />
          </motion.div>
        </div>
      </header>

      <section id="services" className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>What We Offer</h2>
            <div style={{ width: '100px', height: '4px', background: 'var(--accent)', margin: '0 auto', borderRadius: '10px' }}></div>
          </div>

          <div className="card-grid">
            {dbServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/service/${service.id}`} className="p-card">
                  <div className="glass">
                    <img src={service.image || '/assets/hero.png'} alt={service.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <span className="card-tag">{service.category}</span>
                       <span style={{ fontWeight: 800, color: 'var(--accent)' }}>₹{service.price}</span>
                    </div>
                    <h3>{service.name}</h3>
                    <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {service.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {dbServices.length === 0 && (
               <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
                 <h3>No services found in database.</h3>
                 <p>Add some services in the Admin Dashboard to see them here!</p>
               </div>
            )}
          </div>
        </div>
      </section>
      <section id="booking" className="section-padding" style={{ background: 'rgba(99,102,241,0.03)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Book <span style={{ color: 'var(--accent)' }}>Your Date</span></h2>
              <p style={{ opacity: 0.6 }}>Tell us about your event and we will get back to you with a quote.</p>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              try {
                await api.post('/bookings', data);
                alert('✅ Booking Request Sent! We will call you soon.');
                e.target.reset();
              } catch (err) {
                alert('❌ Error: ' + err.message);
              }
            }} style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <input name="customer" type="text" placeholder="Your Name" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
                <input name="mobile" type="tel" placeholder="Mobile Number" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <select name="service" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }}>
                  <option value="">Select Service</option>
                  {dbServices.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <input name="date" type="date" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
              </div>
              <textarea name="address" placeholder="Event Address" required style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', minHeight: '80px' }} />
              <textarea name="notes" placeholder="Any special requests?" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', minHeight: '60px' }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', justifyContent: 'center', fontSize: '1.1rem' }}>Send Booking Request</button>
            </form>
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get In Touch</h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent)', margin: '0 auto', borderRadius: '10px' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Phone size={28} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Call Us</h3>
              <a href={`tel:${settings.phone1}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', opacity: 0.6, fontSize: '1.1rem', marginBottom: '0.5rem', transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.6'}>{settings.phone1}</a>
              {settings.phone2 && <a href={`tel:${settings.phone2}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', opacity: 0.6, fontSize: '1.1rem', transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.6'}>{settings.phone2}</a>}
            </div>

            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(251,191,36,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent)' }}>
                <Mail size={28} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Email Us</h3>
              <a href={`mailto:${settings.email1}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', opacity: 0.6, fontSize: '1.1rem', marginBottom: '0.5rem', transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.6'}>{settings.email1}</a>
              {settings.email2 && <a href={`mailto:${settings.email2}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', opacity: 0.6, fontSize: '1.1rem', transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.6'}>{settings.email2}</a>}
            </div>

            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <MapPin size={28} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Location</h3>
              <p style={{ opacity: 0.6, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{settings.address}</p>
            </div>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
             <a href={`https://wa.me/${settings.whatsapp}`} className="btn btn-primary" style={{ gap: '0.8rem', padding: '1.2rem 3rem' }}>
               <MessageSquare size={20} />
               Chat with us on WhatsApp
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
