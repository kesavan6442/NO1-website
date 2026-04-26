import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Download, TrendingUp, Users, Calendar, IndianRupee } from 'lucide-react';
import api from '../../api';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCustomers: 0,
    totalCategories: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Bookings',
      data: [12, 19, 15, 25, 22, stats.totalBookings], // Mixed with real data
      borderColor: '#6366f1',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(99, 102, 241, 0.1)'
    }]
  };

  const barData = {
    labels: ['Drums', 'Paper Shot', 'Lights', 'Dhol', 'Other'],
    datasets: [{
      label: 'Revenue Distribution',
      data: [stats.totalRevenue * 0.4, stats.totalRevenue * 0.2, stats.totalRevenue * 0.2, stats.totalRevenue * 0.1, stats.totalRevenue * 0.1],
      backgroundColor: 'rgba(251, 191, 36, 0.8)',
      borderRadius: 10
    }]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Reports & Analytics</h1>
        <button className="btn btn-soft"><Download size={18} /> Export PDF</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <IndianRupee size={20}/>, color: '#10b981' },
          { label: 'Bookings', value: stats.totalBookings, icon: <Calendar size={20}/>, color: '#6366f1' },
          { label: 'Customers', value: stats.totalCustomers, icon: <Users size={20}/>, color: '#fbbf24' },
          { label: 'Active Services', value: stats.totalCategories, icon: <TrendingUp size={20}/>, color: '#f43f5e' },
        ].map((item, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{item.label}</span>
              <div style={{ color: item.color }}>{item.icon}</div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <h3>Booking Growth</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <h3>Revenue by Category</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
