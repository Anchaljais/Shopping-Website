import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  // Update quantity handler
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item handler
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 || cartItems.length === 0 ? 0 : 5.99;

  // Apply coupon code
  const applyCoupon = () => {
    // In a real app, you would validate this against your backend
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1); // 10% discount
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(subtotal * 0.2); // 20% discount
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  // Calculate total price
  const total = (subtotal + shipping - discount).toFixed(2);

  // Checkout handler
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear the cart
      localStorage.removeItem('cart');
      setCartItems([]);
      
      // Show success message
      setShowSuccess(true);
      setIsCheckingOut(false);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-illustration">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 7V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 11.5C16 13.7091 14.2091 15.5 12 15.5C9.79086 15.5 8 13.7091 8 11.5" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="success-popup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="success-icon">✓</div>
              <div className="success-content">
                <h4>Order Successful!</h4>
                <p>Your items will be shipped soon</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          className="continue-shopping"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p className="item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <motion.div 
              key={item.id} 
              className="cart-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="item-image-container">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="cart-item-image"
                  onClick={() => navigate(`/products/${item.id}`)}
                />
              </div>
              
              <div className="cart-item-details">
                <div className="item-info">
                  <h3 onClick={() => navigate(`/products/${item.id}`)}>{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    
                    <span>{item.quantity}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          
          {discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total}</span>
          </div>
          
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
          
          <div className="secure-checkout">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-popup"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h4>Order Successful!</h4>
              <p>Your items will be shipped soon</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;