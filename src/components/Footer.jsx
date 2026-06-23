import React from 'react';
import { Phone, MapPin, Truck, ShieldCheck, Tag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand text-white pt-0 pb-8">
      {/* 1. TRUST CAM KẾT BAR - TĂNG ĐỘ UY TÍN SHOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center md:justify-start gap-4 group hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Truck size={24} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Giao hàng hỏa tốc 2H</h4>
              <p className="text-xs text-brand-light/70 mt-1">Áp dụng khu vực nội thành nhanh chóng</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 group hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <ShieldCheck size={24} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Cam kết chính hãng</h4>
              <p className="text-xs text-brand-light/70 mt-1">Bảo hành dài hạn lên đến 10 năm</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 group hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Tag size={24} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Giá sỉ tận xưởng</h4>
              <p className="text-xs text-brand-light/70 mt-1">Tối ưu chi phí, cam kết rẻ nhất</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6">HỒNG HẠNH SHOP</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Chuyên sỉ và lẻ các loại chăn, ga, gối, nệm, chiếu, mùng, mền... Cam kết chất lượng tốt, giá cả cạnh tranh nhất thị trường.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                <span className="text-[10px] font-bold">FB</span>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                <span className="text-[10px] font-bold">IG</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">DANH MỤC</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Chăn Ga Gối</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Nệm Cao Su / Lò Xo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Chiếu Trúc / Điều Hòa</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Mùng Chụp / Mùng Khung</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">HỖ TRỢ</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Kiểm tra đơn hàng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">LIÊN HỆ</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-accent shrink-0" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-accent shrink-0" />
                <span>09xx xxx xxx</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 HỒNG HẠNH SHOP. Thiết kế bởi PLMART Team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
