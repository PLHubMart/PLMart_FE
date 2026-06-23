import { request } from './TokenServices';

/**
 * API Product Services
 */
export const productApi = {
  // Public Product endpoints
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.productType) queryParams.append('productType', params.productType);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `/Product${queryString ? `?${queryString}` : ''}`;
    
    const response = await request(url);
    if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm');
    return await response.json();
  },

  getFeatured: async () => {
    const response = await request('/Product/featured');
    if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm nổi bật');
    return await response.json();
  },

  getHotDeals: async () => {
    const response = await request('/Product/deal-hot');
    if (!response.ok) throw new Error('Không thể lấy danh sách khuyến mãi hot');
    return await response.json();
  },

  getBySlugOrId: async (idOrSlug) => {
    const response = await request(`/Product/${idOrSlug}`);
    if (!response.ok) throw new Error('Không tìm thấy chi tiết sản phẩm');
    return await response.json();
  },

  getRelated: async (id) => {
    const response = await request(`/Product/${id}/related`);
    if (!response.ok) throw new Error('Không thể lấy sản phẩm liên quan');
    return await response.json();
  },

  checkPrices: async (priceCheckRequest) => {
    const response = await request('/Product/check-prices', {
      method: 'POST',
      body: JSON.stringify(priceCheckRequest)
    });
    if (!response.ok) throw new Error('Kiểm tra giá sản phẩm thất bại');
    return await response.json();
  },

  // Admin Product endpoints
  adminCreate: async (productData) => {
    const response = await request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Tạo sản phẩm thất bại');
    }
    return response;
  },

  adminUpdate: async (id, productData) => {
    const response = await request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...productData })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Cập nhật sản phẩm thất bại');
    }
    return response;
  },

  adminUpdateStock: async (id, quantity) => {
    const response = await request(`/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify(quantity)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Cập nhật số lượng tồn kho thất bại');
    }
    return response;
  },

  adminDelete: async (id) => {
    const response = await request(`/admin/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Xóa sản phẩm thất bại');
    }
    return response;
  }
};
