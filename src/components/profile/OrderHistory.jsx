import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  CreditCard,
  ShoppingBag,
  Calendar,
  ExternalLink
} from 'lucide-react';

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'ORD-20260525-001',
      date: '2026-05-25',
      total: 7245000,
      paymentMethod: 'Visa',
      status: 'Shipping',
      statusLabel: 'Đang giao hàng',
      items: [
        { name: 'Bộ Chăn Ga Gối Cotton - Mint', qty: 1, price: 1250000, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&q=80' },
        { name: 'Nệm Cao Su Thắng Lợi 1m6', qty: 1, price: 4800000, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=80' },
        { name: 'Chiếu Điều Hòa Latex Cao Su', qty: 2, price: 350000, image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=200&q=80' },
        { name: 'Gối Nằm Cao Su Non Chống Đau', qty: 2, price: 185000, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=200&q=80' },
        { name: 'Mùng Chụp Tự Bung Đỉnh Rộng', qty: 1, price: 220000, image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=200&q=80' },
        { name: 'Vỏ Gối Ôm Cotton Thắng Lợi', qty: 2, price: 45000, image: 'https://images.unsplash.com/photo-1629949009765-40f34d955162?w=200&q=80' }
      ],
      tracking: [{ time: '25/05 09:00', note: 'Tài xế đang giao hàng' }]
    },
    {
      id: 'ORD-20260410-042',
      date: '2026-04-10',
      total: 4800000,
      paymentMethod: 'COD',
      status: 'Completed',
      statusLabel: 'Đã hoàn thành',
      items: [{ name: 'Nệm Cao Su Thiên Nhiên Thắng Lợi', qty: 1, price: 4800000, image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=200&q=80' }],
      tracking: [{ time: '12/04 14:00', note: 'Giao hàng thành công' }]
    }
  ];

  const stats = useMemo(() => {
    const totalSpent = orders.filter(o => o.status !== 'Cancelled').reduce((acc, curr) => acc + curr.total, 0);
    return { totalSpent, totalOrders: orders.length, pending: orders.filter(o => o.status === 'Pending').length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, orders]);

  const formatPrice = (p) => p.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="space-y-6 pb-10 max-w-5xl animate-in fade-in duration-500">
      {/* 1. Stats Bar - Size 28ish feel */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Tổng đơn hàng" value={stats.totalOrders} icon={<ShoppingBag size={18} className="text-brand" />} />
        <StatCard label="Tổng chi tiêu" value={formatPrice(stats.totalSpent)} icon={<CreditCard size={18} className="text-orange-500" />} />
        <StatCard label="Đang chờ" value={stats.pending} icon={<Clock size={18} className="text-amber-500" />} />
      </div>

      {/* 2. Control Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-24 z-30">
        <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
          {['All', 'Pending', 'Shipping', 'Completed'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all whitespace-nowrap ${
                activeFilter === id ? 'bg-white text-brand shadow-sm' : 'text-gray-400'
              }`}
            >
              {id === 'All' ? 'Tất cả' : id}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Tìm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-brand/20 focus:bg-white rounded-xl focus:outline-none text-sm font-bold text-gray-700"
          />
        </div>
      </div>

      {/* 3. Orders List - Restored full list but refined */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-brand/20 transition-all">
            {/* Header */}
            <div className="px-6 py-3 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-brand tracking-widest">{order.id}</span>
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                  <Calendar size={14} /> {order.date}
                </span>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                order.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
              }`}>
                {order.statusLabel}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50/50 transition-colors">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-white shadow-sm">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-gray-800 truncate uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">
                        Số lượng: <span className="text-gray-900">{item.qty}</span> • {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-sm font-black text-brand">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Column - Sticky style */}
              <div className="lg:col-span-4 bg-brand-light/20 rounded-2xl p-6 space-y-5 lg:sticky lg:top-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">
                    <span>Thanh toán</span>
                    <span className="text-gray-700">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-[11px] font-black uppercase text-gray-900">Tổng tiền</span>
                    <span className="text-2xl font-black text-brand leading-none">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="w-full bg-brand text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/10">
                    Mua lại đơn này
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-white text-gray-600 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest border border-gray-200 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2"
                  >
                    Xem hóa đơn <ExternalLink size={14} />
                  </button>
                </div>

                <div className="pt-4 border-t border-brand/10">
                   <p className="text-[10px] font-bold text-gray-500 italic">
                     "{order.tracking[0].note}"
                   </p>
                   <p className="text-[9px] text-gray-400 mt-1 uppercase font-black tracking-tighter">{order.tracking[0].time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="px-8 py-5 bg-brand text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Package size={22} />
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider">Chi tiết đơn hàng</h2>
                  <p className="text-[10px] text-white/70 font-semibold">{selectedOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-xs">
              
              {/* Status and Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Trạng thái vận chuyển</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedOrder.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    <span className="font-extrabold text-gray-800 uppercase text-xs">{selectedOrder.statusLabel}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Ngày đặt hàng</p>
                  <p className="font-extrabold text-gray-800">{selectedOrder.date}</p>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pb-1 border-b border-gray-50">Sản phẩm trong đơn</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-b-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-white shrink-0 shadow-sm">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 truncate uppercase tracking-tight">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                          Số lượng: <span className="text-gray-900">{item.qty}</span> • {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-brand text-sm">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Địa chỉ giao hàng</h4>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 space-y-1">
                    <p className="font-black text-gray-800 uppercase tracking-tight">Nguyễn Văn Admin</p>
                    <p className="text-[11px] text-brand font-bold">0987 654 321</p>
                    <p className="text-[11px] text-gray-500 leading-normal italic">"123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh"</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Thông tin thanh toán</h4>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400 font-medium">Phương thức:</span>
                      <span className="font-bold text-gray-700">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-2 border-t border-dashed border-gray-200">
                      <span className="text-gray-900 font-black uppercase">Tổng cộng:</span>
                      <span className="font-black text-brand text-base leading-none">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              {selectedOrder.tracking && selectedOrder.tracking.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-gray-50">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lịch sử vận chuyển</h4>
                  <div className="relative pl-6 border-l-2 border-brand/20 ml-2 py-1 space-y-4">
                    {selectedOrder.tracking.map((track, tIdx) => (
                      <div key={tIdx} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-brand border-4 border-white shadow-sm"></div>
                        <p className="font-black text-gray-800 text-xs">{track.note}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{track.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 shrink-0 flex gap-4">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Đóng lại
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3 bg-brand text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/10"
              >
                In hóa đơn
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-brand/20 transition-all cursor-default">
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{label}</p>
      <p className="text-lg font-black text-gray-900 leading-none truncate">{value}</p>
    </div>
  </div>
);

export default OrderHistory;
