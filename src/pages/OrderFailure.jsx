import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, AlertTriangle, ChevronLeft, RefreshCcw, Headset } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-8"
        >
          <XCircle size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Ối! Có lỗi xảy ra
          </h1>
          <p className="text-gray-500 font-medium mb-12">
            Rất tiếc, hệ thống không thể xử lý đơn hàng của bạn lúc này. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau ít phút.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2">Lỗi kết nối máy chủ</p>
          <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
            Có thể do sự cố đường truyền hoặc phương thức thanh toán bị từ chối. Đừng lo lắng, giỏ hàng của bạn vẫn được giữ nguyên.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 active:scale-95"
          >
            <RefreshCcw size={16} /> Thử lại ngay
          </button>
          <button 
            onClick={() => window.location.href = 'tel:0912345678'}
            className="bg-white border-2 border-gray-100 text-gray-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Headset size={16} /> Liên hệ hỗ trợ
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Link to="/cart" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand flex items-center gap-2 transition-colors">
            <ChevronLeft size={16} /> Quay lại giỏ hàng
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFailure;
