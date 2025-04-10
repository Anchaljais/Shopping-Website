import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [isWishlist, setIsWishlist] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  // Gradient colors for the aesthetic background
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
        
        const wishlistState = {};
        response.data.forEach(product => {
          wishlistState[product.id] = false;
        });
        setIsWishlist(wishlistState);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
    setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }
    
    switch (sortOption) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating.rate - a.rating.rate); break;
      default: break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, sortOption]);

  const addToCart = (product, e) => {
    e.stopPropagation();
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        ...product,
        quantity: 1
      });
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    setAddedProduct(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Animation effect
    const button = e.target;
    button.classList.add('animate-pulse');
    setTimeout(() => button.classList.remove('animate-pulse'), 1000);
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    setIsWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    
    // Heart animation
    const heart = e.currentTarget.querySelector('svg');
    heart.classList.add('heart-beat');
    setTimeout(() => heart.classList.remove('heart-beat'), 1000);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading premium collection...</p>
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

  return (
    <div className="products-page">
      {/* Decorative background elements */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      <div className="bg-pattern"></div>
      
      {/* Floating cart notification */}
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
              <p>{addedProduct?.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="products-container">
        {/* Header section with search */}
        <header className="products-header">
          <div className="header-content">
            <h1>Premium Collection</h1>
            <p>Discover our curated selection of high-quality products</p>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
              </svg>
            </div>
            
            <div 
              className="cart-icon-container"
              onClick={() => navigate('/cart')}
            >
              <svg viewBox="0 0 24 24">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="cart-count">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Category filter chips */}
        <div className="category-filters">
          {['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"].map(category => (
            <button
              key={category}
              className={`category-chip ${activeFilter === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setActiveFilter(category);
              }}
              style={{
                background: activeFilter === category ? gradients[Math.floor(Math.random() * gradients.length)] : 'var(--light-color)'
              }}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        {/* Sort controls */}
        <div className="sort-controls">
          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/products/${product.id}`);
                  }
                }}
              >
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-image"
                    loading="lazy"
                  />
                  <button 
                    className={`wishlist-button ${isWishlist[product.id] ? 'active' : ''}`}
                    onClick={(e) => toggleWishlist(product.id, e)}
                    aria-label={isWishlist[product.id] ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
                    </svg>
                  </button>
                  
                  <div className="product-badges">
                    <div className="product-rating-badge">
                      {product.rating.rate} ★
                      <span className="rating-count">({product.rating.count})</span>
                    </div>
                    {product.price > 100 && (
                      <div className="free-shipping-badge">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 13H19M5 13L8 16M5 13L8 10" />
                        </svg>
                        Free Shipping
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-category">{product.category}</p>
                  
                  <div className="price-container">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {product.price > 50 && (
                      <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
                    )}
                  </div>
                  
                  <button 
                    className="add-to-cart"
                    onClick={(e) => addToCart(product, e)}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <span>Add to Cart</span>
                    <svg viewBox="0 0 24 24">
                      <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg viewBox="0 0 24 24">
              <path d="M4 7V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7" />
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" />
              <path d="M16 11.5C16 13.7091 14.2091 15.5 12 15.5C9.79086 15.5 8 13.7091 8 11.5" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button 
              className="reset-filters"
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setSortOption('default');
                setActiveFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;