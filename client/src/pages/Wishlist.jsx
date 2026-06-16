import React from 'react';
import { Heart, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('Moved to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="container empty-state">
        <div className="empty-content fade-in">
          <Heart size={80} className="empty-icon" />
          <h2>Your Wishlist is Empty</h2>
          <p>Explore our shop and save your favorite products!</p>
          <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container wishlist-page">
      <h1 className="page-title">My Wishlist</h1>
      <div className="grid grid-4 wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-item glass fade-in">
            <div className="item-img-container">
              <img src={product.images[0]} alt={product.title} className="item-img" />
              <button 
                className="remove-btn" 
                onClick={() => {
                  removeFromWishlist(product._id);
                  toast.info('Removed from wishlist');
                }}
                title="Remove from Wishlist"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="item-info">
              <span className="item-category">{product.category}</span>
              <h3 className="item-title">{product.title}</h3>
              <div className="item-bottom">
                <span className="item-price">${product.price}</span>
                <button 
                  className="btn btn-primary move-to-cart-btn" 
                  onClick={() => handleMoveToCart(product)}
                >
                  <ShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
