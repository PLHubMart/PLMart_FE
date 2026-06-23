import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'Bộ Chăn Ga Gối Cotton Cao Cấp',
      price: '1.250.000đ',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80',
      stock: 'Còn hàng'
    },
    {
      id: 4,
      name: 'Mùng (Màn) Chụp Tự Bung Cao Cấp',
      price: '180.000đ',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=300&q=80',
      stock: 'Hết hàng'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-brand uppercase tracking-wider mb-6">Sản phẩm yêu thích</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="aspect-square relative">
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-white shadow-sm transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{item.name}</h4>
                <p className="text-brand font-black mb-3">{item.price}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-bold uppercase ${item.stock === 'Còn hàng' ? 'text-green-500' : 'text-gray-400'}`}>
                    {item.stock}
                  </span>
                  <button 
                    disabled={item.stock !== 'Còn hàng'}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-brand text-white py-1.5 rounded-lg text-xs font-bold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ShoppingCart size={14} /> THÊM VÀO GIỎ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
