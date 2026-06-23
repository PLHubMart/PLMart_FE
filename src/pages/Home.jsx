import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Heart,
  ShoppingCart,
  Flame,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp,
  Tag,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 1. IMPORT CÁC THÀNH PHẦN CỦA SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// 2. IMPORT CSS CỦA SWIPER
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [visibleCount, setVisibleCount] = useState(10);

  // Countdown timer hiệu ứng chạy mượt mà theo giây
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = [
    { id: 101, name: 'Ra Thắng Lợi Chống Thấm Cao Cấp Cho Bé', price: '195.000đ', oldPrice: '350.000đ', sale: '-45%', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80', sold: 185, totalStock: 250 },
    { id: 102, name: 'Áo Mưa Bộ Siêu Bền Cao Cấp Thành Nam', price: '145.000đ', oldPrice: '220.000đ', sale: '-34%', image: 'https://images.unsplash.com/photo-1531256379416-9f000e90aacc?w=400&q=80', sold: 120, totalStock: 150 },
    { id: 103, name: 'Nệm Cao Su Non 10 Phân Cực Êm Kansan', price: '1.250.000đ', oldPrice: '2.100.000đ', sale: '-40%', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', sold: 45, totalStock: 50 },
    { id: 104, name: 'Dù Xếp Gọn Khung Thép Cường Lực Chống UV', price: '85.000đ', oldPrice: '150.000đ', sale: '-43%', image: 'https://images.unsplash.com/photo-1522201949034-507737bce461?w=400&q=80', sold: 210, totalStock: 300 },
    { id: 105, name: 'Gối Nằm Bông Gòn Xuất Khẩu Siêu Mềm', price: '125.000đ', oldPrice: '200.000đ', sale: '-38%', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80', sold: 65, totalStock: 100 },
    { id: 106, name: 'Chiếu Trúc Hạt Đen Viền Đỏ 1m6 x 2m', price: '550.000đ', oldPrice: '850.000đ', sale: '-35%', image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400&q=80', sold: 30, totalStock: 80 },
    { id: 107, name: 'Mùng Chụp Tự Bung Đỉnh Rộng 1m8', price: '295.000đ', oldPrice: '450.000đ', sale: '-34%', image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=400&q=80', sold: 95, totalStock: 120 },
    { id: 108, name: 'Bộ Chăn Ga Gối Poly Cotton Họa Tiết', price: '380.000đ', oldPrice: '600.000đ', sale: '-37%', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', sold: 150, totalStock: 200 },
  ];

  const categories = [
    { name: 'Nệm & Topper', icon: '🛏️', count: '120+ Sản phẩm', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { name: 'Chăn Ga Gối', icon: '🧵', count: '450+ Sản phẩm', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { name: 'Chiếu & Mùng', icon: '🎋', count: '85+ Sản phẩm', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Đồ Đi Mưa', icon: '🌧️', count: '50+ Sản phẩm', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Dã Ngoại', icon: '🏕️', count: '30+ Sản phẩm', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Bộ Chăn Ga Gối Cotton Cao Cấp Thắng Lợi', price: '1.250.000đ', oldPrice: '1.500.000đ', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', tag: 'Bán chạy', rating: 5, reviews: 48 },
    { id: 2, name: 'Nệm Cao Su Thiên Nhiên Vạn Thành Kháng Khuẩn', price: '6.800.000đ', oldPrice: '7.500.000đ', image: 'https://plus.unsplash.com/premium_photo-1661765778256-169bf5e561a6?w=500&q=80', tag: 'Tốt nhất', rating: 5, reviews: 112 },
    { id: 3, name: 'Chiếu Trúc Hạt Đen Viền Đỏ Điều Hòa Xuất Khẩu', price: '450.000đ', oldPrice: '600.000đ', image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500&q=80', tag: 'Mới về', rating: 4, reviews: 25 },
    { id: 4, name: 'Mùng Chụp Tự Bung Cao Cấp Đô Thành 1m8', price: '280.000đ', oldPrice: '350.000đ', image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500&q=80', tag: 'Tiện ích', rating: 4, reviews: 36 },
  ];

  const productTags = [
    { name: 'Nệm cao su non', top: '12%', left: '5%', delay: 0 },
    { name: 'Chăn ga Cotton', top: '15%', left: '23%', delay: 1.5 },
    { name: 'Chiếu điều hòa', top: '8%', left: '42%', delay: 0.5 },
    { name: 'Topper làm mềm nệm', top: '14%', left: '60%', delay: 2 },
    { name: 'Mùng chụp tự bung', top: '7%', left: '78%', delay: 1 },
    { name: 'Áo mưa bộ cao cấp', top: '22%', left: '90%', delay: 2.5 },
    { name: 'Dù xếp chống tia UV', top: '48%', left: '6%', delay: 3 },
    { name: 'Ghế xếp dã ngoại', top: '38%', left: '25%', delay: 0.8 },
    { name: 'Gối ôm bông gòn', top: '35%', left: '76%', delay: 1.2 },
    { name: 'Chăn phao siêu nhẹ', top: '72%', left: '10%', delay: 1.7 },
    { name: 'Chiếu trúc xuất khẩu', top: '65%', left: '45%', delay: 0.2 },
    { name: 'Lều cắm trại chống nước', top: '68%', left: '78%', delay: 2.2 },
    { name: 'Mũ bảo hiểm limited', top: '88%', left: '18%', delay: 0.9 },
    { name: 'Gối cao su lượn sóng', top: '85%', left: '55%', delay: 1.4 },
    { name: 'Dù lệch tâm quán cafe', top: '82%', left: '84%', delay: 2.8 },
  ];

  const personalizedProducts = [
    { id: 201, name: 'Gối Cao Su Non Lượn Sóng Massage Cổ', price: '250.000đ', oldPrice: '380.000đ', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80', rating: 5, reviews: 34, tag: 'Gợi ý' },
    { id: 202, name: 'Topper Nệm Xuất Khẩu Siêu Êm Dày 5cm', price: '850.000đ', oldPrice: '1.200.000đ', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', rating: 5, reviews: 92, tag: 'Mua nhiều' },
    { id: 203, name: 'Chăn Phao Bông Ép Họa Tiết Thắng Lợi', price: '420.000đ', oldPrice: '600.000đ', image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=500&q=80', rating: 4, reviews: 18, tag: 'Hot' },
    { id: 204, name: 'Dù Xếp Thân Thép Cường Lực Bấm Tự Động', price: '95.000đ', oldPrice: '160.000đ', image: 'https://images.unsplash.com/photo-1522201949034-507737bce461?w=500&q=80', rating: 5, reviews: 142, tag: 'Giá sốc' },
    { id: 205, name: 'Lều Dã Ngoại Tự Bung Chống Nước 4 Người', price: '750.000đ', oldPrice: '1.100.000đ', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80', rating: 4, reviews: 21, tag: 'Camping' },
    { id: 206, name: 'Chiếu Mây Điều Hòa Cao Cấp Sợi Mây Tự Nhiên', price: '320.000đ', oldPrice: '450.000đ', image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500&q=80', rating: 5, reviews: 56, tag: 'Giải nhiệt' },
    { id: 207, name: 'Đệm Bông Ép Gấp 3 Kháng Khuẩn Đô Thành', price: '1.650.000đ', oldPrice: '2.300.000đ', image: 'https://plus.unsplash.com/premium_photo-1661765778256-169bf5e561a6?w=500&q=80', rating: 5, reviews: 74, tag: 'Êm ái' },
    { id: 208, name: 'Mũ Bảo Hiểm Trơn Sơn Nhám Cao Cấp', price: '180.000đ', oldPrice: '280.000đ', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80', rating: 4, reviews: 41, tag: 'An toàn' },
    { id: 209, name: 'Gối Ôm Bông Gòn Dài 1m Cực Kì Khít Tay', price: '135.000đ', oldPrice: '200.000đ', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', rating: 5, reviews: 29, tag: 'Tiện ích' },
    { id: 210, name: 'Ủ Chống Thấm Bảo Vệ Nệm Khỏi Bụi Bẩn', price: '210.000đ', oldPrice: '320.000đ', image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500&q=80', rating: 4, reviews: 15, tag: 'Bảo vệ nệm' },
    { id: 211, name: 'Gối Cao Su Non Massage Cao Cấp', price: '290.000đ', oldPrice: '450.000đ', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80', rating: 5, reviews: 45, tag: 'Mới' },
    { id: 212, name: 'Topper Nệm Memory Foam 7cm', price: '1.150.000đ', oldPrice: '1.600.000đ', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', rating: 5, reviews: 32, tag: 'Cao cấp' },
    { id: 213, name: 'Chăn Ga Gối Lụa Tencel 60s', price: '1.850.000đ', oldPrice: '2.500.000đ', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', rating: 5, reviews: 12, tag: 'Sang trọng' },
    { id: 214, name: 'Dù Cầm Tay Gấp Gọn Mini', price: '65.000đ', oldPrice: '120.000đ', image: 'https://images.unsplash.com/photo-1522201949034-507737bce461?w=500&q=80', rating: 4, reviews: 88, tag: 'Giá rẻ' },
    { id: 215, name: 'Ghế Xếp Dã Ngoại Siêu Nhẹ', price: '350.000đ', oldPrice: '500.000đ', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80', rating: 5, reviews: 24, tag: 'Camping' },
  ];

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const loadMoreProducts = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  return (
    <div className="min-h-screen bg-white font-inter text-gray-800 overflow-x-hidden">
      <Header />
      
      <main className="   space-y-16 lg:space-y-20">
        
        {/* 1. MINIMALIST HERO SECTION - NESTED DESIGN */}
        <section className="max-w-8xl mx-auto px-4">
          <div className="relative h-[450px] lg:h-[500px] w-full bg-gray-50 rounded-[2.5rem] overflow-hidden flex items-center shadow-sm border border-gray-100">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 -skew-x-12 translate-x-20"></div>
            
            <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              {/* Left Side: Content */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <Sparkles size={14} className="text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Thế giới nệm cao cấp</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Ngủ Ngon <br/> 
                  <span className="text-brand">Sống Khỏe</span>
                </h1>
                <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-medium">
                  Trải nghiệm sự êm ái tuyệt đối từ dòng nệm cao su non Thắng Lợi. Thiết kế tối giản, chất lượng đỉnh cao.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Link to="/checkout" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-brand transition-all shadow-md active:scale-95">
                    Mua ngay
                  </Link>
                  <button onClick={() => navigate('/market')} className="text-gray-600 font-bold text-xs flex items-center gap-1.5 group hover:text-brand transition-colors uppercase">
                    Tìm hiểu thêm <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Right Side: Nested Slider / Feature Image */}
              <div className="hidden lg:block relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-20 aspect-square w-[350px] mx-auto rounded-[2.5rem] overflow-hidden shadow-xl border-[10px] border-white bg-white"
                >
                  <Swiper
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="w-full h-full"
                  >
                    <SwiperSlide>
                      <img src="https://images.unsplash.com/photo-1505693413171-29336f0460c4?w=800&q=80" className="w-full h-full object-cover" alt="Product 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" className="w-full h-full object-cover" alt="Product 2" />
                    </SwiperSlide>
                  </Swiper>
                </motion.div>
                
                {/* Nested floating element */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 z-30 bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bảo hành</p>
                    <p className="text-xs font-extrabold text-gray-900">Chính hãng 15 năm</p>
                  </div>
                </motion.div>

                {/* Second nested element */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 z-10 w-24 h-24 bg-brand/10 rounded-full blur-xl"
                ></motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FLASH SALE SECTION - FONT NHỎ LẠI */}
        <section className="max-w-8xl mx-auto px-4">
          <div className="bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-center lg:text-left space-y-4 shrink-0 lg:w-1/4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md">
                  <Flame size={14} className="animate-bounce" /> Hot Offer
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">
                  Flash Sale
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Kết thúc trong:</p>
                  <div className="flex justify-center lg:justify-start gap-2">
                    {[
                      { v: timeLeft.h, l: 'Giờ' },
                      { v: timeLeft.m, l: 'Phút' },
                      { v: timeLeft.s, l: 'Giây' }
                    ].map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center text-white font-bold text-base shadow-md">
                          {String(t.v).padStart(2, '0')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => navigate('/market')} className="text-brand text-xs font-bold uppercase hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-1 mt-2">
                  Xem tất cả <ChevronRight size={14} />
                </button>
              </div>

              <div className="w-full lg:w-3/4">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={2}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="w-full"
                >
                  {flashSaleProducts.map((p) => {
                    const percent = Math.floor((p.sold / p.totalStock) * 100);
                    return (
                      <SwiperSlide key={p.id}>
                        <motion.div 
                          whileHover={{ y: -5 }} 
                          onClick={() => handleProductClick(p.id)}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-all cursor-pointer group/card h-full"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                            <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" alt={p.name} />
                            <div className="absolute top-2 left-2 bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md">
                              {p.sale}
                            </div>
                          </div>
                          <h3 className="text-[11px] font-medium text-white/90 line-clamp-2 min-h-[32px] mb-2 group-hover/card:text-brand transition-colors">{p.name}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-brand">{p.price}</span>
                            <span className="text-[9px] text-gray-500 line-through">{p.oldPrice}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} className="h-full bg-brand" />
                            </div>
                            <p className="text-[8px] font-medium text-gray-500 uppercase tracking-widest text-center">Đã bán {p.sold}</p>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CATEGORIES SECTION */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">Danh Mục Sản Phẩm</h2>
            <div className="w-16 h-1 bg-brand rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }} 
                onClick={() => navigate(`/market?category=${cat.name}`)}
                className="flex flex-col items-center group cursor-pointer w-24 sm:w-28 text-center"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${cat.color} border-2 border-transparent flex items-center justify-center text-3xl shadow-md group-hover:shadow-brand/10 group-hover:border-brand/20 transition-all duration-300 bg-white`}>
                  {cat.icon}
                </div>
                <h4 className="mt-4 font-bold text-xs text-gray-900 leading-tight group-hover:text-brand transition-colors">{cat.name}</h4>
                <span className="text-[9px] text-gray-400 mt-1 font-medium">{cat.count}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-2xl font-extrabold text-gray-900 uppercase tracking-tight">Sản Phẩm Đề Xuất</h2>
            <Link to="/market" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors flex items-center">Xem tất cả <ChevronRight size={16} /></Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p) => (
              <motion.div 
                key={p.id} 
                whileHover={{ y: -5 }} 
                onClick={() => handleProductClick(p.id)}
                className="group bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase">{p.tag}</div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[40px] mb-2 group-hover:text-brand transition-colors">{p.name}</h3>
                </div>
                <div className="space-y-3 mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-brand">{p.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">{p.oldPrice}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-gray-700">{p.rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Đã bán {p.reviews}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-full bg-gray-50 text-gray-800 hover:bg-brand hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} /> Thêm giỏ hàng
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. PERSONALIZED PRODUCTS - 5 ITEMS PER ROW */}
        <section className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-xl lg:text-xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">Dành Riêng Cho Bạn</h2>
            <div className="w-16 h-1 bg-brand rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {personalizedProducts.slice(0, visibleCount).map((p) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }} 
                onClick={() => handleProductClick(p.id)}
                className="group cursor-pointer flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all p-3"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-md border border-gray-200">{p.tag}</span>
                </div>
                <div className="flex flex-col flex-grow justify-between space-y-2">
                  <h3 className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-brand transition-colors">{p.name}</h3>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-sm font-extrabold text-brand">{p.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-medium text-gray-500">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {visibleCount < personalizedProducts.length && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={loadMoreProducts}
                className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold text-xs uppercase rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
              >
                Xem thêm
              </button>
            </div>
          )}
        </section>

        {/* 6. NEWSLETTER & BENEFITS */}
    
      </main>

      <Footer />
    </div>
  );
};

export default Home;
