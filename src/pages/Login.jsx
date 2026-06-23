import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { User as UserIcon, Lock, Loader2, ArrowRight, Home } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or 'admin'
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Tạm thời cho phép login admin/admin để test
    if (identifier === 'admin' && password === 'admin') {
      setTimeout(() => {
        addToast('Đăng nhập quản trị thành công!', 'success');
        navigate('/');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      await login(identifier, password);
      addToast('Đăng nhập thành công!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.message || 'Đăng nhập thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-inter">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 md:p-10 border border-gray-100">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center text-brand font-bold mb-4 hover:accent transition-colors">
            <Home size={20} className="mr-2" /> Quay lại trang chủ
          </Link>
          <h2 className="text-3xl font-bold text-brand mb-2 tracking-tight">HỒNG HẠNH SHOP</h2>
          <p className="text-gray-500 font-medium">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email hoặc Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none font-medium"
                placeholder="admin hoặc email@gmail.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
              <a href="#" className="text-xs font-bold text-brand hover:text-accent transition-colors">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3.5 rounded-lg font-bold text-lg hover:bg-brand/90 focus:ring-4 focus:ring-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                ĐĂNG NHẬP
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-accent font-bold hover:text-accent-hover transition-colors">Đăng ký ngay</Link>
          </p>
        </div>
        
        {/* Hint for development */}
        <div className="mt-6 p-3 bg-brand-light rounded border border-brand/10 text-[10px] text-brand/60 text-center uppercase tracking-widest">
          Test Mode: admin / admin
        </div>
      </div>
    </div>
  );
};

export default Login;
