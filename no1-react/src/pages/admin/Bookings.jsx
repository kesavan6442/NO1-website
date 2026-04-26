import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Check, X, Clock, User, MessageSquare, Loader2, Search } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'bookings', String(id)), { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => 
    (b.customer?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (b.service?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(251,191,36,0.1)', color: 'var(--accent)', border: 'rgba(251,191,36,0.2)' };
      case 'confirmed': return { bg: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: 'rgba(99,102,241,0.2)' };
      case 'completed': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' };
      case 'cancelled': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#fff', border: 'rgba(255,255,255,0.1)' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Bookings</h1>
          <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Review and manage upcoming event requests.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '1rem 1.5rem 1rem 3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', color: '#fff', width: '300px', outline: 'none' }}
          />
        </div>
      </div>

      <div className="glass" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
             <Loader2 className="spin" size={40} style={{ opacity: 0.3 }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ opacity: 0.4, fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '1.5rem 2.5rem' }}>Customer & Service</th>
                  <th style={{ padding: '1.5rem' }}>Event Date</th>
                  <th style={{ padding: '1.5rem' }}>Contact Info</th>
                  <th style={{ padding: '1.5rem' }}>Status</th>
                  <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredBookings.map((b, i) => {
                    const style = getStatusStyle(b.status);
                    return (
                      <motion.tr 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        key={b.id} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
                      >
                        <td style={{ padding: '1.5rem 2.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent)' }}>
                               <User size={20} />
                             </div>
                             <div>
                               <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{b.customer}</div>
                               <div style={{ fontSize: '0.8rem', opacity: 0.4, color: 'var(--accent)' }}>{b.service}</div>
                             </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 600 }}>
                            <Calendar size={16} style={{ opacity: 0.4 }} />
                            {new Date(b.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ fontSize: '0.9rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} /> {b.mobile}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ 
                            padding: '0.4rem 1rem', 
                            borderRadius: '50px', 
                            fontSize: '0.7rem', 
                            fontWeight: 800,
                            background: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`
                          }}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                            {b.status === 'pending' && (
                              <button onClick={() => updateStatus(b.id, 'confirmed')} title="Approve" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}>
                                <Check size={18} />
                              </button>
                            )}
                            {b.status === 'confirmed' && (
                              <button onClick={() => updateStatus(b.id, 'completed')} title="Complete" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#fff', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}>
                                <Check size={18} />
                              </button>
                            )}
                            {b.status !== 'cancelled' && b.status !== 'completed' && (
                              <button onClick={() => updateStatus(b.id, 'cancelled')} title="Cancel" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}>
                                <X size={18} />
                              </button>
                            )}
                             <button 
                               onClick={() => setSelectedBooking(b)}
                               title="View Details" 
                               style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}
                             >
                               <MessageSquare size={18} />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            {!loading && filteredBookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>
                <Calendar size={64} style={{ marginBottom: '1rem' }} />
                <h3>No bookings found</h3>
              </div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedBooking && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="glass" style={{ width: '100%', maxWidth: '500px', padding: '3rem', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem' }}>Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>Customer</label>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedBooking.customer}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>Service & Mobile</label>
                  <div>{selectedBooking.service} | {selectedBooking.mobile}</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>Event Address</label>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedBooking.address || 'No address provided'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>Notes</label>
                  <div style={{ opacity: 0.8 }}>{selectedBooking.notes || 'No extra notes'}</div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>Close Details</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </motion.div>
  );
};

export default Bookings;
