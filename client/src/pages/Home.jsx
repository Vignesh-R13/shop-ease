import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, Repeat, ArrowRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products?limit=4');
        setFeaturedProducts(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1>Elevate Your Style With <span>ShopEase</span></h1>
            <p>Discover the latest trends in fashion, electronics, and home decor. Quality products at unbeatable prices.</p>
            <div className="hero-btns">
              <Link to="/shop" className="btn btn-primary">Shop Now <ArrowRight size={18} /></Link>
              <Link to="/about" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
          <div className="hero-image fade-in">
             {/* Using a placeholder for now, but in a real scenario would be a high-end product photo */}
             <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" alt="Hero" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="feature-card">
          <Truck className="feature-icon" />
          <div>
            <h4>Free Shipping</h4>
            <p>On orders over $100</p>
          </div>
        </div>
        <div className="feature-card">
          <ShieldCheck className="feature-icon" />
          <div>
            <h4>Secure Payment</h4>
            <p>100% secure checkout</p>
          </div>
        </div>
        <div className="feature-card">
          <Headphones className="feature-icon" />
          <div>
            <h4>24/7 Support</h4>
            <p>Ready to help anytime</p>
          </div>
        </div>
        <div className="feature-card">
          <Repeat className="feature-icon" />
          <div>
            <h4>Easy Returns</h4>
            <p>30 days return policy</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/shop" className="view-all">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
             <p>No products found. Add some in the Admin Panel!</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories container">
        <div className="section-header">
          <h2>Shop by Category</h2>
        </div>
        <div className="grid grid-3">
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=500" alt="Fashion" />
            <div className="category-overlay">
              <h3>Fashion</h3>
              <Link to="/shop?category=Fashion">Explore</Link>
            </div>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=500" alt="Electronics" />
            <div className="category-overlay">
              <h3>Electronics</h3>
              <Link to="/shop?category=Electronics">Explore</Link>
            </div>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=500" alt="Home Decor" />
            <div className="category-overlay">
              <h3>Home Decor</h3>
              <Link to="/shop?category=Home">Explore</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
