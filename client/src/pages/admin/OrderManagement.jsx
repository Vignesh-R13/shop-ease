import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings, BarChart3, Package, ShoppingBag, 
  Tag, Users, Check, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        status: newStatus
      });
      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar glass">
        <div className="sidebar-header">
           <Settings size={28} />
           <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button onClick={() => navigate('/admin')}><BarChart3 size={20} /> Dashboard</button>
          <button onClick={() => navigate('/admin/products')}><Package size={20} /> Products</button>
          <button className="active" onClick={() => navigate('/admin/orders')}><ShoppingBag size={20} /> Orders</button>
          <button onClick={() => navigate('/admin/coupons')}><Tag size={20} /> Coupons</button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Order Management</h1>
          <button className="btn btn-outline" onClick={fetchOrders} title="Refresh Order List">
            <RefreshCw size={18} /> Refresh List
          </button>
        </header>

        {loading ? (
          <div className="admin-loading"><h2>Loading Orders...</h2></div>
        ) : (
          <div className="products-table-container glass">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Shipping Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td><strong className="order-id-label">#{order._id.substring(18)}</strong></td>
                    <td>{order.user?.name || 'Unknown User'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td><strong>${order.totalPrice.toFixed(2)}</strong></td>
                    <td>
                      <span className={`status-tag ${order.isPaid ? 'active' : 'inactive'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag shipping-status ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-selector"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No orders found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderManagement;
