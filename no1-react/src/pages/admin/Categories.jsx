import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layout, Database, Loader2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newCat) return;
    
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'categories'), { name: newCat });
      setNewCat('');
      await fetchCategories();
    } catch (err) {
      alert('Error adding category: ' + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setEditFormData({ name: cat.name });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'categories', String(editingCategory.id)), editFormData);
      setIsEditModalOpen(false);
      await fetchCategories();
      alert('✅ Category updated successfully!');
    } catch (err) {
      console.error('Update Error:', err);
      alert('❌ Error updating category: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', String(id)));
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Categories</h1>
          <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Organize your event services into logical groups.</p>
        </div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="New category name..." 
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem 1.5rem', color: '#fff', outline: 'none', width: '250px' }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={isAdding}>
            {isAdding ? <Loader2 className="spin" size={18} /> : <Plus size={18} />} 
            Create
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem' }}>
             <Loader2 className="spin" size={40} style={{ opacity: 0.3 }} />
          </div>
        ) : (
          <AnimatePresence>
            {categories.map((cat, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                key={cat.id} 
                className="glass" 
                style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <Layout size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{cat.name}</h3>
                    <p style={{ opacity: 0.4, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Database size={12}/> Firebase Firestore</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={() => handleOpenEdit(cat)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.7rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.7rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem' }}>Edit Category</h2>
                <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', display: 'block' }}>Category Name</label>
                  <input 
                    type="text" 
                    value={editFormData.name} 
                    onChange={(e) => setEditFormData({ name: e.target.value })} 
                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', outline: 'none' }} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="spin" size={18} /> : <Save size={18} />} 
                  {isUpdating ? 'Saving...' : 'Save Changes'}
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

export default Categories;
