import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, X, Upload, Settings, 
  BarChart3, Package, ShoppingBag, Tag 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminProductManagement.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData);
        toast.success('Product updated!');
      } else {
        await axios.post('http://localhost:5000/api/products', { ...formData, images: ["https://via.placeholder.com/300"] });
        toast.success('Product created!');
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Error deleting product');
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      stock: product.stock,
      images: product.images
    });
    setShowModal(true);
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
          <button className="active" onClick={() => navigate('/admin/products')}><Package size={20} /> Products</button>
          <button onClick={() => navigate('/admin/orders')}><ShoppingBag size={20} /> Orders</button>
          <button onClick={() => navigate('/admin/coupons')}><Tag size={20} /> Coupons</button>
        </nav>
      </div>

      <main className="admin-main animate-fade-in">
        <div className="admin-products-page container">
          <div className="page-header">
        <h1>Product Management</h1>
        <button className="btn btn-primary" onClick={() => {
            setEditingProduct(null);
            setFormData({ title: '', description: '', price: '', discountPrice: '', category: '', stock: '', images: [] });
            setShowModal(true);
        }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="products-table-container glass">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.images[0]} alt={product.title} className="table-img" /></td>
                <td><strong>{product.title}</strong></td>
                <td><span className="table-category">{product.category}</span></td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td className="table-actions">
                  <button onClick={() => openEditModal(product)}><Edit size={18} /></button>
                  <button onClick={() => deleteProduct(product._id)} className="delete-btn"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass fade-in">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                 <div className="form-group">
                   <label>Product Title</label>
                   <input name="title" value={formData.title} onChange={handleInputChange} required />
                 </div>
                 <div className="form-group">
                   <label>Category</label>
                   <input name="category" value={formData.category} onChange={handleInputChange} required />
                 </div>
                 <div className="form-group">
                   <label>Price</label>
                   <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                 </div>
                 <div className="form-group">
                   <label>Discount Price</label>
                   <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} />
                 </div>
                 <div className="form-group">
                   <label>Stock Quantity</label>
                   <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                 </div>
                 <div className="form-group full">
                   <label>Description</label>
                   <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                 </div>
              </div>
              <button type="submit" className="btn btn-primary submit-btn">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
          </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default AdminProductManagement;
