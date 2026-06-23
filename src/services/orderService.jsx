import { request } from './TokenServices';

/**
 * API Order Services
 */
export const orderApi = {
  // Get all orders (Admin only)
  getAll: async () => {
    const response = await request('/Order');
    if (!response.ok) throw new Error('Không thể lấy danh sách đơn hàng');
    return await response.json();
  },

  // Get current user's orders
  getMyOrders: async () => {
    const response = await request('/Order/my-orders');
    if (!response.ok) throw new Error('Không thể lấy danh sách đơn hàng của bạn');
    return await response.json();
  },

  // Get order details by ID
  getById: async (id) => {
    const response = await request(`/Order/${id}`);
    if (!response.ok) throw new Error('Không tìm thấy thông tin đơn hàng');
    return await response.json();
  },

  // Create a new order
  create: async (orderData) => {
    const response = await request('/Order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Đặt hàng thất bại');
    }
    // Create endpoint returns Ok("Order created successfully") or status message
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  },

  // Update order status (Admin only)
  updateStatus: async (id, status) => {
    const response = await request(`/Order/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Cập nhật trạng thái đơn hàng thất bại');
    }
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }
};
