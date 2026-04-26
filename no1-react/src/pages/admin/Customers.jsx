import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldOff, MoreVertical, Search, Users as UsersIcon, Mail, Calendar, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      await updateDoc(doc(db, 'users', String(id)), { is_blocked: !isBlocked ? 1 : 0 });
      setCustomers(customers.map(c => c.id === id ? { ...c, is_blocked: !isBlocked ? 1 : 0 } : c));
    } catch (err) {
      alert('Error updating user status: ' + err.message);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Customers</h1>
          <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Manage registered users and monitor their event activity.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
          <input 
            type="text" 
            placeholder="Search customers..." 
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ opacity: 0.4, fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '1.5rem 2.5rem' }}>Customer Details</th>
                  <th style={{ padding: '1.5rem' }}>Contact</th>
                  <th style={{ padding: '1.5rem' }}>Activity</th>
                  <th style={{ padding: '1.5rem' }}>Status</th>
                  <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCustomers.map((c, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      key={c.id} 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
                    >
                      <td style={{ padding: '1.5rem 2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent)' }}>
                             {(c.name?.[0] || 'U').toUpperCase()}
                           </div>
                           <div style={{ fontWeight: 700, fontSize: '1rem' }}>{c.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Mail size={14} /> {c.email}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                           <Calendar size={14} style={{ opacity: 0.4 }} />
                           <span>{c.bookings_count || 0} Events</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{ 
                          padding: '0.4rem 1rem', 
                          borderRadius: '50px', 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          background: !c.is_blocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: !c.is_blocked ? '#10b981' : '#ef4444',
                          border: !c.is_blocked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                          {!c.is_blocked ? 'ACTIVE' : 'BLOCKED'}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => toggleBlock(c.id, !!c.is_blocked)} title={!c.is_blocked ? 'Block User' : 'Unblock User'} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}>
                            {!c.is_blocked ? <Shield size={18} /> : <ShieldOff size={18} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {!loading && filteredCustomers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>
                <UsersIcon size={64} style={{ marginBottom: '1rem' }} />
                <h3>No customers found matching your search</h3>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </motion.div>
  );
};

export default Customers;
