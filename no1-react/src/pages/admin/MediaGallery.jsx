import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, Play, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'media'));
      setMedia(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteDoc(doc(db, 'media', String(id)));
      setMedia(media.filter(item => item.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setLoading(true);
    try {
      for (const file of Array.from(files)) {
        const fileRef = ref(storage, `media/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        
        await addDoc(collection(db, 'media'), {
          url: url,
          type: type
        });
      }
      fetchMedia();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Media Gallery</h1>
          <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Manage images and videos for your service offerings.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="file" 
            multiple 
            onChange={handleUpload} 
            style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} 
          />
          <button className="btn btn-primary"><Upload size={18} /> Upload Media</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <Loader2 className="spin" size={40} style={{ opacity: 0.3 }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {media.length === 0 && (
             <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', opacity: 0.2 }}>
                <ImageIcon size={64} style={{ marginBottom: '1rem' }} />
                <h3>No media found</h3>
             </div>
          )}
          {media.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.05 }}
              key={item.id} 
              className="glass" 
              style={{ padding: '0', overflow: 'hidden', position: 'relative', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {item.type === 'video' ? (
                <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Film size={48} opacity={0.3} />
                </div>
              ) : (
                <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Media" onError={(e) => e.target.src = '/assets/hero.png'} />
              )}
              
              <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', opacity: 0, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <a href={item.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none' }}>
                  {item.type === 'video' ? <Play size={20} fill="#fff" /> : <Eye size={20} />}
                </a>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>{item.type}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Service ID: {item.service_id || 'N/A'}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <style>{`
        .glass:hover .gallery-overlay { opacity: 1 !important; }
        .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default MediaGallery;
