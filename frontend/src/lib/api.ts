import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'\;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    // Request interceptor — attach token
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor — handle 401 / token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as any;
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            const res = await this.client.post('/api/auth/refresh', { refreshToken });
            const { accessToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            original.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(original);
          } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() { return this.client; }

  // ── Auth ──────────────────────────────────────────────────────
  auth = {
    register: (data: { email: string; password: string; name: string; accountType?: string }) =>
      this.client.post('/api/auth/register', data),

    login: (data: { email: string; password: string }) =>
      this.client.post('/api/auth/login', data),

    logout: () => this.client.post('/api/auth/logout'),

    refresh: (refreshToken: string) =>
      this.client.post('/api/auth/refresh', { refreshToken }),

    verifyEmail: (token: string) =>
      this.client.get(`/api/auth/verify-email/${token}`),

    forgotPassword: (email: string) =>
      this.client.post('/api/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
      this.client.post('/api/auth/reset-password', { token, password }),

    me: () => this.client.get('/api/auth/me'),
  };

  // ── Users ─────────────────────────────────────────────────────
  users = {
    getProfile: () => this.client.get('/api/users/profile'),
    updateProfile: (data: any) => this.client.patch('/api/users/profile', data),
    getNotifications: () => this.client.get('/api/users/notifications'),
    markNotificationRead: (id: string) => this.client.patch(`/api/users/notifications/${id}/read`),
    markAllNotificationsRead: () => this.client.patch('/api/users/notifications/read-all'),
    getSessions: () => this.client.get('/api/users/sessions'),
    deleteSession: (id: string) => this.client.delete(`/api/users/sessions/${id}`),
    getApiKeys: () => this.client.get('/api/users/api-keys'),
    createApiKey: (data: { name: string; permissions: string[] }) =>
      this.client.post('/api/users/api-keys', data),
    deleteApiKey: (id: string) => this.client.delete(`/api/users/api-keys/${id}`),
  };

  // ── Posts ─────────────────────────────────────────────────────
  posts = {
    list: (params?: { page?: number; limit?: number; status?: string; platform?: string }) =>
      this.client.get('/api/posts', { params }),
    create: (data: any) => this.client.post('/api/posts', data),
    get: (id: string) => this.client.get(`/api/posts/${id}`),
    update: (id: string, data: any) => this.client.patch(`/api/posts/${id}`, data),
    delete: (id: string) => this.client.delete(`/api/posts/${id}`),
  };

  // ── Campaigns ─────────────────────────────────────────────────
  campaigns = {
    list: (params?: { status?: string }) =>
      this.client.get('/api/campaigns', { params }),
    create: (data: any) => this.client.post('/api/campaigns', data),
    get: (id: string) => this.client.get(`/api/campaigns/${id}`),
    update: (id: string, data: any) => this.client.patch(`/api/campaigns/${id}`, data),
    updateStatus: (id: string, status: string) =>
      this.client.patch(`/api/campaigns/${id}/status`, { status }),
    delete: (id: string) => this.client.delete(`/api/campaigns/${id}`),
  };

  // ── Analytics ─────────────────────────────────────────────────
  analytics = {
    overview: (days?: number) =>
      this.client.get('/api/analytics/overview', { params: { days } }),
    topPosts: (params?: { limit?: number; days?: number }) =>
      this.client.get('/api/analytics/posts/top', { params }),
    platforms: () => this.client.get('/api/analytics/platforms'),
  };
}

export const api = new ApiClient();
export default api;
