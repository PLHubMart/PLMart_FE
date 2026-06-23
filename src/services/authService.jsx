import API_BASE_URL, { request, saveTokens, clearTokens, decodeToken } from './TokenServices';

/**
 * API Auth
 */
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Đăng nhập thất bại');
    }
    
    const data = await response.json();
    const decoded = decodeToken(data.accessToken);
    const userId = decoded?.sub || decoded?.id || 'unknown'; 
    
    saveTokens(data.accessToken, data.refreshToken, userId);
    return { ...data, userId, decoded };
  },

  getMe: async () => {
    const response = await request('/auth/me');
    if (!response.ok) throw new Error('Không thể lấy thông tin người dùng');
    return await response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        role: userData.role
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Đăng ký thất bại');
    }

    return await response.json();
  },

  refreshToken: async (userId, refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, refreshToken })
    });

    if (!response.ok) {
      throw new Error('Refresh token thất bại');
    }

    const data = await response.json();
    saveTokens(data.accessToken, data.refreshToken, userId);
    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Yêu cầu thất bại');
    return response;
  },

  resetPassword: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.userId,
        token: data.token,
        newPassword: data.newPassword
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Đặt lại mật khẩu thất bại');
    }
    return response;
  },

  verifyEmail: async (userId, token) => {
    // Ensure we are working with the "clean" token where spaces are converted back to '+'
    const fixedToken = token.trim().replace(/\s/g, '+');
    
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('token', fixedToken);

    const response = await request(`/auth/verify-email?${params.toString()}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Xác thực email thất bại');
    }
    return response;
  },

  googleLogin: async (idToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Đăng nhập Google thất bại');
    }

    const data = await response.json();
    const decoded = decodeToken(data.accessToken);
    const userId = decoded?.sub || decoded?.id || 'unknown';
    
    saveTokens(data.accessToken, data.refreshToken, userId);
    return { ...data, userId, decoded };
  }
};
