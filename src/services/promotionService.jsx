import { request } from './TokenServices';

/**
 * API Promotion Services (Admin only)
 */
export const promotionApi = {
  create: async (promotionData) => {
    const response = await request('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Tạo chương trình khuyến mãi thất bại');
    }
    return response;
  },

  getActive: async () => {
    const response = await request('/admin/promotions/active');
    if (!response.ok) throw new Error('Không thể lấy danh sách chương trình khuyến mãi đang hoạt động');
    return await response.json();
  }
};
