import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/signup', { name, email, password });
      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '4rem', width: '100%', maxWidth: '480px' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Create <span style={{ color: '#fff' }}>Account</span></h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.6, fontSize: '1.1rem' }}>Join NO1 for premium event services</p>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '100%', color: '#fff' }} 
              required 
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '100%', color: '#fff' }} 
              required 
            />
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '100%', color: '#fff' }} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.6 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
