import React, { useState, useEffect } from 'react';
import { Star, Check, Trash2, Heart, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: 1 } : r));
    } catch (err) {
      alert('Error approving review');
    }
  };

  const handleFeature = async (id, isFeatured) => {
    try {
      await api.put(`/reviews/${id}/feature`, { isFeatured: !isFeatured });
      setReviews(reviews.map(r => r.id === id ? { ...r, is_featured: !isFeatured ? 1 : 0 } : r));
    } catch (err) {
      alert('Error updating featured status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      alert('Error deleting review');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Customer Feedback</h1>
        <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Review and manage customer testimonials for your services.</p>
      </div>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <Loader2 className="spin" size={40} style={{ opacity: 0.3 }} />
          </div>
        )}
        
        {!loading && reviews.length === 0 && (
          <div className="glass" style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
            <MessageSquare size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <h3>No reviews found in local storage</h3>
          </div>
        )}

        <AnimatePresence>
          {reviews.map((r, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              key={r.id} 
              className="glass" 
              style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
            >
              {r.is_approved === 1 && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(16,185,129,0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px' }}>
                  <ShieldCheck size={12} /> VERIFIED
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent)' }}>
                    {(r.customer_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{r.customer_name || 'Anonymous User'}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.4 }}>{r.service || 'General Service'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', color: 'var(--accent)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < (r.rating || 5) ? 'var(--accent)' : 'none'} opacity={i < (r.rating || 5) ? 1 : 0.2} />
                  ))}
                </div>
              </div>

              <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                "{r.comment}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 600 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Recently'}</span>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {r.is_approved !== 1 && (
                    <button onClick={() => handleApprove(r.id)} className="btn btn-soft" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <Check size={16} /> Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleFeature(r.id, !!r.is_featured)} 
                    className="btn btn-soft" 
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      fontSize: '0.85rem', 
                      color: r.is_featured ? '#f43f5e' : '#fff',
                      background: r.is_featured ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.05)',
                      border: r.is_featured ? '1px solid rgba(244,63,94,0.2)' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Heart size={16} fill={r.is_featured ? '#f43f5e' : 'none'} /> {r.is_featured ? 'Featured' : 'Feature'}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-soft" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </motion.div>
  );
};

export default Reviews;
