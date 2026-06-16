import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, X, Settings, BarChart3, 
  Package, ShoppingBag, Tag, Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CouponManagement.css';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    isActive: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/coupons`);
      setCoupons(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/coupons`, formData);
      if (res.data.success) {
        toast.success('Coupon created successfully!');
        setShowModal(false);
        setFormData({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          expiryDate: '',
          isActive: true
        });
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/coupons/${id}`);
        if (res.data.success) {
          toast.success('Coupon deleted');
          fetchCoupons();
        }
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
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
          <button onClick={() => navigate('/admin/orders')}><ShoppingBag size={20} /> Orders</button>
          <button className="active" onClick={() => navigate('/admin/coupons')}><Tag size={20} /> Coupons</button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Coupon Management</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New Coupon
          </button>
        </header>

        {loading ? (
          <div className="admin-loading"><h2>Loading Coupons...</h2></div>
        ) : (
          <div className="products-table-container glass">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td><strong>{coupon.code}</strong></td>
                    <td><span className="table-category">{coupon.discountType}</span></td>
                    <td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                    <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-tag ${coupon.isActive ? 'active' : 'inactive'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button onClick={() => handleDelete(coupon._id)} className="delete-btn">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No coupons found. Click "Add New Coupon" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass fade-in">
            <div className="modal-header">
              <h2>Add New Coupon</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code</label>
                  <input 
                    name="code" 
                    value={formData.code} 
                    onChange={handleInputChange} 
                    placeholder="e.g. SAVE15" 
                    required 
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleInputChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input 
                    type="number" 
                    name="discountValue" 
                    value={formData.discountValue} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 15" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={formData.expiryDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange} 
                    /> Active Status
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary submit-btn">
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
