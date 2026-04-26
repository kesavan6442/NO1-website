import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, HardDrive, Wifi, WifiOff, Loader2, Search, Layers, Film, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverStatus, setServerStatus] = useState('online');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: '', 
    image: '', 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'services'));
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Fetch Services Failed:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0].name }));
      }
    } catch (err) {
      console.error('Fetch Categories Failed:', err);
    }
  };

  const handleOpenModal = async (service = null) => {
    setNewGalleryFiles([]);
    setGalleryMedia([]);

    if (service) {
      setEditingService(service);
      setFormData({ 
        name: service.name || '', 
        price: service.price || '', 
        description: service.description || '', 
        category: service.category || (categories.length > 0 ? categories[0].name : ''), 
        image: service.image || '' 
      });
      
      // Load gallery media from service document
      try {
        setGalleryMedia(service.media || []);
      } catch (err) {
        console.error('Error loading service media:', err);
      }
    } else {
      setEditingService(null);
      setFormData({ 
        name: '', 
        price: '', 
        description: '', 
        category: categories.length > 0 ? categories[0].name : '', 
        image: '' 
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = formData.image;

      // Upload Cover Image if selected
      if (selectedFile) {
        const coverRef = ref(storage, `services/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(coverRef, selectedFile);
        imageUrl = await getDownloadURL(coverRef);
      }

      // Handle Gallery Uploads
      let newMedia = [...galleryMedia];
      if (newGalleryFiles.length > 0) {
        for (const file of newGalleryFiles) {
          const fileRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          newMedia.push({ id: Date.now().toString() + Math.random().toString(), url, type: file.type.startsWith('video') ? 'video' : 'image' });
        }
      }

      const finalData = { ...formData, image: imageUrl, media: newMedia };

      if (editingService) {
        await updateDoc(doc(db, 'services', String(editingService.id)), finalData);
      } else {
        await addDoc(collection(db, 'services'), finalData);
      }
      
      await fetchServices();
      setIsModalOpen(false);
      alert("✅ Service and Gallery saved successfully!");
    } catch (err) {
      console.error('Submit failed:', err);
      alert('❌ Save Failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', String(id)));
      fetchServices();
    } catch (err) {
      alert('Error deleting service: ' + err.message);
    }
  };

  const filteredServices = services.filter(s => 
    (s.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (s.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Services</h1>
          <p style={{ opacity: 0.4, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Database size={12}/> Firebase Firestore</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', width: '250px' }}
            />
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary"><Plus size={18} /> Add Service</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredServices.map((s) => (
          <motion.div layout key={s.id} className="glass" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <img 
                src={s.image || '/assets/hero.png'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt={s.name}
                onError={(e) => e.target.src = '/assets/hero.png'}
              />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleOpenModal(s)} style={{ padding: '0.6rem', borderRadius: '12px', border: 'none', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: '#fff', cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={() => deleteService(s.id)} style={{ padding: '0.6rem', borderRadius: '12px', border: 'none', background: 'rgba(239,68,68,0.2)', backdropFilter: 'blur(10px)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--accent)', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>{s.category}</div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.name}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>₹{s.price}</div>
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8rem' }}>{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>
          <ImageIcon size={64} style={{ marginBottom: '1rem' }} />
          <h3>No services found</h3>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Service Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Price (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }}>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      {categories.length === 0 && <option value="">No categories available</option>}
                    </select>
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Cover Image</label>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                       <ImageIcon size={20} opacity={0.5} />
                       <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{selectedFile ? selectedFile.name : 'Choose file...'}</span>
                       <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem', display: 'block' }}>Visual Gallery (Multiple Images & Video)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                    {/* Existing Media */}
                    {galleryMedia.map(m => (
                      <div key={m.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {m.type === 'video' ? <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Film size={20} /></div> : <img src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        <button type="button" onClick={async () => {
                          if (window.confirm('Delete this media?')) {
                            const updatedMedia = galleryMedia.filter(item => item.id !== m.id);
                            if (editingService) {
                              await updateDoc(doc(db, 'services', String(editingService.id)), { media: updatedMedia });
                            }
                            setGalleryMedia(updatedMedia);
                          }
                        }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={12} /></button>
                      </div>
                    ))}
                    {/* New Uploads Previews */}
                    {newGalleryFiles.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--accent)', opacity: 0.7 }}>
                        {file.type.startsWith('video') ? <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Film size={20} /></div> : <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        <button type="button" onClick={() => setNewGalleryFiles(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={12} /></button>
                      </div>
                    ))}
                    {/* Upload Trigger */}
                    <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={20} opacity={0.3} />
                      <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>Add</span>
                      <input type="file" multiple onChange={(e) => setNewGalleryFiles(prev => [...prev, ...Array.from(e.target.files)])} style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', minHeight: '100px' }} required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }} disabled={isUploading}>
                  {isUploading ? <><Loader2 className="spin" size={18} /> Processing...</> : <><Save size={18} /> {editingService ? 'Update Service' : 'Create Service'}</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </motion.div>
  );
};

export default Services;
