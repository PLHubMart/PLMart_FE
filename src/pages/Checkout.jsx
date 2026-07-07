import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ChevronLeft, MapPin, CreditCard, Truck, ShieldCheck, 
  ChevronRight, User, Phone, Wallet, Coins, Ticket, FileText, 
  ShoppingCart, CheckCircle2, AlertCircle, Home as HomeIcon, Briefcase
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useAddresses } from '../hooks/useAddresses';
import { orderApi } from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { addresses, loading: loadingAddresses } = useAddresses();

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailNotified, setIsEmailNotified] = useState(true);

  // 1. LOAD CART & COUPON FROM LOCAL STORAGE
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('plmart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('plmart_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      addToast('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán!', 'warning');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // 2. SHIPPING INFO STATE
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  // Auto-fill from user profile or default address
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      setShippingInfo({
        fullName: def.receiver || user?.fullName || '',
        phone: def.phone || user?.phoneNumber || '',
        province: def.province || '',
        district: def.district || '',
        ward: def.ward || '',
        address: def.detail || '',
        note: ''
      });
    } else if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phoneNumber || ''
      }));
    }
  }, [addresses, user]);

  const [shippingMethod, setShippingMethod] = useState('standard'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [isVatRequested, setIsVatRequested] = useState(false);
  const [vatInfo, setVatInfo] = useState({ companyName: '', taxCode: '', companyAddress: '' });

  // 3. CALCULATIONS
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShipThreshold = 2000000;
  
  let baseShippingCost = subtotal >= freeShipThreshold ? 0 : 35000;
  if (shippingMethod === 'express') {
    baseShippingCost += 25000;
  }

  let discountAmount = 0;
  let shippingDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'shipping') {
      shippingDiscount = Math.min(baseShippingCost, appliedCoupon.value);
    }
  }

  const finalShippingCost = Math.max(0, baseShippingCost - shippingDiscount);
  const vatAmount = isVatRequested ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + finalShippingCost + vatAmount - discountAmount;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const handleApplyAddress = (addr) => {
    setShippingInfo({
      fullName: addr.receiver,
      phone: addr.phone,
      province: addr.province || '',
      district: addr.district || '',
      ward: addr.ward || '',
      address: addr.detail,
      note: shippingInfo.note
    });
    addToast(`Đã áp dụng địa chỉ: ${addr.type}`, 'success');
  };

  // 4. SUBMIT ORDER TO API
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      addToast('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!', 'error');
      return;
    }

    setIsLoading(true);

    // Chuỗi địa chỉ giao hàng hoàn chỉnh gửi lên BE
    const fullAddress = `${shippingInfo.fullName} | SĐT: ${shippingInfo.phone} | Địa chỉ: ${shippingInfo.address}${shippingInfo.ward ? `, ${shippingInfo.ward}` : ''}${shippingInfo.district ? `, ${shippingInfo.district}` : ''}${shippingInfo.province ? `, ${shippingInfo.province}` : ''}`;
    
    // Tạo cấu trúc gửi lên API backend (CreateOrderRequest)
    const orderRequest = {
      shippingAddress: fullAddress,
      note: shippingInfo.note || '',
      orderItems: cartItems.map(item => ({
        productId: item.productId || item.id.toString(),
        quantity: item.quantity
      }))
    };

    try {
      await orderApi.create(orderRequest);
      
      // Thành công: Xóa giỏ hàng và coupon
      localStorage.removeItem('plmart_cart');
      localStorage.removeItem('plmart_coupon');
      window.dispatchEvent(new Event('cartUpdated'));

      addToast('Đặt đơn hàng thành công!', 'success');
      navigate('/order-success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Đặt hàng thất bại. Vui lòng kiểm tra lại số lượng tồn kho!', 'error');
      navigate('/order-failure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 text-xs sm:text-sm">
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
              <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Đang khởi tạo đơn hàng...</p>
              <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase">Vui lòng chờ giây lát</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Sleek Stepper Progress Indicator */}
        <div className="max-w-xl mx-auto mb-8 flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200/60 pb-5">
          <Link to="/cart" className="text-brand flex items-center gap-1.5 hover:underline"><span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-black">1</span> Giỏ hàng</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-brand flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-black">2</span> Thanh toán</span>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">3</span> Hoàn tất</span>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* CỘT TRÁI: ĐỊA CHỈ & HÌNH THỨC THANH TOÁN (8/12) */}
          <div className="flex-grow space-y-6 w-full lg:col-span-8">
            
            {/* 1. THÔNG TIN GIAO HÀNG */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">1. Địa chỉ nhận hàng</h2>
                </div>
              </div>

              {/* Sử dụng sổ địa chỉ đã lưu (từ Cookie) */}
              {addresses && addresses.length > 0 && (
                <div className="mb-6 pb-4 border-b border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Chọn nhanh địa chỉ của bạn</p>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {addresses.map((addr) => (
                      <button 
                        key={addr.id}
                        type="button"
                        onClick={() => handleApplyAddress(addr)}
                        className="flex-shrink-0 text-left p-4 rounded-2xl border border-gray-150 hover:border-brand hover:bg-brand/5/10 transition-all w-60 bg-gray-50/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {addr.type === 'Nhà riêng' ? <HomeIcon size={14} className="text-brand" /> : <Briefcase size={14} className="text-brand" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{addr.type}</span>
                          {addr.isDefault && <span className="text-[8px] bg-brand text-white px-2 py-0.5 rounded-full font-bold uppercase">Mặc định</span>}
                        </div>
                        <p className="text-xs font-black text-gray-800 mb-1">{addr.receiver}</p>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">{addr.phone}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-1 italic">"{addr.detail}"</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên người nhận <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" required placeholder="Nguyễn Văn A"
                      value={shippingInfo.fullName}
                      onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" required placeholder="09xx xxx xxx"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Tỉnh / Thành phố" value={shippingInfo.province} onChange={e => setShippingInfo({...shippingInfo, province: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all" />
                  <input type="text" placeholder="Quận / Huyện" value={shippingInfo.district} onChange={e => setShippingInfo({...shippingInfo, district: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all" />
                  <input type="text" placeholder="Phường / Xã" value={shippingInfo.ward} onChange={e => setShippingInfo({...shippingInfo, ward: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ cụ thể (Số nhà, đường...) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required placeholder="VD: 123 Đường Nguyễn Huệ"
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ghi chú vận chuyển</label>
                  <textarea 
                    placeholder="Giao giờ hành chính, gọi điện trước khi đến..."
                    rows="2"
                    value={shippingInfo.note}
                    onChange={e => setShippingInfo({...shippingInfo, note: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-xs font-bold focus:outline-none focus:border-brand focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.div>

            {/* 2. HÌNH THỨC VẬN CHUYỂN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-brand" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">2. Hình thức vận chuyển</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`relative flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-brand bg-brand-light/10' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-4 h-4 accent-brand" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 uppercase mb-0.5 leading-none">Tiêu chuẩn (Giao hàng tiết kiệm)</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nhận sau 2-4 ngày làm việc</p>
                  </div>
                  <span className="ml-auto font-black text-brand text-xs">{subtotal >= freeShipThreshold ? 'FREE' : '35.000đ'}</span>
                </label>

                <label className={`relative flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-brand bg-brand-light/10' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-4 h-4 accent-brand" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 uppercase mb-0.5 leading-none">Hỏa tốc 2H</p>
                    <p className="text-[10px] text-brand font-bold uppercase italic">Nhận hàng ngay trong ngày</p>
                  </div>
                  <span className="ml-auto font-black text-gray-900 text-xs">+{formatPrice(subtotal >= freeShipThreshold ? 25000 : 60000)}</span>
                </label>
              </div>
            </motion.div>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-brand" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">3. Phương thức thanh toán</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'cod', name: 'Tiền mặt', icon: <Coins size={16} />, desc: 'Thanh toán COD khi nhận hàng' },
                  { id: 'qr', name: 'Chuyển khoản', icon: <CreditCard size={16} />, desc: 'Quét mã chuyển khoản QR' },
                  { id: 'momo', name: 'Ví điện tử', icon: <Wallet size={16} />, desc: 'Cổng MoMo / ZaloPay' }
                ].map((method) => (
                  <label 
                    key={method.id}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-brand bg-brand-light/10' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="w-4 h-4 accent-brand" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-900 uppercase mb-0.5 truncate leading-none">{method.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold truncate uppercase">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* 4. YÊU CẦU VAT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                <input 
                  type="checkbox" checked={isVatRequested} onChange={e => setIsVatRequested(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand accent-brand"
                />
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400 group-hover:text-brand transition-colors" />
                  <span className="text-xs font-black text-gray-900 uppercase tracking-tight">Yêu cầu xuất hóa đơn VAT (10%)</span>
                </div>
              </label>

              {isVatRequested && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50 mt-4 animate-in fade-in duration-200">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên công ty / Doanh nghiệp</label>
                    <input type="text" placeholder="Công ty TNHH PLMART Việt Nam" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã số thuế</label>
                    <input type="text" placeholder="0312345678" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ đăng ký doanh nghiệp</label>
                    <input type="text" placeholder="Số nhà, tên đường..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (4/12) */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-28">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <ShoppingCart size={18} className="text-brand" /> Đơn hàng
                  </h2>
                  <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">{cartItems.length} Món</span>
                </div>
                
                <div className="space-y-4 max-h-[220px] overflow-y-auto no-scrollbar pr-1 divide-y divide-gray-50">
                  {cartItems.map((item, idx) => (
                    <div key={item.id} className="flex gap-3 pt-3 first:pt-0 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h3 className="text-[11px] font-extrabold text-gray-800 line-clamp-1 uppercase leading-none">{item.name}</h3>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">SL: {item.quantity}</p>
                        <p className="text-xs font-black text-brand mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VOUCHER PREVIEW */}
              {appliedCoupon && (
                <div className="bg-brand-light/10 border border-brand/10 p-3 rounded-2xl flex items-center gap-2.5">
                  <Ticket size={16} className="text-brand" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-brand uppercase tracking-wider">Đã áp dụng mã {appliedCoupon.code}</p>
                    <p className="text-[9px] text-gray-400 font-bold truncate uppercase">{appliedCoupon.description}</p>
                  </div>
                </div>
              )}

              {/* FINANCIALS */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-500 font-semibold">
                <div className="flex justify-between uppercase tracking-wider text-[11px]">
                  <span>Tổng tiền hàng thô:</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between uppercase tracking-wider text-[11px]">
                  <span>Phí vận chuyển:</span>
                  <span className="text-gray-900">{formatPrice(finalShippingCost)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100/50 uppercase tracking-wider text-[10px] font-bold">
                    <span>Mã giảm giá giảm:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {isVatRequested && (
                  <div className="flex justify-between uppercase tracking-wider text-[11px]">
                    <span>Thuế VAT (10%):</span>
                    <span className="text-gray-900">{formatPrice(vatAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-150 text-gray-900 font-black">
                  <span className="text-sm uppercase tracking-tight">Tổng thanh toán:</span>
                  <span className="text-xl text-brand tracking-tighter">{formatPrice(total)}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="space-y-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isEmailNotified} 
                    onChange={e => setIsEmailNotified(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand accent-brand"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nhận thông báo qua Email</span>
                </label>

                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-brand/10 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} /> Xác nhận đặt hàng
                </button>
                <Link 
                  to="/cart"
                  className="w-full flex items-center justify-center gap-1 text-[9px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                >
                  <ChevronLeft size={14} /> Quay về giỏ hàng
                </Link>
              </div>

              {/* SECURITY TRUST BADGES */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50 text-[10px] text-center font-bold text-gray-400">
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                  <ShieldCheck size={14} className="text-green-600 mb-1" />
                  <p className="uppercase tracking-tighter text-[9px]">Bảo mật SSL</p>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                  <CheckCircle2 size={14} className="text-blue-600 mb-1" />
                  <p className="uppercase tracking-tighter text-[9px]">Chính hãng</p>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                  <AlertCircle size={14} className="text-orange-600 mb-1" />
                  <p className="uppercase tracking-tighter text-[9px]">Đổi trả 7 ngày</p>
                </div>
              </div>
            </motion.div>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
