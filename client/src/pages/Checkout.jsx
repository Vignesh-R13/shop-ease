import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ShoppingBag, MapPin, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Add some products before checkout.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsVerifyingCoupon(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
        code: couponCode
      });
      if (res.data.success) {
        const coupon = res.data.data;
        setAppliedCoupon(coupon);
        let calcDiscount = 0;
        if (coupon.discountType === 'percentage') {
          calcDiscount = cartTotal * (coupon.discountValue / 100);
        } else {
          calcDiscount = coupon.discountValue;
        }
        setDiscount(calcDiscount);
        toast.success(`Coupon "${coupon.code}" applied! Saved $${calcDiscount.toFixed(2)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // 1. Load Razorpay Client-Side Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsPlacingOrder(false);
        return;
      }

      // 2. Fetch Razorpay key from backend config route
      const configRes = await axios.get(`${import.meta.env.VITE_API_URL}/config/razorpay`);
      const rzpKeyId = configRes.data.key;

      const shippingPrice = cartTotal > 100 ? 0 : 15;
      const taxPrice = cartTotal * 0.1;
      const finalTotalPrice = Math.max(0, cartTotal + shippingPrice + taxPrice - discount);

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.title,          
          quantity: item.qty,        
          price: item.price,
          image: item.images?.[0]
        })),
        shippingAddress,
        paymentMethod: 'Razorpay',
        itemsPrice: cartTotal,
        taxPrice,
        shippingPrice,
        totalPrice: finalTotalPrice
      };

      // 3. Create local Order + Razorpay Order in Backend
      const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
      const { data: createdOrder, razorpayOrder } = orderRes.data;

      // 4. Open Razorpay Checkout Window
      const options = {
        key: rzpKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopEase',
        description: `Order Checkout - #${createdOrder._id.substring(18)}`,
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          setIsPlacingOrder(true);
          try {
            // Verify payment signature in backend
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id
            });

            if (verifyRes.data.success) {
              clearCart();
              toast.success('Payment Successful! Thank you for your order.');
              navigate('/profile');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Error verifying payment');
          } finally {
            setIsPlacingOrder(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            toast.warning('Payment cancelled. Your order remains unpaid.');
            navigate('/profile');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating checkout order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const shipping = cartTotal > 100 ? 0 : 15;
  const tax = cartTotal * 0.1;
  const grandTotal = Math.max(0, cartTotal + shipping + tax - discount);

  return (
    <div className="container checkout-page">
      <button onClick={() => navigate('/cart')} className="back-btn">
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <div className="checkout-grid">
        {/* Shipping Form */}
        <div className="checkout-form-section glass fade-in">
          <h2><MapPin size={24} /> Shipping Information</h2>
          <form onSubmit={handleCheckout} className="shipping-form">
            <div className="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                name="address" 
                value={shippingAddress.address} 
                onChange={handleInputChange} 
                placeholder="123 Main St, Apt 4B" 
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={shippingAddress.city} 
                  onChange={handleInputChange} 
                  placeholder="New York" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  name="postalCode" 
                  value={shippingAddress.postalCode} 
                  onChange={handleInputChange} 
                  placeholder="10001" 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input 
                type="text" 
                name="country" 
                value={shippingAddress.country} 
                onChange={handleInputChange} 
                placeholder="United States" 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary place-order-btn" 
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard size={20} /> Pay with Razorpay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary & Coupons */}
        <div className="checkout-summary-section fade-in">
          {/* Coupon Box */}
          <div className="coupon-box glass">
            <h3><Tag size={18} /> Coupon Code</h3>
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input 
                type="text" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                placeholder="Enter Code (e.g. SAVE10)" 
                disabled={appliedCoupon !== null}
              />
              <button 
                type="submit" 
                className="btn btn-outline" 
                disabled={isVerifyingCoupon || appliedCoupon !== null}
              >
                {isVerifyingCoupon ? 'Checking...' : appliedCoupon ? 'Applied' : 'Apply'}
              </button>
            </form>
            {appliedCoupon && (
              <div className="applied-coupon-badge">
                <span>Code <strong>{appliedCoupon.code}</strong> is active!</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setAppliedCoupon(null);
                    setDiscount(0);
                    setCouponCode('');
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Checkout Totals */}
          <div className="order-summary-box glass">
            <h3><ShoppingBag size={18} /> Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <div className="item-details">
                    <span><strong>{item.qty}x</strong> {item.title}</span>
                  </div>
                  <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="totals-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
