import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container empty-state">
        <div className="empty-content fade-in">
          <ShoppingBag size={80} />
          <h2>Your Cart is Empty</h2>
          <p>Go to the shop to find amazing products!</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 100 ? 0 : 15;
  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + shipping + tax;

  return (
    <div className="container cart-page">
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => {
            // Normalize ID to work with both MongoDB (_id) and local mock data (id)
            const itemId = item._id || item.id;
            
            // Safe fallback image if the database item has empty image arrays
            const itemImage = item.images && item.images[0] 
              ? item.images[0] 
              : 'https://via.placeholder.com/100?text=No+Image';

            return (
              <div key={itemId} className="cart-item glass fade-in">

                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price}</p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="item-qty">
                  <button
                    onClick={() =>
                      item.qty === 1
                        ? removeFromCart(itemId)
                        : updateQty(itemId, item.qty - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => updateQty(itemId, item.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* PRICING AND ACTION CONTAINER */}
                <div className="item-total">
                  <p>${(item.price * item.qty).toFixed(2)}</p>

                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="delete-btn"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="cart-summary glass fade-in">
          <h3>Order Summary</h3>

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

          <div className="summary-total">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight size={20} />
          </button>

          <p className="tax-info">
            Shipping calculated at checkout. Free shipping on orders over $100.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;