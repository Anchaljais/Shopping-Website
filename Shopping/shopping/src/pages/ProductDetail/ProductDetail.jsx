import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Space Gray');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Simulate product colors and sizes
  const colors = ['Space Gray', 'Silver', 'Gold', 'Rose Gold'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        
        // Enhance product data with multiple images and details
        const enhancedProduct = {
          ...response.data,
          images: [
            response.data.image,
            `https://source.unsplash.com/random/800x800/?${response.data.category},product`,
            `https://source.unsplash.com/random/800x800/?${response.data.category},closeup`
          ],
          details: {
            material: 'Premium Cotton Blend',
            dimensions: '12" x 10" x 3"',
            weight: '0.8 lbs',
            care: 'Machine wash cold, tumble dry low'
          },
          reviews: [
            { id: 1, author: 'Alex Johnson', rating: 5, comment: 'Absolutely love this product! Fits perfectly.' },
            { id: 2, author: 'Sarah Miller', rating: 4, comment: 'Great quality, would recommend to friends.' }
          ]
        };
        
        setProduct(enhancedProduct);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Animation effect
    const button = document.querySelector('.add-to-cart-button');
    button.classList.add('animate-pulse');
    setTimeout(() => button.classList.remove('animate-pulse'), 1000);
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(10, parseInt(value) || 1));
    setQuantity(newValue);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading premium experience...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <h2>Oops! Something went wrong</h2>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
  
  if (!product) return (
    <div className="not-found-screen">
      <h2>Product not found</h2>
      <p>We couldn't find the product you're looking for</p>
      <button className="browse-button" onClick={() => navigate('/products')}>
        Browse Products
      </button>
    </div>
  );

  return (
    <div className="product-detail-page">
      {/* Background decorative elements */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="cart-notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="notification-icon">✓</div>
            <div className="notification-content">
              <h4>Added to Cart</h4>
              <p>{product.title} (x{quantity})</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="product-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Shop
        </button>
        
        <div className="product-grid">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="thumbnail-strip">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
            
            <div 
              className={`main-image-container ${isZoomed ? 'zoomed' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img 
                src={product.images[currentImage]} 
                alt={product.title} 
                className="main-image"
                loading="eager"
              />
              <div className="image-actions">
                <button 
                  className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
                  onClick={toggleWishlist}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'}>
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" 
                      stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <span className="zoom-hint">{isZoomed ? 'Click to zoom out' : 'Click to zoom in'}</span>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="brand-tag">PREMIUM COLLECTION</div>
              <h1 className="product-title">{product.title}</h1>
              
              <div className="rating-container">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating.rate) ? 'filled' : ''}>★</span>
                  ))}
                </div>
                <span className="rating-text">{product.rating.rate} ({product.rating.count} reviews)</span>
                <a href="#reviews" className="see-all">See all</a>
              </div>
            </div>
            
            <div className="price-container">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.price > 50 && (
                <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>
            
            <div className="shipping-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 13H19M5 13L8 16M5 13L8 10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              FREE Express Shipping
            </div>
            
            <p className="product-description">{product.description}</p>
            
            {/* Color Selection */}
            <div className="option-selector">
              <h3>Color: <span>{selectedColor}</span></h3>
              <div className="color-options">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: getColorHex(color) }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div className="option-selector">
              <h3>Size: <span>{selectedSize}</span></h3>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <a href="#size-guide" className="size-guide-link">Size Guide</a>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="action-row">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn minus"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
                <button 
                  className="quantity-btn plus"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
              
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                <span>Add to Cart</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" 
                    stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            
            <div className="delivery-info">
              <div className="delivery-option">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H16V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" 
                    stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 7H16V12C16 12 14.5 11 12 11C9.5 11 8 12 8 12V7Z" 
                    stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Free Delivery</h4>
                  <p>Get free delivery on all orders over $50</p>
                </div>
              </div>
              
              <div className="delivery-option">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                    stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" 
                    stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <h4>Fast Shipping</h4>
                  <p>Receive your order within 2-3 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button className="tab-button active">Details</button>
            <button className="tab-button">Specifications</button>
            <button className="tab-button">Reviews ({product.reviews.length})</button>
            <button className="tab-button">Shipping & Returns</button>
          </div>
          
          <div className="tabs-content">
            <div className="tab-panel active">
              <h3>Product Details</h3>
              <p>{product.description}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <h4>Material</h4>
                  <p>{product.details.material}</p>
                </div>
                <div className="detail-item">
                  <h4>Dimensions</h4>
                  <p>{product.details.dimensions}</p>
                </div>
                <div className="detail-item">
                  <h4>Weight</h4>
                  <p>{product.details.weight}</p>
                </div>
                <div className="detail-item">
                  <h4>Care Instructions</h4>
                  <p>{product.details.care}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="reviews-section" id="reviews">
          <h2>Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="overall-rating">
              <div className="rating-number">{product.rating.rate}</div>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating.rate) ? 'filled' : ''}>★</span>
                ))}
              </div>
              <p>{product.rating.count} reviews</p>
            </div>
            
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="rating-bar" key={star}>
                  <span className="star-count">{star}★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(product.rating.count / (star * 2)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="review-list">
            {product.reviews.map(review => (
              <div className="review-card" key={review.id}>
                <div className="review-header">
                  <div className="review-author">{review.author}</div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'filled' : ''}>★</span>
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-date">2 days ago</div>
              </div>
            ))}
          </div>
          
          <button className="write-review-button">
            Write a Review
          </button>
        </div>
        
        {/* Related Products */}
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {[1, 2, 3, 4].map((item) => (
              <div className="product-card" key={item}>
                <div className="product-image">
                  <img 
                    src={`https://source.unsplash.com/random/300x300/?${product.category},${item}`} 
                    alt={`Related product ${item}`}
                  />
                  <button className="quick-view-button">Quick View</button>
                </div>
                <div className="product-info">
                  <h3>Related Product {item}</h3>
                  <div className="price">${(product.price * (0.8 + (item * 0.1))).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color hex values
function getColorHex(color) {
  const colors = {
    'Space Gray': '#333333',
    'Silver': '#c0c0c0',
    'Gold': '#ffd700',
    'Rose Gold': '#e0bfb8'
  };
  return colors[color] || '#333';
}

export default ProductDetail;