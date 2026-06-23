import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Settings,
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Import sub-components
import PersonalInfo from '../components/profile/PersonalInfo';
import OrderHistory from '../components/profile/OrderHistory';
import Addresses from '../components/profile/Addresses';
import Wishlist from '../components/profile/Wishlist';
import ConfirmModal from '../components/ConfirmModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, refreshUser, isLoading } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const avatarUrl = user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80';


  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: <User size={20} /> },
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: <Package size={20} /> },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: <MapPin size={20} /> },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: <Heart size={20} /> },
    { id: 'notifications', label: 'Thông báo', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Cài đặt tài khoản', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <PersonalInfo />;
      case 'orders': return <OrderHistory />;
      case 'addresses': return <Addresses />;
      case 'wishlist': return <Wishlist />;
      default:
        return (
          <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center text-gray-400 border border-gray-100 min-h-[400px]">
            <Settings size={48} className="mb-4 opacity-10 animate-spin-slow" />
            <p className="italic font-medium">Tính năng này đang được phát triển...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-inter text-text-main flex flex-col">
      <Header />

      <ConfirmModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        type="danger"
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản PLMart không?"
        confirmLabel="Đăng xuất ngay"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
              <div className="p-6 bg-brand text-white flex items-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 overflow-hidden">
                  <p className="font-bold truncate">{user.fullName}</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">Khách hàng thân thiết</p>
                </div>
              </div>
              
              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mb-1 ${
                      activeTab === item.id 
                        ? 'bg-brand-light text-brand font-bold' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${activeTab === item.id ? 'text-brand' : 'text-gray-400'} mr-3`}>
                        {item.icon}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={16} />}
                  </button>
                ))}
                <div className="border-t border-gray-50 my-2 pt-2">
                  <button 
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span className="text-sm font-bold">Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
