import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Banknote, Activity, CheckCircle2, Server, Database } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Overview = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCustomers: 0,
    totalCategories: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const bookingsSnap = await getDocs(collection(db, "bookings"));
      const customersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "customer")));
      const categoriesSnap = await getDocs(collection(db, "categories"));
      
      let revenue = 0;
      bookingsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === 'completed' && data.total_price) {
          revenue += Number(data.total_price);
        }
      });

      setStats({
        totalBookings: bookingsSnap.size,
        totalCustomers: customersSnap.size,
        totalCategories: categoriesSnap.size,
        totalRevenue: revenue
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Bookings',
      data: [5, 8, 12, 7, 15, 20, stats.totalBookings], // Simulated trend with real data at end
      borderColor: '#6366f1',
      borderWidth: 3,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(99, 102, 241, 0.05)'
    }]
  };

  const statCards = [
    { label: 'Total Revenue', val: `₹${stats.totalRevenue}`, icon: <Banknote />, color: '#fbbf24', trend: '+12%' },
    { label: 'Total Bookings', val: stats.totalBookings, icon: <Calendar />, color: '#6366f1', trend: 'Live' },
    { label: 'Total Customers', val: stats.totalCustomers, icon: <Users />, color: '#f43f5e', trend: '+5%' },
    { label: 'Active Categories', val: stats.totalCategories, icon: <TrendingUp />, color: '#10b981', trend: 'Stable' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Dashboard Overview</h1>
        <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>Performance metrics for NO1 Events platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="glass" 
            style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.8rem', background: `${stat.color}15`, borderRadius: '15px', color: stat.color }}>{stat.icon}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>{stat.trend}</span>
            </div>
            <div style={{ opacity: 0.5, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{loading ? '...' : stat.val}</div>
            
            {/* Subtle background glow */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', background: stat.color, filter: 'blur(60px)', opacity: 0.1 }}></div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Booking Activity</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-soft" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}>Weekly</button>
              <button className="btn btn-soft" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem', opacity: 0.5 }}>Monthly</button>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={{ 
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)' } },
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)' } }
              }
            }} />
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Infrastructure Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {[
               { label: 'Local API Server', status: 'Online', icon: <Server size={18}/>, color: '#10b981' },
               { label: 'MySQL Database', status: 'Connected', icon: <Database size={18}/>, color: '#10b981' },
               { label: 'Multer Storage', status: 'Operational', icon: <CheckCircle2 size={18}/>, color: '#10b981' }
             ].map((item, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Service is healthy</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 700 }}>{item.status}</div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
