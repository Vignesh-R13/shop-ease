import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, CreditCard, ShoppingBag, MapPin, Edit3, Calendar, DollarSign, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
     const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar glass fade-in">
          <div className="user-info">
             <div className="avatar">
                {user.name.charAt(0)}
             </div>
             <h3>{user.name}</h3>
             <p>{user.email}</p>
          </div>

          <nav className="profile-nav">
             <button 
               className={activeTab === 'profile' ? 'active' : ''} 
               onClick={() => setActiveTab('profile')}
             >
               <User size={18} /> Profile Details
             </button>
             <button 
               className={activeTab === 'orders' ? 'active' : ''} 
               onClick={() => setActiveTab('orders')}
             >
               <ShoppingBag size={18} /> My Orders
             </button>
             <button 
               className={activeTab === 'address' ? 'active' : ''} 
               onClick={() => setActiveTab('address')}
             >
               <MapPin size={18} /> Addresses
             </button>
             <button className="logout-btn" onClick={logout}>Sign Out</button>
          </nav>
        </aside>

        <main className="profile-content glass fade-in">
           {activeTab === 'profile' && (
             <div className="tab-pane">
               <div className="pane-header">
                 <h2>Profile Information</h2>
                 <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    <Edit3 size={18} /> {isEditing ? 'Cancel' : 'Edit Profile'}
                 </button>
               </div>

               <div className="profile-details">
                  <div className="detail-item">
                     <label>Full Name</label>
                     {isEditing ? <input defaultValue={user.name} /> : <p>{user.name}</p>}
                  </div>
                  <div className="detail-item">
                     <label>Email Address</label>
                     <p>{user.email}</p>
                  </div>
                  <div className="detail-item">
                     <label>Account Role</label>
                     <p className="role-badge">{user.role}</p>
                  </div>
                  
                  {isEditing && (
                    <button className="btn btn-primary save-btn" onClick={() => {
                        toast.success('Profile updated (Demo)');
                        setIsEditing(false);
                    }}>Save Changes</button>
                  )}
               </div>
             </div>
           )}

            {activeTab === 'orders' && (
              <div className="tab-pane">
                <h2>Order History</h2>
                {loadingOrders ? (
                  <p className="loading-text">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="empty-orders">
                     <ShoppingBag size={48} />
                     <p>You haven't placed any orders yet.</p>
                     <button className="btn btn-primary" onClick={() => window.location.href='/shop'}>Shop Now</button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-item-card glass fade-in">
                        <div className="order-item-header">
                          <div className="order-meta-info">
                            <span className="order-number">Order #{order._id.substring(18)}</span>
                            <span className="order-date">
                              <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="order-status-badges">
                            <span className={`order-status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            <span className={`order-shipping-badge ${order.orderStatus.toLowerCase()}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <div className="order-item-body">
                          <div className="order-items-grid">
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="ordered-product">
                                <img src={item.image} alt={item.title} className="ordered-product-img" />
                                <div className="ordered-product-info">
                                  <span className="ordered-product-title">{item.title}</span>
                                  <span className="ordered-product-qty">Qty: {item.qty} × ${item.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="order-summary-price">
                            <span className="order-total-price">
                              Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

           {activeTab === 'address' && (
             <div className="tab-pane">
               <h2>Saved Addresses</h2>
               <p className="no-address">No addresses saved yet.</p>
               <button className="btn btn-outline">+ Add New Address</button>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
