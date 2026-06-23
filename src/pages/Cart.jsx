import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Trash2, Plus, Minus, ChevronRight, ShieldCheck, Truck, 
  ArrowLeft, ShoppingCart, CheckCircle2, AlertCircle, 
  Ticket, CreditCard, Wallet, Coins, MapPin, User, Phone, 
  FileText, Store, Gift
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const Cart = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'primary',
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const openModal = (config) => {
    setModal({
      isOpen: true,
      type: config.type || 'primary',
      title: config.title || 'Xác nhận',
      message: config.message || '',
      onConfirm: config.onConfirm || (() => {})
    });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  // 1. STATE SẢN PHẨM TRONG GIỎ
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: 'Bộ Chăn Ga Gối Cotton Cao Cấp - Xanh Mint', 
      price: 1250000, 
      quantity: 1, 
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
      category: 'Chăn Ga Gối',
      variant: 'Size: 1m8 x 2m',
      stock: 5
    },
    { 
      id: 2, 
      name: 'Nệm Cao Su Non Kansan 10 Phân 1m6', 
      price: 4800000, 
      quantity: 1, 
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
      category: 'Nệm',
      variant: 'Độ dày: 10cm',
      stock: 2
    },
    { 
      id: 3, 
      name: 'Chiếu Điều Hòa Latex Cao Su Non', 
      price: 350000, 
      quantity: 2, 
      image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400&q=80',
      category: 'Chiếu',
      variant: 'Màu sắc: Ghi Xám',
      stock: 10
    }
  ]);

  // 2. STATE THÔNG TIN KHÁCH HÀNG & ĐƠN HÀNG
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Lưu object voucher được chọn
  const [isVatRequested, setIsVatRequested] = useState(false);
  const [vatInfo, setVatInfo] = useState({ companyName: '', taxCode: '', companyAddress: '' });

  // Danh sách voucher có sẵn của shop hệ thống
  const availableVouchers = [
    { code: 'FREESHIP', description: 'Miễn phí vận chuyển cho đơn từ 1.5 triệu', minSubtotal: 1500000, discountType: 'shipping', value: 35000 },
    { code: 'GIAM50K', description: 'Giảm ngay 50.000đ cho mọi đơn hàng', minSubtotal: 0, discountType: 'fixed', value: 50000 },
    { code: 'BEDDING100', description: 'Giảm 100.000đ cho đơn hàng trên 4 triệu', minSubtotal: 4000000, discountType: 'fixed', value: 100000 }
  ];

  // 3. LOGIC XỬ LÝ SẢN PHẨM
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock && delta > 0) {
          openModal({
            type: 'warning',
            title: 'Hết hàng',
            message: `Sản phẩm này chỉ còn tối đa ${item.stock} sản phẩm trong kho!`,
            confirmLabel: 'Đã hiểu'
          });
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    openModal({
      type: 'danger',
      title: 'Xóa sản phẩm',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      confirmLabel: 'Xóa ngay',
      onConfirm: () => {
        setCartItems(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  // 4. TÍNH TOÁN CHI PHÍ CHI TIẾT
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShipThreshold = 2000000;
  
  // Tính phí vận chuyển gốc
  let baseShippingCost = subtotal >= freeShipThreshold ? 0 : 35000;
  if (shippingMethod === 'express') {
    baseShippingCost += 25000; // Phụ phí hỏa tốc
  }

  // Tính toán giảm giá từ voucher
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
  const vatAmount = isVatRequested ? Math.round(subtotal * 0.1) : 0; // Thuế VAT 10% nếu yêu cầu
  const totalPayment = subtotal + finalShippingCost + vatAmount - discountAmount;

  // Xử lý áp dụng voucher bằng tay
  const handleApplyCoupon = (code) => {
    const targetCode = code || couponCode;
    const found = availableVouchers.find(v => v.code.toUpperCase() === targetCode.toUpperCase());
    
    if (!found) {
      openModal({
        type: 'warning',
        title: 'Mã không hợp lệ',
        message: 'Mã giảm giá không tồn tại hoặc đã hết hạn!',
        confirmLabel: 'Đã hiểu'
      });
      return;
    }
    if (subtotal < found.minSubtotal) {
      openModal({
        type: 'warning',
        title: 'Chưa đủ điều kiện',
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${formatPrice(found.minSubtotal)} trở lên!`,
        confirmLabel: 'Đã hiểu'
      });
      return;
    }
    setAppliedCoupon(found);
    setCouponCode(found.code);
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      openModal({
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng điền đầy đủ thông tin giao hàng bắt buộc (Họ tên, Số điện thoại, Địa chỉ)!',
        confirmLabel: 'Kiểm tra lại'
      });
      return;
    }
    
    // Tạo cấu trúc dữ liệu gửi lên API Backend
    const orderData = {
      items: cartItems,
      shippingAddress: shippingInfo,
      shippingMethod,
      paymentMethod,
      couponUsed: appliedCoupon?.code || null,
      financials: { subtotal, shippingCost: finalShippingCost, discount: discountAmount, vat: vatAmount, totalPayment },
      vatInvoice: isVatRequested ? vatInfo : null,
      createdAt: new Date().toISOString()
    };
    
    console.log("Dữ liệu đơn hàng gửi lên Server:", orderData);
    
    openModal({
      type: 'success',
      title: 'Đặt hàng thành công',
      message: 'Cảm ơn bạn! Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý sớm nhất.',
      confirmLabel: 'Về trang chủ',
      onConfirm: () => navigate('/')
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-700 flex flex-col text-xs sm:text-sm">
      <Header />

      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Đường dẫn Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-400">
           <Link to="/" className="hover:text-brand transition-colors">Trang chủ</Link>
           <ChevronRight size={12} />
           <span className="text-brand font-medium">Xác nhận đơn hàng & Thanh toán</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md mx-auto my-10">
            <ShoppingCart size={40} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Giỏ hàng của bạn đang trống</h2>
            <Link to="/" className="inline-block mt-4 bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase">Quay lại mua sắm</Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: THÔNG TIN CHI TIẾT (7/12) */}
            <div className="lg:col-span-7 space-y-4 w-full">
              
              {/* KHỐI 1: THÔNG TIN GIAO HÀNG (CHI TIẾT NHẤT) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <MapPin size={18} className="text-brand" />
                  <h2 className="text-base font-bold text-gray-900">1. Thông tin người nhận hàng</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên người nhận <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" required placeholder="Nguyễn Văn A"
                        value={shippingInfo.fullName}
                        onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" required placeholder="09xx xxx xxx"
                        value={shippingInfo.phone}
                        onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text" placeholder="Tỉnh / Thành phố" 
                    value={shippingInfo.province} onChange={e => setShippingInfo({...shippingInfo, province: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-brand focus:bg-white"
                  />
                  <input 
                    type="text" placeholder="Quận / Huyện" 
                    value={shippingInfo.district} onChange={e => setShippingInfo({...shippingInfo, district: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-brand focus:bg-white"
                  />
                  <input 
                    type="text" placeholder="Phường / Xã" 
                    value={shippingInfo.ward} onChange={e => setShippingInfo({...shippingInfo, ward: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-brand focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ cụ thể (Số nhà, tên đường...) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required placeholder="Ví dụ: 123 Đường Lê Lợi"
                    value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-brand focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú cho shipper hoặc cửa hàng</label>
                  <textarea 
                    placeholder="Ví dụ: Xin hãy gọi điện trước khi giao, hoặc giao giờ hành chính..." rows="2"
                    value={shippingInfo.note} onChange={e => setShippingInfo({...shippingInfo, note: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:border-brand focus:bg-white"
                  />
                </div>
              </div>

              {/* KHỐI 2: CHI TIẾT DANH SÁCH GIỎ HÀNG */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                   <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                     <ShoppingCart size={18} className="text-brand" /> Danh sách sản phẩm đặt hàng
                   </h2>
                   <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">{cartItems.length} loại mặt hàng</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-brand transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-[11px] text-gray-400 mt-0.5">{item.variant}</p>
                            </div>
                            <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-all shrink-0">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span>Đơn giá: <b className="text-gray-600 font-semibold">{formatPrice(item.price)}</b></span>
                            <span className="text-[10px] text-orange-500 font-medium">(Kho còn: {item.stock})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-brand"><Minus size={11} /></button>
                            <span className="w-7 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-brand"><Plus size={11} /></button>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block">Thành tiền</span>
                            <span className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 3: YÊU CẦU XUẤT HÓA ĐƠN ĐỎ (VAT) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" checked={isVatRequested} 
                    onChange={e => setIsVatRequested(e.target.checked)}
                    className="rounded border-gray-300 text-brand focus:ring-brand accent-brand w-4 h-4"
                  />
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <FileText size={16} className="text-gray-400" />
                    <span>Yêu cầu xuất hóa đơn giá trị gia tăng (VAT 10%)</span>
                  </div>
                </label>

                {isVatRequested && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2.5 animate-in fade-in duration-200">
                    <input 
                      type="text" placeholder="Tên công ty / Doanh nghiệp"
                      value={vatInfo.companyName} onChange={e => setVatInfo({...vatInfo, companyName: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-brand"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input 
                        type="text" placeholder="Mã số thuế"
                        value={vatInfo.taxCode} onChange={e => setVatInfo({...vatInfo, taxCode: e.target.value})}
                        className="w-full sm:col-span-1 bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-brand"
                      />
                      <input 
                        type="text" placeholder="Địa chỉ đăng ký kinh doanh công ty"
                        value={vatInfo.companyAddress} onChange={e => setVatInfo({...vatInfo, companyAddress: e.target.value})}
                        className="w-full sm:col-span-2 bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: THANH TOÁN & VẬN CHUYỂN & VOUCHER (5/12) */}
            <aside className="lg:col-span-5 w-full space-y-4 lg:sticky lg:top-6">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
                <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">Cấu hình đơn hàng</h2>

                {/* Thanh Freeship */}
                <div className={`p-3 rounded-xl border text-xs ${subtotal >= freeShipThreshold ? 'border-green-100 bg-green-50/20 text-green-700' : 'border-amber-100 bg-amber-50/20 text-amber-700'}`}>
                  {subtotal >= freeShipThreshold ? (
                    <p className="font-semibold flex items-center gap-1.5"><Truck size={14} /> Chúc mừng! Đơn hàng được Freeship tiêu chuẩn.</p>
                  ) : (
                    <div>
                      <p className="mb-1">Mua thêm <span className="font-bold text-amber-600">{formatPrice(freeShipThreshold - subtotal)}</span> để nhận ưu đãi Freeship.</p>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%` }}></div></div>
                    </div>
                  )}
                </div>

                {/* 1. PHƯƠNG THỨC VẬN CHUYỂN CHUYÊN NGHIỆP */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Hình thức vận chuyển</label>
                  <div className="space-y-2">
                    <label className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-brand bg-brand-light/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex gap-2 items-center">
                        <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="accent-brand" />
                        <div>
                          <p className="font-bold text-gray-900 text-xs">Giao hàng tiết kiệm (Tiêu chuẩn)</p>
                          <p className="text-[11px] text-gray-400">Nhận hàng sau 2 - 4 ngày vận chuyển</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">{subtotal >= freeShipThreshold ? '0đ' : '35.000đ'}</span>
                    </label>

                    <label className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-brand bg-brand-light/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex gap-2 items-center">
                        <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="accent-brand" />
                        <div>
                          <p className="font-bold text-gray-900 text-xs">Giao hàng hỏa tốc 2H</p>
                          <p className="text-[11px] text-brand font-medium">Nhận hàng ngay trong ngày</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">+{formatPrice(subtotal >= freeShipThreshold ? 25000 : 60000)}</span>
                    </label>
                  </div>
                </div>

                {/* 2. CHỌN MÃ GIẢM GIÁ (CÓ DANH SÁCH GỢI Ý) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Mã giảm giá (Voucher)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" placeholder="Nhập mã voucher cá nhân" 
                        value={couponCode} onChange={e => setCouponCode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand uppercase font-semibold"
                      />
                    </div>
                    <button type="button" onClick={() => handleApplyCoupon()} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand transition-all">Áp dụng</button>
                  </div>

                  {/* Danh sách Voucher hiển thị trực quan để khách Click nhanh */}
                  <div className="pt-2 space-y-1.5">
                    <p className="text-[11px] font-semibold text-gray-400">Voucher dành cho bạn:</p>
                    {availableVouchers.map((v) => (
                      <div key={v.code} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-[11px]">
                        <div>
                          <span className="font-bold text-brand bg-brand-light px-1.5 py-0.5 rounded">{v.code}</span>
                          <span className="ml-1.5 text-gray-500">{v.description}</span>
                        </div>
                        <button 
                          type="button" disabled={subtotal < v.minSubtotal}
                          onClick={() => handleApplyCoupon(v.code)}
                          className="text-brand font-bold hover:underline disabled:opacity-30 disabled:no-underline"
                        >
                          {appliedCoupon?.code === v.code ? 'Đang dùng' : 'Dùng mã'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. PHƯƠNG THỨC THANH TOÁN ĐA DẠNG */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Hình thức thanh toán</label>
                  <div className="space-y-1.5">
                    <label className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand bg-brand-light/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand" />
                      <Coins size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900 text-xs">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                    </label>

                    <label className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-brand bg-brand-light/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="accent-brand" />
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900 text-xs">Chuyển khoản liên ngân hàng qua mã QR Code</span>
                    </label>

                    <label className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-brand bg-brand-light/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="accent-brand" />
                      <Wallet size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900 text-xs">Ví điện tử MoMo / ZaloPay cá nhân</span>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* TÓM TẮT TẤT CẢ CHI PHÍ */}
                <div className="space-y-2 text-xs text-gray-500 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Tổng tiền hàng thô:</span>
                    <span className="text-gray-900 font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển gốc:</span>
                    <span className="text-gray-900 font-semibold">{formatPrice(baseShippingCost)}</span>
                  </div>
                  {shippingDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Giảm giá tiền ship (Voucher):</span>
                      <span>-{formatPrice(shippingDiscount)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && appliedCoupon?.discountType === 'fixed' && (
                    <div className="flex justify-between items-center text-red-500">
                      <span>Giảm giá hóa đơn (Voucher):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {isVatRequested && (
                    <div className="flex justify-between items-center">
                      <span>Thuế giá trị gia tăng VAT (10%):</span>
                      <span className="text-gray-900 font-semibold">{formatPrice(vatAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 text-gray-950 font-bold">
                    <span className="text-sm">Tổng thanh toán sau cùng:</span>
                    <span className="text-xl text-brand font-extrabold tracking-tight">{formatPrice(totalPayment)}</span>
                  </div>
                </div>

                {/* NÚT THỰC THI CHÍNH */}
                <button 
                  type="submit" 
                  className="w-full bg-brand text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Xác nhận gửi đơn hàng <ChevronRight size={16} />
                </button>

                {/* Các tiêu chuẩn an toàn */}
                <div className="flex justify-around pt-1 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                   <div className="flex items-center gap-1"><ShieldCheck size={13} className="text-brand" /> Bảo mật SSL</div>
                   <div className="flex items-center gap-1"><CheckCircle2 size={13} className="text-brand" /> Chính hãng 100%</div>
                   <div className="flex items-center gap-1"><AlertCircle size={13} className="text-brand" /> Đổi trả 7 ngày</div>
                </div>
              </div>
            </aside>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;