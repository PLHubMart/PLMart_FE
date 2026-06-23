import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, X, MapPinned, Loader2 } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { useAddresses } from '../../hooks/useAddresses';

const Addresses = () => {
  const { addresses, loading, addAddress, deleteAddress, setAsDefault } = useAddresses();
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const [newAddress, setNewAddress] = useState({
    receiver: '',
    phone: '',
    type: 'Nhà riêng',
    detail: '',
    isDefault: false
  });

  const getAddressIcon = (type) => {
    if (type === 'Văn phòng') return <Briefcase size={16} />;
    return <Home size={16} />;
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowModal(false);
    setNewAddress({ receiver: '', phone: '', type: 'Nhà riêng', detail: '', isDefault: false });
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    deleteAddress(confirmModal.id);
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        type="danger"
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này khỏi sổ địa chỉ không?"
        confirmLabel="Xóa ngay"
      />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand">
              <MapPinned size={20} />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Sổ địa chỉ</h3>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/10"
          >
            <Plus size={16} className="mr-1.5" /> Thêm địa chỉ mới
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 size={32} className="animate-spin text-brand mb-2" />
            <p className="font-semibold text-xs uppercase tracking-widest">Đang tải sổ địa chỉ...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
            <MapPin size={48} className="opacity-20 mb-4" />
            <p className="font-bold text-gray-500 mb-1">Chưa có địa chỉ nào được lưu</p>
            <p className="text-xs text-gray-400 mb-4">Thêm địa chỉ giao hàng để đặt hàng nhanh hơn</p>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold transition-all hover:bg-brand/90 shadow-md"
            >
              Thêm địa chỉ ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className={`p-6 rounded-2xl border-2 transition-all group ${addr.isDefault ? 'border-brand bg-brand-light/20 shadow-md shadow-brand/5' : 'border-gray-50 bg-white hover:border-gray-100'}`}>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl ${addr.isDefault ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {getAddressIcon(addr.type)}
                    </span>
                    <div>
                      <p className="font-black text-sm text-gray-900 leading-none mb-1">{addr.type}</p>
                      {addr.isDefault && (
                        <span className="text-[9px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Mặc định</span>
                      )}
                    </div>
                  </div>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleDeleteClick(addr.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 mb-5">
                  <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{addr.receiver}</p>
                  <p className="text-xs text-brand font-bold">{addr.phone}</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-2 italic">"{addr.detail}"</p>
                </div>
                
                {!addr.isDefault && (
                  <button 
                    onClick={() => setAsDefault(addr.id)}
                    className="w-full py-2 bg-gray-50 text-[10px] font-black text-gray-400 hover:text-brand hover:bg-brand-light rounded-lg uppercase tracking-widest transition-all"
                  >
                    Đặt làm mặc định
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-brand text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={24} />
                <h2 className="text-xl font-black uppercase tracking-tighter">Thêm địa chỉ giao hàng</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddAddress} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Người nhận</label>
                  <input 
                    required
                    type="text"
                    value={newAddress.receiver}
                    onChange={(e) => setNewAddress({...newAddress, receiver: e.target.value})}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input 
                    required
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại địa chỉ</label>
                <div className="flex gap-4">
                  {['Nhà riêng', 'Văn phòng'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress({...newAddress, type})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                        newAddress.type === type 
                        ? 'border-brand bg-brand-light text-brand' 
                        : 'border-gray-50 bg-white text-gray-400 hover:border-gray-100'
                      }`}
                    >
                      {type === 'Nhà riêng' ? <Home size={16} /> : <Briefcase size={16} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ chi tiết</label>
                <textarea 
                  required
                  rows="3"
                  value={newAddress.detail}
                  onChange={(e) => setNewAddress({...newAddress, detail: e.target.value})}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand font-bold text-sm"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                </div>
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-brand transition-colors">Đặt làm mặc định</span>
              </label>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-accent-hover transition-all shadow-xl shadow-accent/20"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
