import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderId = "PLM" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            Cảm ơn bạn đã tin tưởng PLMart. Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10"
        >
          <div className="grid grid-cols-2 gap-8">
            <div className="text-left border-r border-gray-50 pr-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
              <p className="text-lg font-black text-brand">#{orderId}</p>
            </div>
            <div className="text-left pl-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ngày đặt hàng</p>
              <p className="text-lg font-black text-gray-900">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              <Package size={16} /> Thông tin theo dõi đã được gửi qua Email
            </div>
            <p className="text-[11px] text-gray-400 font-medium italic">
              Vui lòng kiểm tra hộp thư đến (hoặc thư rác) để cập nhật trạng thái đơn hàng.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} /> Về trang chủ
          </button>
          <button 
            onClick={() => navigate('/market')}
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Tiếp tục mua sắm <ArrowRight size={16} />
          </button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
