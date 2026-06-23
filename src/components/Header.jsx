import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Search, 
  User, 
  Menu, 
  Phone, 
  MapPin, 
  ChevronDown, 
  X,
  Flame
} from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'NỆM & TOPPER',
    sub: ['Nệm Cao Su Non', 'Nệm 3 Phân / 5 Phân', 'Nệm 10 Phân', 'Topper & Tấm Lót']
  },
  {
    id: 2,
    name: 'CHĂN, RA & GỐI',
    sub: ['Ra Trải Nệm (Ga)', 'Chăn & Mền', 'Gối & Bọc Gối', 'Combo Gối Có Sẵn']
  },
  {
    id: 3,
    name: 'CHIẾU, THẢM & MÙNG',
    sub: ['Chiếu Các Loại', 'Mùng (Màn) Ngủ', 'Thảm & Khăn']
  },
  {
    id: 4,
    name: 'ĐỒ ĐI MƯA & PHỤ KIỆN',
    sub: ['Áo Mưa & Đồ Đi Mưa', 'Dù / Ô Che', 'Nón & Phụ Kiện']
  },
  {
    id: 5,
    name: 'GIA DỤNG & DÃ NGOẠI',
    sub: ['Bạt Che', 'Võng & Ghế Xếp']
  }
];

const categoryPromotions = {
  1: {
    tag: "🔥 ƯU ĐÃI ĐỘC QUYỀN",
    text: "Nâng đỡ cột sống vàng, giảm ngay 20% + Tặng kèm 2 gối cao su non cao cấp!"
  },
  2: {
    tag: "🌸 GIẤC NGỦ HOÀNG GIA",
    text: "Cotton Thắng Lợi 100% tự nhiên siêu mát, mua combo giảm sâu đến 30%!"
  },
  3: {
    tag: "❄️ GIẢI NHIỆT MÙA HÈ",
    text: "Chiếu trúc điều hòa làm mát tức thì, bảo vệ giấc ngủ gia đình 24/7."
  },
  4: {
    tag: "🌧️ KHÔNG SỢ MƯA GIÔNG",
    text: "Áo mưa bộ vải dù siêu bền chống thấm 100%, mua 1 tặng 1 dù xếp thời trang!"
  },
  5: {
    tag: "🏕️ CUỐI TUẦN VI VU",
    text: "Võng xếp, ghế xếp dã ngoại siêu nhẹ chịu lực 150kg, ưu đãi giảm ngay 25%!"
  }
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleCategoryClick = (catName, subName = null) => {
    let url = `/market?category=${encodeURIComponent(catName)}`;
    if (subName) {
      url += `&sub=${encodeURIComponent(subName)}`;
    }
    navigate(url);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-brand text-white py-2 px-4 hidden sm:block border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-accent" /> Hotline: 09xx xxx xxx</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-accent" /> 123 Đường ABC, Quận XYZ, TP.HCM</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-accent transition-colors">Đại lý & Sỉ</a>
            <a href="#" className="hover:text-accent transition-colors">Tuyển dụng</a>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Cửa hàng đang mở cửa
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-[100] bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-4">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex flex-col group">
                <span className="text-2xl font-black text-brand leading-none group-hover:text-accent transition-colors">HỒNG HẠNH</span>
                <span className="text-[10px] font-black tracking-[0.25em] text-gray-400">BEDDING & MATTRESS</span>
              </Link>
            </div>
            
            {/* Desktop Search - Expanded */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm nệm cao su, chăn ga, áo mưa..." 
                  className="w-full pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/5 transition-all font-medium text-sm"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand text-white p-2 rounded-lg hover:bg-brand/90 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-5 shrink-0">
              <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group">
                <User size={22} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase mt-1 hidden sm:block tracking-tighter">Tài khoản</span>
              </Link>
              <button className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group relative">
                <Heart size={22} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase mt-1 hidden sm:block tracking-tighter">Yêu thích</span>
              </button>
              <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group relative">
                <div className="relative">
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-accent text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">2</span>
                </div>
                <span className="text-[9px] font-black uppercase mt-1 hidden sm:block tracking-tighter">Giỏ hàng</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-brand bg-brand-light rounded-xl"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop Menu - Professional Categories */}
        <nav className="bg-brand hidden lg:block shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center">
              <li className="mr-6">
                <Link to="/market?filter=sale" className="flex items-center gap-2 py-3.5 px-4 bg-accent text-white font-black text-[11px] uppercase tracking-widest hover:bg-accent-hover transition-all">
                  <Flame size={14} className="animate-bounce" /> KHUYẾN MÃI HOT
                </Link>
              </li>
              {categories.map((cat) => (
                <li 
                  key={cat.id} 
                  className="relative group h-full"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button 
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex items-center gap-1.5 py-4 px-4 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    {cat.name}
                    <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Dropdown */}
                  <div className={`absolute top-full left-0 w-64 bg-white shadow-2xl rounded-b-2xl border-t-4 border-accent p-2 transition-all duration-300 origin-top ${
                    activeDropdown === cat.id ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'
                  }`}>
                    <ul className="py-2">
                      {cat.sub.map((sub, idx) => (
                        <li key={idx}>
                          <button 
                            onClick={() => handleCategoryClick(cat.name, sub)}
                            className="w-full text-left block px-4 py-2.5 text-[11px] font-bold text-gray-600 hover:text-brand hover:bg-brand-light rounded-lg transition-all border-l-2 border-transparent hover:border-brand"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {categoryPromotions[cat.id] && (
                      <div className="mt-2 p-3 bg-brand-light/50 rounded-xl border border-brand/5">
                        <p className="text-[9px] font-black text-brand uppercase mb-1 tracking-wider">
                          {categoryPromotions[cat.id].tag}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold leading-normal italic">
                          {categoryPromotions[cat.id].text}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-md transition-all duration-300 lg:hidden ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className={`absolute top-0 right-0 w-[80%] h-full bg-white shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand leading-none">DANH MỤC</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Hồng Hạnh Shop</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-100 text-gray-400 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <Link to="/market?filter=sale" className="flex items-center gap-3 p-4 bg-accent/10 text-accent rounded-2xl mb-4 font-black text-xs uppercase tracking-widest">
                <Flame size={18} /> KHUYẾN MÃI HOT
              </Link>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-50 pb-2">
                    <button 
                      onClick={() => handleCategoryClick(cat.name)}
                      className="w-full flex items-center justify-between p-3 text-sm font-black text-gray-900 uppercase tracking-tighter"
                    >
                      {cat.name}
                      <ChevronDown size={16} className="text-gray-300" />
                    </button>
                    <div className="pl-4 space-y-1 mb-2">
                      {cat.sub.map((sub, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleCategoryClick(cat.name, sub)}
                          className="w-full text-left block p-2 text-xs font-bold text-gray-500 hover:text-brand"
                        >
                          • {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-white border border-brand/10 flex items-center justify-center text-brand">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand uppercase tracking-widest leading-none mb-1">Tư vấn ngay</p>
                  <p className="text-sm font-black text-gray-900 leading-none">09xx xxx xxx</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
