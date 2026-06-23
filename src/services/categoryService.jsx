import { request } from './TokenServices';

/**
 * API Category Services
 */
export const categoryApi = {
  getNav: async () => {
    const response = await request('/Category/nav');
    if (!response.ok) throw new Error('Không thể lấy danh mục điều hướng');
    return await response.json();
  }
};
