import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, ShoppingCart, Plus, Minus, Heart, Share2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mockProductDetail } from '../data/productDetails';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  // In a real app, we would fetch product by id. 
  // For now, we use the mock data.
  const product = mockProductDetail;

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Header />
      
      <main className="flex-grow pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs text-gray-500 mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-red-600 transition-colors flex items-center shrink-0">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
            <Link to="/market" className="hover:text-red-600 transition-colors shrink-0">Cửa hàng</Link>
            <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
            <span className="hover:text-red-600 transition-colors shrink-0">{product.category}</span>
            <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
            <span className="text-gray-900 font-bold truncate shrink-0">{product.name}</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row">
              {/* Product Gallery */}
              <div className="lg:w-1/2 p-4 lg:p-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100 relative group"
                >
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.isSale && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      GIẢM GIÁ SỐC
                    </span>
                  )}
                </motion.div>
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === idx ? 'border-red-600 ring-4 ring-red-50' : 'border-gray-100 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2 p-4 lg:p-8 lg:border-l border-gray-100 flex flex-col">
                <motion.div {...fadeIn} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-red-100">
                      {product.sub}
                    </span>
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-green-100">
                      {product.stock}
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14}
                            className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <span className="text-sm text-gray-500 font-medium">
                      <span className="text-gray-900 font-bold">{product.reviews}</span> Đánh giá
                    </span>
                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <span className="text-sm text-gray-500 font-medium">
                      Đã bán <span className="text-gray-900 font-bold">500+</span>
                    </span>
                  </div>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="mb-8 bg-gray-900 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-4xl font-black text-white tracking-tighter">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      {product.oldPrice && (
                        <span className="text-lg text-gray-400 line-through font-medium">
                          {product.oldPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                        Tiết kiệm {((product.oldPrice - product.price) / 1000).toLocaleString()}K
                      </span>
                      <p className="text-xs text-gray-400 font-medium italic">Chính sách giá tốt nhất tại PLMart</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="mb-8 flex-grow">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic border-l-4 border-red-500 pl-4">
                    "{product.shortDesc}"
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specs.slice(0, 4).map((spec, idx) => (
                      <div key={idx} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{spec.label}</span>
                        <span className="text-sm text-gray-900 font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Số lượng:</span>
                    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                      <button 
                        onClick={handleDecrease}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input 
                        type="text" 
                        value={quantity} 
                        readOnly 
                        className="w-14 text-center bg-transparent font-black text-gray-900 focus:outline-none"
                      />
                      <button 
                        onClick={handleIncrease}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-black py-4 px-8 rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 uppercase text-sm tracking-widest shadow-lg active:scale-95">
                      <ShoppingCart className="w-5 h-5" />
                      Thêm giỏ hàng
                    </button>
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="flex-1 bg-red-600 text-white font-black py-4 px-8 rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-200 uppercase text-sm tracking-widest active:scale-95"
                    >
                      Mua ngay
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest">
                      <Heart className="w-4 h-4" />
                      Yêu thích
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest">
                      <Share2 className="w-4 h-4" />
                      Chia sẻ
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Detailed Info Tabs */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'CHI TIẾT SẢN PHẨM' },
                { id: 'specs', label: 'THÔNG SỐ KỸ THUẬT' },
                { id: 'reviews', label: `ĐÁNH GIÁ (${product.reviews})` }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-black text-[11px] transition-all whitespace-nowrap uppercase tracking-widest ${
                    activeTab === tab.id 
                    ? 'bg-white text-red-600 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-10">
              {activeTab === 'description' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-red max-w-none"
                >
                  <div 
                    className="description-content text-gray-600 leading-relaxed text-sm lg:text-base space-y-6"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <style>{`
                    .description-content h3 {
                      color: #111827;
                      font-weight: 900;
                      font-size: 1.25rem;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      text-transform: uppercase;
                      letter-spacing: -0.025em;
                      border-left: 4px solid #ef4444;
                      padding-left: 1rem;
                    }
                    .description-content p {
                      margin-bottom: 1.25rem;
                    }
                    .description-content ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1.5rem;
                      color: #4b5563;
                    }
                    .description-content li {
                      margin-bottom: 0.5rem;
                    }
                    .description-content strong {
                      color: #111827;
                      font-weight: 800;
                    }
                  `}</style>
                </motion.div>
              )}
              {activeTab === 'specs' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-4xl"
                >
                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full border-collapse">
                      <tbody>
                        {product.specs.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                            <td className="py-4 px-6 text-[11px] text-gray-400 font-black uppercase tracking-widest w-1/3 border-b border-gray-100">{spec.label}</td>
                            <td className="py-4 px-6 text-sm text-gray-900 font-bold border-b border-gray-100">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
              {activeTab === 'reviews' && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Chưa có đánh giá nào</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 font-medium">Hãy là người đầu tiên trải nghiệm và để lại đánh giá cho sản phẩm tuyệt vời này!</p>
                  <button className="bg-gray-900 text-white font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-red-600 transition-all">
                    Viết đánh giá
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
