import api from './api';
import type {
  DashboardData,
  AdminListingsResponse,
  AdminUsersResponse,
  Listing,
  Category,
  User,
} from '../types';

export interface AdminListingsParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  sort?: string;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export const adminApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get<DashboardData>('/admin/dashboard');
    return response.data;
  },

  // Listings
  getListings: async (params?: AdminListingsParams) => {
    const response = await api.get<AdminListingsResponse>('/admin/listings', { params });
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get<Listing>(`/admin/listings/${id}`);
    return response.data;
  },

  updateListing: async (id: string, data: Partial<Listing>) => {
    const response = await api.put<Listing>(`/admin/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string) => {
    await api.delete(`/admin/listings/${id}`);
  },

  approveListing: async (id: string) => {
    const response = await api.put<Listing>(`/admin/listings/${id}/approve`);
    return response.data;
  },

  rejectListing: async (id: string, reason: string) => {
    const response = await api.put<Listing>(`/admin/listings/${id}/reject`, { reason });
    return response.data;
  },

  // Users
  getUsers: async (params?: AdminUsersParams) => {
    const response = await api.get<AdminUsersResponse>('/admin/users', { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },

  // Categories
  getCategories: async () => {
    const response = await api.get<Category[]>('/admin/categories');
    return response.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await api.post<Category>('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
  },
};

export default adminApi;
