import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const Booking = () => {
  const [formData, setFormData] = useState({
    customer: '',
    mobile: '',
    service: '',
    date: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, service: res.data[0].name }));
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', formData);
      setSuccess(true);
    } catch (err) {
      alert('Error saving booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="section-padding" style={{ paddingTop: '150px' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ fontSize: '5rem', color: '#25D366', marginBottom: '1.5rem' }}
            >
              ✔
            </motion.div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '2.5rem' }}>Success!</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              We received your booking. We will talk to you soon on phone.
            </p>
            <Link to="/" className="btn btn-soft">Back to Home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding" style={{ paddingTop: '150px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '3rem' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)', fontSize: '2.5rem' }}>
            Book <span style={{ color: 'var(--text-main)' }}>My Date</span>
          </h1>
          
          <form onSubmit={handleSubmit} id="bookingForm">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>My Name</label>
              <input 
                type="text" 
                placeholder="Write your full name" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={formData.customer}
                onChange={(e) => setFormData({...formData, customer: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Mobile Number</label>
              <input 
                type="tel" 
                placeholder="Write your phone number" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Service</label>
              <select 
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              >
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="Inquiry">General Inquiry</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Date of event</label>
              <input 
                type="date" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Event Address</label>
              <textarea 
                placeholder="Write the full address where the event will happen" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', minHeight: '80px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Additional Notes</label>
              <textarea 
                placeholder="Anything else we should know? (Optional)" 
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', minHeight: '60px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1.2rem', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send Booking Request'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>Need help? Talk to us:</p>
            <a href="https://wa.me/911234567890" style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none', fontSize: '1.2rem' }}>WhatsApp: 911234567890</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
