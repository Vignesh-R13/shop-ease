import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Package, ShoppingBag, DollarSign, 
  TrendingUp, BarChart3, Plus, Settings, Tag
} from 'lucide-react';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`);
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading"><h2>Loading Analytics...</h2></div>;

  const lineData = {
    labels: stats?.monthlySales.map(m => m.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats?.monthlySales.map(m => m.sales),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#64748b'
        ],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar glass">
        <div className="sidebar-header">
           <Settings size={28} />
           <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button className="active" onClick={() => navigate('/admin')}><BarChart3 size={20} /> Dashboard</button>
          <button onClick={() => navigate('/admin/products')}><Package size={20} /> Products</button>
          <button onClick={() => navigate('/admin/orders')}><ShoppingBag size={20} /> Orders</button>
          <button onClick={() => navigate('/admin/coupons')}><Tag size={20} /> Coupons</button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard Overview</h1>
          <button className="btn btn-primary" onClick={() => navigate('/admin/products')}><Plus size={18} /> Add Product</button>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-icon users"><Users /></div>
            <div className="stat-info">
              <p>Total Users</p>
              <h3>{stats?.totalUsers}</h3>
            </div>
            <span className="trend positive"><TrendingUp size={14} /> 12%</span>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon products"><Package /></div>
            <div className="stat-info">
              <p>Total Products</p>
              <h3>{stats?.totalProducts}</h3>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon orders"><ShoppingBag /></div>
            <div className="stat-info">
              <p>Total Orders</p>
              <h3>{stats?.totalOrders}</h3>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon revenue"><DollarSign /></div>
            <div className="stat-info">
              <p>Total Revenue</p>
              <h3>${stats?.totalRevenue}</h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-container glass">
            <h3>Revenue Growth</h3>
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
          </div>
          <div className="chart-container glass">
            <h3>Sales by Category</h3>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
