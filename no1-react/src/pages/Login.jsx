import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', user.email === 'kesavan.mcse@gmail.com' ? 'true' : 'false');
      
      navigate(user.email === 'kesavan.mcse@gmail.com' ? '/admin' : '/');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
        style={{ maxWidth: '480px' }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="glass" style={{ padding: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin <span style={{ color: 'var(--accent)' }}>Login</span></h1>
            <p style={{ opacity: 0.5 }}>Sign in to manage your website content.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={18} />
                <input 
                  type="email" 
                  placeholder="admin@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '14px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '1rem 3.5rem 1rem 3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '14px', color: '#fff', outline: 'none' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', opacity: 0.3, cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }}>
              {loading ? 'Signing in...' : 'Sign In Now'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.5, fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
