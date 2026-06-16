import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';

import ProtectedRoute from './components/common/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CouponManagement from './pages/admin/CouponManagement';
import OrderManagement from './pages/admin/OrderManagement';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/about" element={<About />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/coupons" element={<CouponManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Route>

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;