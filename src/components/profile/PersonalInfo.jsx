import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Edit2, 
  Check, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Lock,
  CircleUser,
  Smartphone
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userApi } from '../../services/userService';

const PersonalInfo = () => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [tempUser, setTempUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Nam',
    birthday: '',
    address: '123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh',
    bio: 'Khách hàng thân thiết của Hồng Hạnh Shop từ năm 2026.'
  });

  // Sync state with AuthContext user when loaded or updated
  useEffect(() => {
    if (user) {
      setTempUser(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        birthday: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
      }));
    }
  }, [user]);

  const handleSave = () => {
    if (!tempUser.fullName.trim()) {
      addToast('Họ và tên không được để trống', 'error');
      return;
    }
    if (!tempUser.phone.trim()) {
      addToast('Số điện thoại không được để trống', 'error');
      return;
    }
    setModalOpen(true);
  };

  const confirmSave = async () => {
    try {
      setModalOpen(false);
      await userApi.updateInfo({
        fullName: tempUser.fullName,
        phoneNumber: tempUser.phone,
        dateOfBirth: tempUser.birthday
      });
      addToast('Cập nhật thông tin thành công!', 'success');
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      addToast(error.message || 'Cập nhật thông tin thất bại!', 'error');
    }
  };

  const handleCancel = () => {
    if (user) {
      setTempUser(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        birthday: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
      }));
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size and extensions
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      addToast('Loại file không hợp lệ. Chỉ cho phép định dạng ảnh (jpg, jpeg, png, gif, webp).', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      addToast('Đang tải ảnh đại diện lên...', 'info', 2000);
      await userApi.updateAvatar(formData);
      addToast('Cập nhật ảnh đại diện thành công!', 'success');
      await refreshUser();
    } catch (error) {
      console.error(error);
      addToast(error.message || 'Cập nhật ảnh đại diện thất bại!', 'error');
    }
  };

  const avatarUrl = user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80';

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <ConfirmModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmSave}
        type="success"
        title="Cập nhật thông tin"
        message="Bạn có chắc chắn muốn lưu các thay đổi này không?"
        confirmLabel="Lưu thay đổi"
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleAvatarChange} 
      />

      {/* 1. Profile Hero Section */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="h-28 bg-gradient-to-r from-brand/90 to-brand-light"></div>
        <div className="px-8 pb-6 -mt-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={handleAvatarClick} 
              className="absolute bottom-2 right-2 bg-brand text-white p-2 rounded-xl shadow-lg hover:bg-accent transition-all border-2 border-white scale-90"
            >
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left mb-2">
            <h2 className="text-2xl font-black text-gray-900 leading-none mb-2">{user?.fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-full">
                {user?.role === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Calendar size={12} /> Gia nhập 06/2026
              </span>
            </div>
          </div>

          <div className="pb-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand/20 transition-all active:scale-95"
              >
                <Edit2 size={16} /> CHỈNH SỬA
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg transition-all">
                  <Check size={16} /> LƯU
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                  <X size={16} /> HỦY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Structured Information Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Side Bio */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CircleUser size={18} className="text-brand" /> Giới thiệu
            </h3>
            {isEditing ? (
              <textarea 
                value={tempUser.bio}
                onChange={(e) => setTempUser({...tempUser, bio: e.target.value})}
                className="w-full text-sm font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3 focus:outline-none focus:border-brand min-h-[120px]"
              />
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed italic">"{tempUser.bio}"</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={18} className="text-brand" /> Xác thực
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400">Email:</span>
                <span className="text-green-500 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg> 
                  Đã xác thực
                </span>
              </li>
              <li className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400">SĐT:</span>
                <span className="text-green-500 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg> 
                  Đã xác thực
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-50">
              <User size={20} className="text-brand" />
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tighter">Thông tin cơ bản</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <DetailItem icon={<User size={16}/>} label="Họ và tên" value={tempUser.fullName} isEditing={isEditing} onChange={(v) => setTempUser({...tempUser, fullName: v})} />
              <DetailItem icon={<Smartphone size={16}/>} label="Giới tính" value={tempUser.gender} isEditing={isEditing} type="select" options={['Nam', 'Nữ', 'Khác']} onChange={(v) => setTempUser({...tempUser, gender: v})} />
              <DetailItem icon={<Calendar size={16}/>} label="Ngày sinh" value={tempUser.birthday} isEditing={isEditing} type="date" onChange={(v) => setTempUser({...tempUser, birthday: v})} />
              <DetailItem icon={<Mail size={16}/>} label="Email liên hệ (Không thể sửa)" value={tempUser.email} isEditing={false} type="email" />
              <DetailItem icon={<Phone size={16}/>} label="Số điện thoại" value={tempUser.phone} isEditing={isEditing} onChange={(v) => setTempUser({...tempUser, phone: v})} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50">
              <DetailItem icon={<MapPin size={16}/>} label="Địa chỉ thường trú" value={tempUser.address} isEditing={isEditing} onChange={(v) => setTempUser({...tempUser, address: v})} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand"><Lock size={20} /></div>
              <div><p className="text-sm font-bold text-gray-900 leading-none">Bảo mật</p><p className="text-xs text-gray-400 mt-1">Đổi mật khẩu định kỳ để an toàn</p></div>
            </div>
            <button className="text-xs font-black text-brand hover:underline uppercase tracking-widest">Thay đổi ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isEditing, onChange, type = "text", options = [] }) => (
  <div className="space-y-1.5 group">
    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5">{icon} {label}</div>
    {isEditing ? (
      <div className="relative">
        {type === 'select' ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand font-bold text-sm text-gray-700 appearance-none">{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand font-bold text-sm text-gray-700" />
        )}
      </div>
    ) : (
      <div className="px-0.5 py-1 font-bold text-gray-800 text-sm break-words leading-tight group-hover:text-brand transition-colors">{value || 'Chưa cập nhật'}</div>
    )}
  </div>
);

export default PersonalInfo;
