import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Category = () => {
  const { type } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        const allServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = allServices.filter(s => 
          s.category?.toLowerCase() === type?.toLowerCase() || 
          s.category?.toLowerCase().includes(type?.toLowerCase())
        );
        setServices(filtered);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [type]);

  return (
    <div style={{ paddingTop: '100px', color: '#fff', textAlign: 'center' }}>
      <h1>Category: {type}</h1>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '2rem' }}>
          {services.map(s => (
            <div key={s.id} style={{ border: '1px solid #333', padding: '1rem', borderRadius: '10px' }}>
              <img src={s.image || '/assets/hero.png'} alt={s.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/hero.png' }} />
              <h3>{s.name}</h3>
              <p>{s.description}</p>
            </div>
          ))}
          {services.length === 0 && <p>No services found in this category.</p>}
        </div>
      )}
      <Link to="/" style={{ color: 'var(--accent)' }}>Back to Home</Link>
    </div>
  );
};

export default Category;
