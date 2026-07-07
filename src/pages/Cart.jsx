import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Trash2, Plus, Minus, ChevronRight, ShieldCheck, Truck, 
  ShoppingCart, CheckCircle2, AlertCircle, Ticket, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';

const Cart = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
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
      confirmLabel: config.confirmLabel || 'Xác nhận',
      onConfirm: config.onConfirm || (() => {})
    });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  // 1. STATE SẢN PHẨM TRONG GIỎ (Đọc từ localStorage)
  const [cartItems, setCartItems] = useState(() => {
    const defaultItems = [
      { 
        id: 1, 
        name: 'Bộ Chăn Ga Gối Cotton Cao Cấp Thắng Lợi - Mint', 
        price: 1250000, 
        quantity: 1, 
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
        category: 'Chăn Ga Gối',
        variant: 'Size: 1m8 x 2m',
        stock: 5
      },
      { 
        id: 2, 
        name: 'Gối Cao Su Non Lượn Sóng Massage Cổ', 
        price: 250000, 
        quantity: 2, 
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80',
        category: 'Gối',
        variant: 'Màu: Trắng',
        stock: 10
      },
      { 
        id: 3, 
        name: 'Chiếu Điều Hòa Latex Cao Su Non', 
        price: 350000, 
        quantity: 1, 
        image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400&q=80',
        category: 'Chiếu',
        variant: 'Màu: Ghi Xám',
        stock: 10
      },
      { 
        id: 4, 
        name: 'Mùng Chụp Tự Bung Đỉnh Rộng Đô Thành 1m8', 
        price: 220000, 
        quantity: 1, 
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500&q=80',
        category: 'Mùng',
        variant: 'Màu: Hồng',
        stock: 15
      },
      { 
        id: 5, 
        name: 'Topper Nệm Memory Foam Thắng Lợi', 
        price: 1850000, 
        quantity: 1, 
        image: 'https://images.unsplash.com/photo-1616047000311-5e0e82690e7a?w=500&q=80',
        category: 'Topper',
        variant: 'Độ dày: 5cm',
        stock: 3
      },
      { 
        id: 6, 
        name: 'Võng Xếp Dã Ngoại Siêu Nhẹ Khung Thép', 
        price: 450000, 
        quantity: 1, 
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80',
        category: 'Võng',
        variant: 'Màu: Xanh Rêu',
        stock: 8
      }
    ];

    try {
      const saved = localStorage.getItem('plmart_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length >= 6) return parsed;
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    
    localStorage.setItem('plmart_cart', JSON.stringify(defaultItems));
    return defaultItems;
  });

  // Đồng bộ giỏ hàng và bắn sự kiện update badge
  useEffect(() => {
    localStorage.setItem('plmart_cart', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('plmart_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Danh sách voucher có sẵn hệ thống
  const availableVouchers = [
    { code: 'FREESHIP', description: 'Miễn phí ship đơn từ 1.5M', minSubtotal: 1500000, discountType: 'shipping', value: 35000 },
    { code: 'GIAM50K', description: 'Giảm ngay 50.000đ cho mọi đơn', minSubtotal: 0, discountType: 'fixed', value: 50000 },
    { code: 'BEDDING100', description: 'Giảm 100.000đ đơn từ 4.0M', minSubtotal: 4000000, discountType: 'fixed', value: 100000 }
  ];

  // 2. LOGIC XỬ LÝ SẢN PHẨM
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
        addToast('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
      }
    });
  };

  // 3. TÍNH TOÁN CHI PHÍ CHI TIẾT
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShipThreshold = 2000000;

  // Tính toán giảm giá từ voucher
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.discountType === 'fixed') {
    if (subtotal >= appliedCoupon.minSubtotal) {
      discountAmount = appliedCoupon.value;
    } else {
      localStorage.removeItem('plmart_coupon');
      setAppliedCoupon(null);
      addToast(`Đã gỡ mã ${appliedCoupon.code} vì tổng giá trị giỏ hàng không đủ điều kiện!`, 'warning');
    }
  }

  const totalPayment = Math.max(0, subtotal - discountAmount);

  // Xử lý áp dụng voucher
  const handleApplyCoupon = (code) => {
    const targetCode = code || couponCode;
    if (!targetCode.trim()) {
      addToast('Vui lòng nhập mã giảm giá', 'warning');
      return;
    }
    const found = availableVouchers.find(v => v.code.toUpperCase() === targetCode.toUpperCase());
    
    if (!found) {
      addToast('Mã giảm giá không tồn tại hoặc đã hết hạn!', 'error');
      return;
    }
    if (subtotal < found.minSubtotal) {
      addToast(`Mã này chỉ áp dụng cho đơn hàng từ ${formatPrice(found.minSubtotal)} trở lên!`, 'error');
      return;
    }
    
    setAppliedCoupon(found);
    setCouponCode(found.code);
    localStorage.setItem('plmart_coupon', JSON.stringify(found));
    addToast(`Áp dụng mã ${found.code} thành công!`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('plmart_coupon');
    addToast('Đã hủy áp dụng mã giảm giá!', 'info');
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-inter text-gray-700 flex flex-col text-xs sm:text-sm">
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

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Sleek Stepper Progress Indicator */}
        <div className="max-w-xl mx-auto mb-8 flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200/60 pb-5">
          <span className="text-brand flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-black">1</span> Giỏ hàng</span>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">2</span> Thanh toán</span>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-black">3</span> Hoàn tất</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md mx-auto my-16">
            <ShoppingCart size={40} className="mx-auto mb-4 text-gray-300 animate-pulse" />
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-gray-400 mb-6">Hãy quay lại cửa hàng chọn thêm sản phẩm cho gia đình nhé!</p>
            <Link to="/market" className="inline-block bg-brand text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-brand/10">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CỘT TRÁI: DANH SÁCH GIỎ HÀNG (8/12) */}
            <div className="lg:col-span-8 space-y-4 w-full">
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100/80">
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-gray-100">
                   <h2 className="text-base font-black text-gray-900 flex items-center gap-2.5 uppercase tracking-tighter">
                     <ShoppingCart size={18} className="text-brand" /> Giỏ hàng ({cartItems.length} sản phẩm)
                   </h2>
                </div>

                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto pr-6 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4.5 first:pt-0 last:pb-0 group">
                      {/* Ảnh nhỏ hơn chút, tinh giản */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-xs">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                      </div>

                      {/* Chi tiết thông tin gọn gàng */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-snug hover:text-brand transition-colors uppercase tracking-tight line-clamp-2">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <span className="inline-block text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase mt-1">
                                  {item.variant}
                                </span>
                              )}
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeItem(item.id)} 
                              className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400 font-semibold">
                            <span>Đơn giá: <b className="text-gray-600 font-bold">{formatPrice(item.price)}</b></span>
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-black uppercase">Còn lại: {item.stock}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-1.5 border-t border-gray-50/50">
                          {/* Nút cộng trừ mỏng nhẹ hơn */}
                          <div className="flex items-center bg-gray-50 border border-gray-200/60 rounded-xl p-0.5 shadow-xs">
                            <button 
                              type="button" 
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.id, -1)} 
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand disabled:opacity-30 transition-all active:scale-95"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-gray-900">{item.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.id, 1)} 
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand transition-all active:scale-95"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-gray-400 block font-bold uppercase tracking-wider">Thành tiền</span>
                            <span className="text-sm font-black text-brand">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: TỔNG KẾT & THANH TOÁN (4/12) */}
            <div className="lg:col-span-4 w-full space-y-4 sticky top-28">
              
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h2 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 uppercase tracking-tighter">Tóm tắt giỏ hàng</h2>

                {/* Thanh Freeship mảnh nhẹ */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-normal ${subtotal >= freeShipThreshold ? 'border-green-100 bg-green-50/20 text-green-700' : 'border-amber-100 bg-amber-50/20 text-amber-700'}`}>
                  {subtotal >= freeShipThreshold ? (
                    <p className="font-bold flex items-center gap-1.5"><Truck size={14} className="text-green-600 animate-bounce" /> Đơn hàng đã được FREESHIP tiêu chuẩn.</p>
                  ) : (
                    <div>
                      <p className="mb-1.5 font-bold">Mua thêm <span className="font-black text-amber-600">{formatPrice(freeShipThreshold - subtotal)}</span> để được Freeship.</p>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Áp dụng Voucher gọn gàng */}
                <div className="space-y-2.5">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã giảm giá (Voucher)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Nhập mã..." 
                        value={couponCode} 
                        onChange={e => setCouponCode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand uppercase font-black"
                      />
                    </div>
                    {appliedCoupon ? (
                      <button type="button" onClick={handleRemoveCoupon} className="bg-red-50 text-red-600 border border-red-100 px-3.5 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-100 transition-all">Gỡ</button>
                    ) : (
                      <button type="button" onClick={() => handleApplyCoupon()} className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase hover:bg-brand transition-all">Dùng</button>
                    )}
                  </div>

                  {/* List Voucher gợi ý dạng nút Badge nhỏ gọn */}
                  <div className="pt-2 space-y-1.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ưu đãi hiện có</p>
                    {availableVouchers.map((v) => (
                      <div key={v.code} className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-100 text-xs">
                        <div className="min-w-0">
                          <span className="font-black text-brand bg-brand-light px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{v.code}</span>
                          <span className="ml-1.5 text-gray-500 text-[10px] font-semibold block mt-1">{v.description}</span>
                        </div>
                        <button 
                          type="button" 
                          disabled={subtotal < v.minSubtotal}
                          onClick={() => handleApplyCoupon(v.code)}
                          className="text-brand font-black hover:underline disabled:opacity-30 disabled:no-underline text-xs shrink-0 pl-2"
                        >
                          {appliedCoupon?.code === v.code ? 'Đang dùng' : 'Áp dụng'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Tóm tắt chi phí thô và tạm tính */}
                <div className="space-y-2.5 text-xs text-gray-500 font-semibold">
                  <div className="flex justify-between items-center">
                    <span>Tạm tính tiền hàng:</span>
                    <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-red-500 bg-red-50 px-2 py-1.5 rounded-lg border border-red-100/50">
                      <span>Mã giảm giá ({appliedCoupon.code}):</span>
                      <span className="font-black">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {appliedCoupon && appliedCoupon.discountType === 'shipping' && (
                    <div className="text-[9px] text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100/50 font-black uppercase tracking-wider">
                      Mã freeship: {appliedCoupon.description} (Áp dụng ở thanh toán)
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-150 text-gray-900 font-black">
                    <span className="text-xs uppercase tracking-tight">Tạm tính thanh toán:</span>
                    <span className="text-base text-brand font-black leading-none">{formatPrice(totalPayment)}</span>
                  </div>
                </div>

                {/* Nút hành động chính */}
                <div className="space-y-3 pt-1">
                  <button 
                    type="button" 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-brand text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand/10 active:scale-[0.99]"
                  >
                    Tiến hành thanh toán <ChevronRight size={14} />
                  </button>

                  <Link 
                    to="/market"
                    className="flex items-center justify-center gap-1.5 text-[9px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft size={12} /> Tiếp tục mua sắm
                  </Link>
                </div>

                {/* Trust Seals */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50 text-[10px] text-center font-bold text-gray-400">
                  <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                    <ShieldCheck size={12} className="text-green-600 mb-1" />
                    <p className="uppercase tracking-tighter text-[8px]">Bảo mật</p>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                    <CheckCircle2 size={12} className="text-blue-600 mb-1" />
                    <p className="uppercase tracking-tighter text-[8px]">Chính hãng</p>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                    <AlertCircle size={12} className="text-orange-600 mb-1" />
                    <p className="uppercase tracking-tighter text-[8px]">Đổi trả</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;