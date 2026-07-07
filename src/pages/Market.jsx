import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Filter, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Heart, 
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  X,
  RotateCcw,
  Eye,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductSkeleton = ({ viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden p-3 flex flex-col justify-between h-full animate-pulse">
        <div>
          <div className="relative aspect-square rounded-xl bg-gray-200 mb-4"></div>
          <div className="h-3 bg-brand/15 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-1.5"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        </div>
        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-brand/20 rounded w-20"></div>
            <div className="h-3 bg-gray-100 rounded w-12"></div>
          </div>
          <div className="flex items-center justify-between pb-1">
            <div className="h-3 bg-gray-100 rounded w-10"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
          </div>
          <div className="h-9 bg-gray-100 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-row gap-5 items-center w-full animate-pulse">
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-xl shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div>
          <div className="h-3 bg-brand/15 rounded w-16 mb-1.5"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-1.5"></div>
          <div className="hidden sm:block h-3 bg-gray-100 rounded w-5/6 mb-1"></div>
          <div className="hidden sm:block h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-100 rounded w-12"></div>
          <div className="h-3 bg-gray-100 rounded w-8"></div>
        </div>
        <div className="flex items-end justify-between gap-2 mt-4 sm:mt-2">
          <div className="space-y-1">
            <div className="h-5 bg-brand/20 rounded w-24"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
          </div>
          <div className="h-9 bg-brand rounded-xl w-10 sm:w-32"></div>
        </div>
      </div>
    </div>
  );
};

const Market = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const initialCategory = queryParams.get('category');
  const initialSub = queryParams.get('sub');
  const initialSearch = queryParams.get('search');
  const initialFilter = queryParams.get('filter');

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Tất cả');
  const [selectedSub, setSelectedSub] = useState(initialSub || null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'list'
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const allProducts = [
    { id: 1, name: 'Nệm Cao Su Non Thắng Lợi Cao Cấp Cực Êm', category: 'NỆM & TOPPER', sub: 'Nệm Cao Su Non', price: 1250000, oldPrice: 1500000, rating: 5, reviews: 128, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', isSale: true, desc: 'Chất liệu cao su non nguyên khối nâng đỡ cột sống tối đa, thoáng khí 2 mặt mang lại giấc ngủ sâu.', stock: 'Còn hàng' },
    { id: 2, name: 'Bộ Chăn Ga Gối Cotton Thắng Lợi Hàn Quốc', category: 'CHĂN, RA & GỐI', sub: 'Ra Trải Nệm (Ga)', price: 450000, oldPrice: 600000, rating: 4, reviews: 85, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', isSale: false, desc: 'Vải cotton 100% sợi tự nhiên mềm mịn, thấm hút mồ hôi tốt, không bị xù lông khi giặt máy.', stock: 'Còn hàng' },
    { id: 3, name: 'Chiếu Trúc Hạt Đen Điều Hòa Xuất Khẩu Loại 1', category: 'CHIẾU, THẢM & MÙNG', sub: 'Chiếu Các Loại', price: 380000, oldPrice: 450000, rating: 5, reviews: 42, image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500&q=80', isSale: true, desc: 'Hạt trúc bóng mịn, liên kết bằng dây cước dẻo dai chắc chắn, làm mát cơ thể nhanh chóng.', stock: 'Còn 5 sản phẩm' },
    { id: 4, name: 'Mùng Chụp Tự Bung Đỉnh Rộng Đô Thành 1m8', category: 'CHIẾU, THẢM & MÙNG', sub: 'Mùng (Màn) Ngủ', price: 220000, oldPrice: 300000, rating: 4, reviews: 56, image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500&q=80', isSale: false, desc: 'Khung thép dẻo định hình ổn định, màn tuyn dày chống muỗi tuyệt đối, dễ dàng xếp gọn gàng.', stock: 'Còn hàng' },
    { id: 5, name: 'Áo Mưa Bộ Vải Dù Siêu Bền Thành Nam', category: 'ĐỒ ĐI MƯA & PHỤ KIỆN', sub: 'Áo Mưa & Đồ Đi Mưa', price: 185000, oldPrice: 250000, rating: 5, reviews: 94, image: 'https://images.unsplash.com/photo-1531256379416-9f000e90aacc?w=400&q=80', isSale: true, desc: 'Vải dù siêu nhẹ chống thấm nước, đường may ép sim công nghệ cao ngăn rỉ nước tuyệt đối.', stock: 'Còn hàng' },
    { id: 6, name: 'Dù Xếp Gọn Khung Thép Cường Lực Chống UV', category: 'ĐỒ ĐI MƯA & PHỤ KIỆN', sub: 'Dù / Ô Che', price: 95000, oldPrice: 120000, rating: 4, reviews: 37, image: 'https://images.unsplash.com/photo-1522201949034-507737bce461?w=400&q=80', isSale: false, desc: 'Lớp phủ nano bạc chống tia UV đến 99%, nút bấm tự động 2 chiều tiện lợi khi di chuyển.', stock: 'Chỉ còn 3 sản phẩm' },
    { id: 7, name: 'Nệm Lò Xo Túi Độc Lập Cao Cấp Vạn Thành', category: 'NỆM & TOPPER', sub: 'Nệm 10 Phân', price: 6800000, oldPrice: 7500000, rating: 5, reviews: 112, image: 'https://plus.unsplash.com/premium_photo-1661765778256-169bf5e561a6?w=500&q=80', isSale: true, desc: 'Hệ thống lò xo túi độc lập cách ly chuyển động tốt, không gây tiếng động ảnh hưởng người nằm cạnh.', stock: 'Còn hàng' },
    { id: 8, name: 'Topper Làm Mềm Nệm Khách Sạn 5 Sao', category: 'NỆM & TOPPER', sub: 'Topper & Tấm Lót', price: 850000, oldPrice: 1100000, rating: 4, reviews: 29, image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=500&q=80', isSale: false, desc: 'Ruột bông microfiber siêu mịn dày dặn, bọc cotton kháng khuẩn êm ái như resort.', stock: 'Còn hàng' },
    { id: 9, name: 'Nệm Cao Su Thiên Nhiên Liên Á Classic 10cm', category: 'NỆM & TOPPER', sub: 'Nệm 10 Phân', price: 9200000, oldPrice: 10500000, rating: 5, reviews: 145, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', isSale: true, desc: '100% từ mủ cao su thiên nhiên tinh khiết, cấu trúc hàng triệu lỗ thông hơi tổ ong siêu mát mẻ.', stock: 'Còn hàng' },
    { id: 10, name: 'Gối Cao Su Non Lượn Sóng Massage Cổ', category: 'CHĂN, RA & GỐI', sub: 'Gối & Bọc Gối', price: 250000, oldPrice: 350000, rating: 5, reviews: 67, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80', isSale: true, desc: 'Thiết kế định hình công thái học chống đau vai gáy, gai massage tăng cường tuần hoàn máu.', stock: 'Còn hàng' },
    { id: 11, name: 'Chăn Phao Siêu Nhẹ 4 Mùa Họa Tiết Độc Đáo', category: 'CHĂN, RA & GỐI', sub: 'Chăn & Mền', price: 550000, oldPrice: 750000, rating: 4, reviews: 38, image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=500&q=80', isSale: false, desc: 'Bông tấm giữ nhiệt tốt, siêu nhẹ, giặt máy thoải mái không lo dồn cục bông.', stock: 'Còn hàng' },
    { id: 12, name: 'Chiếu Mây Điều Hòa Tự Nhiên Có Chun Cài Góc', category: 'CHIẾU, THẢM & MÙNG', sub: 'Chiếu Các Loại', price: 320000, oldPrice: 450000, rating: 5, reviews: 49, image: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500&q=80', isSale: true, desc: 'Mặt chiếu đan từ sợi mây tự nhiên bền đẹp, mặt dưới lót lưới 3D thông thoáng khí cực tốt.', stock: 'Còn hàng' },
    { id: 13, name: 'Ghế Xếp Dã Ngoại Hợp Kim Nhôm Siêu Gọn', category: 'GIA DỤNG & DÃ NGOẠI', sub: 'Võng & Ghế Xếp', price: 290000, oldPrice: 420000, rating: 5, reviews: 22, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80', isSale: false, desc: 'Vải lưới oxford chịu lực 120kg, dễ dàng xếp gọn trong túi vải mang đi cắm trại thuận tiện.', stock: 'Còn hàng' },
    { id: 14, name: 'Bạt Che Nắng Mưa Khổ Lớn Dày 3 Lớp', category: 'GIA DỤNG & DÃ NGOẠI', sub: 'Bạt Che', price: 150000, oldPrice: 220000, rating: 4, reviews: 14, image: 'https://images.unsplash.com/photo-1490633874781-1c63cc424610?w=500&q=80', isSale: false, desc: 'Bạt phủ hai mặt chống thấm chịu nhiệt tốt, đục lỗ sẵn các góc để căng dây dễ dàng.', stock: 'Còn hàng' },
    { id: 15, name: 'Nón Bảo Hiểm Sơn Nhám Phiên Bản Giới Hạn', category: 'ĐỒ ĐI MƯA & PHỤ KIỆN', sub: 'Nón & Phụ Kiện', price: 250000, oldPrice: 380000, rating: 5, reviews: 31, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80', isSale: true, desc: 'Vỏ nhựa ABS nguyên sinh chịu va đập mạnh, quai cài chắc chắn đạt chuẩn kiểm định an toàn.', stock: 'Chỉ còn 2 sản phẩm' },
    { id: 16, name: 'Combo 2 Ruột Gối Hơi Cao Cấp Ép Chân Không', category: 'CHĂN, RA & GỐI', sub: 'Combo Gối Có Sẵn', price: 180000, oldPrice: 280000, rating: 5, reviews: 79, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80', isSale: true, desc: 'Bông gòn nhân tạo đàn hồi cao chống xẹp, thiết kế có khóa kéo tự điều chỉnh độ cao gối.', stock: 'Còn hàng' },
    { id: 17, name: 'Nệm Bông Ép Kháng Khuẩn Gấp 3 Đô Thành', category: 'NỆM & TOPPER', sub: 'Nệm 3 Phân / 5 Phân', price: 1450000, oldPrice: 1900000, rating: 4, reviews: 43, image: 'https://plus.unsplash.com/premium_photo-1661765778256-169bf5e561a6?w=500&q=80', isSale: false, desc: 'Sợi bông tinh khiết ép cách nhiệt phẳng phiu, thiết kế gấp 3 tiết kiệm diện tích tối đa.', stock: 'Còn hàng' },
    { id: 18, name: 'Ra Bọc Giường Cotton Satin Lụa Nhật Bản', category: 'CHĂN, RA & GỐI', sub: 'Ra Trải Nệm (Ga)', price: 750000, oldPrice: 950000, rating: 5, reviews: 52, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', isSale: false, desc: 'Sự kết hợp hoàn hảo giữa cotton thoáng mát và satin lụa óng ả mềm mịn cho da.', stock: 'Còn hàng' },
    { id: 19, name: 'Võng Dù Người Lớn 2 Lớp Siêu Dày Chắc Chắn', category: 'GIA DỤNG & DÃ NGOẠI', sub: 'Võng & Ghế Xếp', price: 120000, oldPrice: 170000, rating: 4, reviews: 19, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80', isSale: true, desc: 'Vải dù 2 lớp chịu tải lên đến 150kg, đi kèm sẵn dây buộc võng chuyên dụng siêu bền.', stock: 'Còn hàng' },
    { id: 20, name: 'Thảm Chùi Chân San Hô Siêu Thấm Hút Nước', category: 'CHIẾU, THẢM & MÙNG', sub: 'Thảm & Khăn', price: 45000, oldPrice: 75000, rating: 5, reviews: 110, image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=500&q=80', isSale: true, desc: 'Sợi microfiber mềm mại hút nước cực nhanh, mặt dưới lót cao su chống trơn trượt.', stock: 'Còn hàng' },
  ];

  const categories = [
    { name: 'Tất cả', count: allProducts.length },
    { name: 'NỆM & TOPPER', sub: ['Nệm Cao Su Non', 'Nệm 3 Phân / 5 Phân', 'Nệm 10 Phân', 'Topper & Tấm Lót'] },
    { name: 'CHĂN, RA & GỐI', sub: ['Ra Trải Nệm (Ga)', 'Chăn & Mền', 'Gối & Bọc Gối', 'Combo Gối Có Sẵn'] },
    { name: 'CHIẾU, THẢM & MÙNG', sub: ['Chiếu Các Loại', 'Mùng (Màn) Ngủ', 'Thảm & Khăn'] },
    { name: 'ĐỒ ĐI MƯA & PHỤ KIỆN', sub: ['Áo Mưa & Đồ Đi Mưa', 'Dù / Ô Che', 'Nón & Phụ Kiện'] },
    { name: 'GIA DỤNG & DÃ NGOẠI', sub: ['Bạt Che', 'Võng & Ghế Xếp'] }
  ];

  const handlePriceFilter = (e) => {
    e.preventDefault();
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : 20000000;
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedSub(null);
    setMinPrice('');
    setMaxPrice('');
    setPriceRange([0, 20000000]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSub = !selectedSub || p.sub === selectedSub;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchSearch = !initialSearch || p.name.toLowerCase().includes(initialSearch.toLowerCase());
      const matchFilter = !initialFilter || (initialFilter === 'sale' && p.isSale);
      
      return matchCategory && matchSub && matchPrice && matchSearch && matchFilter;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id;
    });
  }, [selectedCategory, selectedSub, priceRange, sortBy, initialSearch, initialFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedCategory, selectedSub, viewMode]);

  useEffect(() => {
    setSelectedCategory(initialCategory || 'Tất cả');
    setSelectedSub(initialSub || null);
    setCurrentPage(1);
  }, [location.search, initialCategory, initialSub]);

  useEffect(() => {
    setIsLoadingProducts(true);
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSub, priceRange, sortBy, initialSearch, initialFilter]);

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-700 flex flex-col text-sm">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
            <Link to="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <ChevronDown size={12} className="-rotate-90 text-gray-300" />
            <span className="text-brand font-semibold">Cửa hàng</span>
            {selectedCategory !== 'Tất cả' && (
              <>
                <ChevronDown size={12} className="-rotate-90 text-gray-300" />
                <span className="text-gray-500 font-medium">{selectedCategory.toLowerCase()}</span>
              </>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            {initialSearch ? `Kết quả tìm kiếm cho: "${initialSearch}"` : selectedCategory}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* SIDEBAR FILTER */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={16} className="text-brand" /> Bộ lọc nâng cao
                </h3>
                {(selectedCategory !== 'Tất cả' || selectedSub || minPrice || maxPrice) && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-0.5"
                  >
                    <RotateCcw size={12} /> Xóa lọc
                  </button>
                )}
              </div>

              {/* Danh mục */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục hàng hóa</p>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <button 
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setSelectedSub(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center ${
                          selectedCategory === cat.name ? 'bg-brand text-white shadow-sm shadow-brand/10' : 'text-gray-600 hover:bg-gray-100/70'
                        }`}
                      >
                        <span className="truncate">{cat.name === 'Tất cả' ? 'Tất cả sản phẩm' : cat.name}</span>
                        {cat.sub && <ChevronDown size={14} className={`transition-transform duration-200 ${selectedCategory === cat.name ? 'rotate-180' : ''}`} />}
                      </button>
                      
                      <AnimatePresence>
                        {selectedCategory === cat.name && cat.sub && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-2.5 space-y-0.5"
                          >
                            {cat.sub.map(s => (
                              <button 
                                key={s}
                                onClick={() => {
                                  setSelectedSub(s);
                                  setCurrentPage(1);
                                }}
                                className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-all relative flex items-center ${
                                  selectedSub === s ? 'text-brand font-bold bg-brand-light/30' : 'text-gray-400 hover:text-brand hover:bg-gray-50'
                                }`}
                              >
                                <span className="mr-1.5 text-gray-300 font-normal">•</span> {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-50" />

              {/* Lọc giá */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khoảng giá phù hợp (đ)</p>
                <form onSubmit={handlePriceFilter} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" placeholder="Từ giá" value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-brand"
                    />
                    <input 
                      type="number" placeholder="Đến giá" value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-brand"
                    />
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-brand transition-all shadow-sm">Áp dụng giá</button>
                </form>
              </div>
            </div>
          </aside>

          {/* VÙNG SẢN PHẨM PHÍA BÊN PHẢI */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Toolbar sắp xếp & View mode */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 font-medium">Tìm thấy <span className="text-gray-900 font-bold">{filteredProducts.length}</span> sản phẩm</span>
                
                {/* 💡 FIXED: Đã cấu hình hành động onClick chuyển trạng thái viewMode mượt mà */}
                <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-0.5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Dạng lưới nhiều sản phẩm"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Dạng danh sách hàng dọc dài"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button 
                  onClick={() => setIsFilterMobileOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 bg-white"
                >
                  <Filter size={13} /> Bộ lọc
                </button>
                
                <div className="relative group shrink-0">
                  <select 
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="appearance-none bg-gray-50 border border-gray-100 hover:border-brand rounded-xl pl-3 pr-8 py-2 text-xs font-bold focus:outline-none transition-all cursor-pointer text-gray-700"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                    <option value="rating">Đánh giá tốt nhất</option>
                  </select>
                  <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM HOẠT ĐỘNG CHUẨN XÁC THEO VIEW MODE */}
            {isLoadingProducts ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 animate-in fade-in duration-200" : "space-y-3.5 animate-in fade-in duration-200"}>
                {[...Array(8)].map((_, idx) => (
                  <ProductSkeleton key={idx} viewMode={viewMode} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="space-y-6">
                {/* Thiết lập class Grid linh hoạt (Grid: 4 cột trên XL PC, List: Flex dọc block dài) */}
                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4" : "space-y-3.5"}>
                  {paginatedProducts.map((p) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={p.id}
                      onClick={() => navigate(`/product/${p.id}`)}
                      className={`group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row p-4 gap-5 items-center w-full'
                      }`}
                    >
                      {/* Khối hình ảnh thích ứng */}
                      <div className={`relative overflow-hidden bg-gray-50 shrink-0 transition-all duration-300 ${
                        viewMode === 'grid' ? 'aspect-square w-full' : 'w-24 h-24 sm:w-32 sm:h-32 rounded-xl'
                      }`}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out" />
                        
                        {p.isSale && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">SALE</span>
                        )}

                        {viewMode === 'grid' && (
                          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-10">
                            <button 
                              onClick={(e) => { e.stopPropagation(); /* Handle heart */ }}
                              className="w-7 h-7 bg-white text-gray-700 hover:text-red-500 rounded-lg flex items-center justify-center shadow-md transition-all"
                            >
                              <Heart size={13} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
                              className="w-7 h-7 bg-white text-gray-700 hover:text-brand rounded-lg flex items-center justify-center shadow-md transition-all"
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Khối Nội dung chi tiết */}
                      <div className={`flex flex-col justify-between flex-1 ${viewMode === 'grid' ? 'p-3' : 'py-1'}`}>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-brand bg-brand-light/40 px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mb-0.5">{p.category}</span>
                          <h3 className={`font-bold text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2 ${viewMode === 'grid' ? 'text-xs min-h-8' : 'text-sm sm:text-base'}`}>
                            {p.name}
                          </h3>
                          
                          {/* Dạng card dài (List view) hiển thị thêm đoạn mô tả chi tiết và kho hàng */}
                          {viewMode === 'list' && (
                            <div className="hidden sm:block space-y-1.5 py-0.5">
                              <p className="text-xs text-gray-400 line-clamp-2 font-medium leading-relaxed">{p.desc}</p>
                              <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md w-fit">
                                <CheckCircle2 size={12} /> {p.stock}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-1 pt-0.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < p.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-semibold">({p.reviews})</span>
                          </div>
                        </div>

                        {/* Phần Giá tiền và Nút bấm */}
                        <div className={`flex items-end justify-between gap-2 ${viewMode === 'grid' ? 'mt-3' : 'mt-4 sm:mt-2'}`}>
                          <div className="flex flex-col">
                            <span className={`font-extrabold text-gray-950 ${viewMode === 'grid' ? 'text-sm md:text-base' : 'text-base sm:text-lg'}`}>{p.price.toLocaleString()}đ</span>
                            {p.isSale && <span className="text-[11px] text-gray-400 line-through font-medium">{p.oldPrice.toLocaleString()}đ</span>}
                          </div>
                          
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); /* Add to cart */ }}
                            className={`bg-brand text-white hover:opacity-90 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 ${viewMode === 'grid' ? 'p-2' : 'px-4 py-2 text-xs'}`}
                          >
                            <ShoppingCart size={14} />
                            {viewMode === 'list' && <span>Thêm vào giỏ hàng</span>}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* KHỐI PHÂN TRANG (PAGINATION) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-6 w-full border-t border-gray-100">
                    <button
                      type="button" disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 border border-gray-200 rounded-xl bg-white flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum} type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${
                            currentPage === pageNum
                              ? 'bg-brand border-brand text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button" disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="w-8 h-8 border border-gray-200 rounded-xl bg-white flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft size={14} className="rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Search size={28} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Không tìm thấy sản phẩm</h3>
                <button 
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-brand text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 mx-auto shadow-sm"
                >
                  <RotateCcw size={14} /> Khởi tạo lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isFilterMobileOpen && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterMobileOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">Bộ lọc tìm kiếm</h3>
                  <button onClick={() => setIsFilterMobileOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><X size={18} /></button>
                </div>
                
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục hàng</p>
                    <div className="space-y-1.5">
                      {categories.map((cat) => (
                        <button 
                          key={cat.name}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setSelectedSub(null);
                            setCurrentPage(1);
                            setIsFilterMobileOpen(false);
                          }}
                          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex justify-between items-center transition-all ${
                            selectedCategory === cat.name ? 'bg-brand text-white' : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{cat.name === 'Tất cả' ? 'Tất cả sản phẩm' : cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsFilterMobileOpen(false)}
                  className="w-full bg-brand text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-brand/10"
                >
                  Áp dụng bộ lọc ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Market;