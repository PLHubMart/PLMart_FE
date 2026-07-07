import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Market = lazy(() => import('./pages/Market'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderFailure = lazy(() => import('./pages/OrderFailure'));

// Custom Welcome Loading Screen
const WelcomeLoading = () => (
  <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center">
    <div className="relative flex items-center justify-center">
      {/* Pulse Brand Logo */}
      <div className="w-16 h-16 rounded-3xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 animate-pulse">
        <span className="text-white font-black text-xl leading-none">PL</span>
      </div>
      {/* Spinner border */}
      <div className="absolute -inset-3 rounded-[2rem] border-2 border-brand/10 border-t-brand animate-spin"></div>
    </div>
    <p className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-brand/60 animate-pulse">PLMart đang tải...</p>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<WelcomeLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-failure" element={<OrderFailure />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

