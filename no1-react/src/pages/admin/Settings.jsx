import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Phone, Mail, MapPin, MessageSquare, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    address: '',
    whatsapp: '',
    hero_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'main'));
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileRef = ref(storage, `settings/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setSettings({ ...settings, hero_image: url });
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
      alert('✅ Settings updated successfully! Changes will reflect on the homepage.');
    } catch (err) {
      alert('❌ Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="spin" size={40} opacity={0.3} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Site Settings</h1>
        <p style={{ opacity: 0.5 }}>Manage your contact information and platform details.</p>
      </div>

      <div className="glass" style={{ padding: '3rem', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><Globe size={16} /> Site Name</label>
              <input type="text" value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><MessageSquare size={16} /> WhatsApp Number</label>
              <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} placeholder="e.g. 911234567890" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><Phone size={16} /> Contact Phone 1</label>
              <input type="text" value={settings.phone1} onChange={e => setSettings({...settings, phone1: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><Phone size={16} /> Contact Phone 2 (Optional)</label>
              <input type="text" value={settings.phone2} onChange={e => setSettings({...settings, phone2: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><Mail size={16} /> Primary Email</label>
              <input type="email" value={settings.email1} onChange={e => setSettings({...settings, email1: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} required />
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><Mail size={16} /> Booking Email (Optional)</label>
              <input type="email" value={settings.email2} onChange={e => setSettings({...settings, email2: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><ImageIcon size={16} /> Hero Section Image</label>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <img src={settings.hero_image || '/assets/hero.png'} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = '/assets/hero.png'} />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  id="hero-upload" 
                  hidden 
                  accept="image/*"
                  onChange={handleHeroUpload}
                />
                <label htmlFor="hero-upload" className="btn btn-soft" style={{ gap: '0.8rem', cursor: 'pointer' }}>
                  {uploading ? <Loader2 className="spin" size={18} /> : <Upload size={18} />} 
                  {uploading ? 'Uploading...' : 'Change Hero Image'}
                </label>
                <p style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '1rem' }}>Recommended size: 1920x1080px. High quality images work best.</p>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', opacity: 0.6 }}><MapPin size={16} /> Business Address</label>
            <textarea value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', minHeight: '100px' }} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', justifyContent: 'center', fontSize: '1.1rem' }} disabled={saving}>
            {saving ? <><Loader2 className="spin" size={18} /> Saving...</> : <><Save size={18} /> Update Site Details</>}
          </button>
        </form>
      </div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </motion.div>
  );
};

export default Settings;
