import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, Heart, Star, ShieldCheck, 
  Truck, ArrowLeft, Plus, Minus 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, addToWishlist } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        rating,
        comment
      });
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setComment('');
        setRating(5);
        // Refresh product details to show the new review
        const updatedProduct = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(updatedProduct.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="loading-state"><h2>Loading Product Details...</h2></div>;
  if (!product) return null;

  return (
    <div className="container product-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="product-layout">
        {/* Image Gallery */}
        <div className="gallery-section fade-in">
          <div className="main-img glass">
            <img src={product.images[activeImg]} alt={product.title} />
          </div>
          <div className="thumbnail-grid">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb glass ${activeImg === idx ? 'active' : ''}`}
                onClick={() => setActiveImg(idx)}
              >
                <img src={img} alt={`thumb-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section fade-in">
          <span className="category-tag">{product.category}</span>
          <h1>{product.title}</h1>
          
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.ratings || 5) ? "#f59e0b" : "none"} color="#f59e0b" />
              ))}
            </div>
            <span>({product.numReviews || 0} customer reviews)</span>
          </div>

          <div className="price-row">
            {product.discountPrice > 0 ? (
              <>
                <span className="price">${product.discountPrice}</span>
                <span className="old-price">${product.price}</span>
                <span className="discount-percent">
                   {Math.round((1 - product.discountPrice/product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="price">${product.price}</span>
            )}
          </div>

          <p className="description">{product.description}</p>

          <div className="stock-info">
             Status: <span className={product.stock > 0 ? 'inline-stock' : 'out-stock'}>
               {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
             </span>
          </div>

          {product.stock > 0 && (
            <div className="purchase-controls">
              <div className="qty-picker">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={18} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus size={18} /></button>
              </div>
              <button 
                className="btn btn-primary add-to-cart"
                onClick={() => {
                  addToCart(product, qty);
                  toast.success('Added to cart!');
                }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                className="btn-icon wishlist-btn"
                onClick={() => {
                  addToWishlist(product);
                  toast.info('Added to wishlist!');
                }}
              >
                <Heart size={22} />
              </button>
            </div>
          )}

          <div className="trust-badges">
            <div className="badge">
              <Truck size={20} />
              <span>Free Delivery</span>
            </div>
            <div className="badge">
              <ShieldCheck size={20} />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section glass fade-in">
        <h2>Customer Reviews ({product.reviews?.length || 0})</h2>

        {/* Submit Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write a Review</h3>
            <div className="rating-selector">
              <span>Your Rating: </span>
              <div className="stars-picker">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="star-btn"
                  >
                    <Star
                      size={22}
                      fill={starVal <= rating ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group-review">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary submit-review-btn" disabled={isSubmittingReview}>
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            Please <Link to="/login" className="login-link">login</Link> to review this product.
          </p>
        )}

        <div className="reviews-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id} className="review-card glass">
                <div className="review-header">
                  <strong>{rev.user?.name || 'Anonymous'}</strong>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? "#f59e0b" : "none"}
                        color="#f59e0b"
                      />
                    ))}
                  </div>
                </div>
                <span className="review-date">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <p className="review-comment">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
