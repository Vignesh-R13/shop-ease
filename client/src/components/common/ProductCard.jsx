import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, wishlist } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product);
    toast.info(`${product.title} added to wishlist!`);
  };

  const isWishlisted = wishlist.find(item => item._id === product._id);

  return (
    <div className="product-card fade-in">
      <Link to={`/product/${product._id}`} className="product-img">
        <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.title} />
        {product.discountPrice > 0 && (
           <span className="discount-tag">-{Math.round((1 - product.discountPrice/product.price) * 100)}%</span>
        )}
        <div className="product-actions">
           <button onClick={handleAddToCart} className="action-btn"><ShoppingCart size={20} /></button>
           <button onClick={handleAddToWishlist} className={`action-btn ${isWishlisted ? 'active' : ''}`}><Heart size={20} /></button>
        </div>
      </Link>
      <div className="product-info">
        <span className="category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3>{product.title}</h3>
        </Link>
        <div className="rating">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{product.ratings || '5.0'}</span>
        </div>
        <div className="price-box">
          {product.discountPrice > 0 ? (
            <>
              <span className="price">${product.discountPrice}</span>
              <span className="old-price">${product.price}</span>
            </>
          ) : (
            <span className="price">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
