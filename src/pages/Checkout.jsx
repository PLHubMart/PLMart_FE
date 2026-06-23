import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  User,
  Phone,
  Mail,
  Wallet,
  Coins,
  Ticket,
  FileText,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailNotified, setIsEmailNotified] = useState(true);
  
  // 1. STATE MANAGEMENT
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isVatRequested, setIsVatRequested] = useState(false);
  const [vatInfo, setVatInfo] = useState({ companyName: '', taxCode: '', companyAddress: '' });
  
  // Mock saved addresses from Profile
  const savedAddresses = [
    { id: 1, type: 'Nhà riêng', receiver: 'Nguyễn Văn Admin', phone: '0987 654 321', detail: '123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh', isDefault: true },
    { id: 2, type: 'Văn phòng', receiver: 'Anh Admin (PLMART)', phone: '0912 345 678', detail: '456 Đường DEF, Khu Công Nghệ Cao, TP. Thủ Đức', isDefault: false }
  ];

  const cartItems = [
    { id: 1, name: 'Bộ Chăn Ga Gối Cotton Cao Cấp Thắng Lợi', price: 1250000, quantity: 1, variant: 'Size: 1m8 x 2m', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80' },
    { id: 2, name: 'Gối Cao Su Non Lượn Sóng Massage Cổ', price: 250000, quantity: 2, variant: 'Màu: Trắng', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80' }
  ];

  // 2. CALCULATIONS
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShipThreshold = 2000000;
  
  let baseShippingCost = subtotal >= freeShipThreshold ? 0 : 35000;
  if (shippingMethod === 'express') baseShippingCost += 25000;

  let discountAmount = appliedCoupon ? appliedCoupon.value : 0;
  const total = subtotal + baseShippingCost - discountAmount + (isVatRequested ? Math.round(subtotal * 0.1) : 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyAddress = (addr) => {
    setShippingInfo({
      ...shippingInfo,
      fullName: addr.receiver,
      phone: addr.phone,
      address: addr.detail
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Giả lập thời gian xử lý đơn hàng (2 giây)
    setTimeout(() => {
      setIsLoading(false);
      // Giả lập 95% thành công, 5% thất bại để demo trang lỗi
      if (Math.random() > 0.05) {
        navigate('/order-success');
      } else {
        navigate('/order-failure');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <Header />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-100 border-t-brand rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingCart size={24} className="text-brand animate-pulse" />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center"
            >
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Đang xử lý đơn hàng</p>
              <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Vui lòng không tắt trình duyệt...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-8">
          <Link to="/" className="hover:text-brand transition-colors uppercase tracking-widest">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-brand transition-colors uppercase tracking-widest">Giỏ hàng</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 uppercase tracking-widest font-black">Thanh toán</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE: SHIPPING & PAYMENT */}
          <div className="flex-grow space-y-6">
            
            {/* 1. SHIPPING INFO */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Thông Tin Giao Hàng</h2>
                </div>
              </div>

              {/* Saved Addresses Quick Select */}
              <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Sử dụng địa chỉ đã lưu</p>
                <div className="flex gap-3">
                  {savedAddresses.map((addr) => (
                    <button 
                      key={addr.id}
                      onClick={() => handleApplyAddress(addr)}
                      className="flex-shrink-0 text-left p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 hover:border-brand hover:bg-white transition-all w-64 group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {addr.type === 'Nhà riêng' ? <HomeIcon size={14} className="text-brand" /> : <Briefcase size={14} className="text-brand" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{addr.type}</span>
                        {addr.isDefault && <span className="text-[8px] bg-brand text-white px-1.5 py-0.5 rounded-full font-bold uppercase">Mặc định</span>}
                      </div>
                      <p className="text-xs font-black text-gray-900 mb-1">{addr.receiver}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{addr.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" required placeholder="Nguyễn Văn A"
                      value={shippingInfo.fullName}
                      onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" required placeholder="09xx xxx xxx"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Tỉnh / Thành phố" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none" />
                  <input type="text" placeholder="Quận / Huyện" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none" />
                  <input type="text" placeholder="Phường / Xã" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required placeholder="Số nhà, tên đường..."
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ghi chú đơn hàng</label>
                  <textarea 
                    placeholder="VD: Giao giờ hành chính, gọi trước khi đến..."
                    rows="2"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all outline-none resize-none"
                  ></textarea>
                </div>
              </form>
            </motion.div>

            {/* 2. SHIPPING METHOD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                  <Truck size={16} />
                </div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Hình Thức Vận Chuyển</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-brand bg-brand/5' : 'border-gray-50 hover:border-gray-100'}`}>
                  <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-4 h-4 accent-brand" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-gray-900 uppercase leading-none mb-1">Tiêu chuẩn</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">Nhận sau 2-4 ngày</p>
                  </div>
                  <span className="ml-auto font-black text-brand text-[11px]">{subtotal >= freeShipThreshold ? 'FREE' : '35k'}</span>
                </label>

                <label className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-brand bg-brand/5' : 'border-gray-50 hover:border-gray-100'}`}>
                  <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-4 h-4 accent-brand" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-gray-900 uppercase leading-none mb-1">Hỏa tốc</p>
                    <p className="text-[10px] text-brand font-bold italic truncate">Trong ngày</p>
                  </div>
                  <span className="ml-auto font-black text-gray-900 text-[11px]">{subtotal >= freeShipThreshold ? '25k' : '60k'}</span>
                </label>
              </div>
            </motion.div>

            {/* 3. PAYMENT METHOD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                  <CreditCard size={16} />
                </div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Phương Thức Thanh Toán</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'cod', name: 'Tiền mặt', icon: <Coins size={16} />, desc: 'COD' },
                  { id: 'qr', name: 'Chuyển khoản', icon: <CreditCard size={16} />, desc: 'QR Code' },
                  { id: 'momo', name: 'Ví điện tử', icon: <Wallet size={16} />, desc: 'Momo/Zalo' }
                ].map((method) => (
                  <label 
                    key={method.id}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-brand bg-brand/5' : 'border-gray-50 hover:border-gray-100'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="w-3.5 h-3.5 accent-brand" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-900 uppercase leading-none mb-0.5 truncate">{method.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold truncate">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* 4. VAT REQUEST */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" checked={isVatRequested} onChange={e => setIsVatRequested(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand accent-brand"
                />
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-gray-400 group-hover:text-brand transition-colors" />
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Yêu cầu xuất hóa đơn VAT (10%)</span>
                </div>
              </label>

              <AnimatePresence>
                {isVatRequested && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên công ty</label>
                        <input type="text" placeholder="Công ty TNHH PLMART Việt Nam" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã số thuế</label>
                        <input type="text" placeholder="0312345678" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ công ty</label>
                        <input type="text" placeholder="Số nhà, tên đường..." className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 outline-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="w-full lg:w-[400px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 sticky top-24 space-y-8"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <ShoppingCart size={20} className="text-brand" /> Giỏ Hàng
                  </h2>
                  <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">{cartItems.length} Sản phẩm</span>
                </div>
                
                <div className="space-y-5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 group-hover:border-brand/20 transition-colors">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h3 className="text-[11px] font-black text-gray-900 line-clamp-1 group-hover:text-brand transition-colors uppercase leading-tight">{item.name}</h3>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{item.variant} • Qty: {item.quantity}</p>
                        <p className="text-xs font-black text-brand mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VOUCHER SECTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã giảm giá</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Ticket size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" placeholder="PLMART100"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs font-black focus:ring-2 focus:ring-brand/20 uppercase outline-none"
                    />
                  </div>
                  <button className="bg-gray-900 text-white px-5 rounded-2xl font-black text-[10px] uppercase hover:bg-brand transition-all">Áp dụng</button>
                </div>
              </div>

              {/* FINANCIALS */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Tạm tính</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Phí vận chuyển</span>
                  <span className="text-gray-900">{formatPrice(baseShippingCost)}</span>
                </div>
                {isVatRequested && (
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>VAT (10%)</span>
                    <span className="text-gray-900">{formatPrice(subtotal * 0.1)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-100">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Tổng cộng</span>
                  <span className="text-2xl font-black text-brand tracking-tighter">{formatPrice(total)}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer group px-1">
                  <input 
                    type="checkbox" 
                    checked={isEmailNotified} 
                    onChange={e => setIsEmailNotified(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand accent-brand"
                  />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-brand transition-colors">Gửi email thông báo đơn hàng</span>
                </label>

                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-brand text-white py-4.5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-accent-hover transition-all shadow-xl shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <ShieldCheck size={20} /> Xác nhận đặt hàng
                </button>
                <Link 
                  to="/cart"
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                >
                  <ChevronLeft size={16} /> Chỉnh sửa giỏ hàng
                </Link>
              </div>

              {/* SECURITY TRUST BADGES */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-50">
                {[
                  { icon: <ShieldCheck size={14} />, title: 'Bảo mật', color: 'text-green-600' },
                  { icon: <CheckCircle2 size={14} />, title: 'Chính hãng', color: 'text-blue-600' },
                  { icon: <AlertCircle size={14} />, title: 'Đổi trả', color: 'text-orange-600' }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-2 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                    <span className={`${badge.color} mb-1`}>{badge.icon}</span>
                    <p className="text-[8px] font-black text-gray-900 uppercase tracking-tighter">{badge.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
