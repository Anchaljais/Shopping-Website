import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Header from './pages/Header/Header';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children, cartItemCount }) => {
  return (
    <>
      <Header cartItemCount={cartItemCount} />
      <main className="main-content">{children}</main>
    </>
  );
};

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItemCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/products" />} />
        
        <Route 
          path="/products" 
          element={
            <PrivateRoute>
              <AppLayout cartItemCount={cartItemCount}>
                <Products />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/products/:productId" 
          element={
            <PrivateRoute>
              <AppLayout cartItemCount={cartItemCount}>
                <ProductDetail />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <PrivateRoute>
              <AppLayout cartItemCount={cartItemCount}>
                <Cart />
              </AppLayout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;