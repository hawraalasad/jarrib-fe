import axios from 'axios';
import type { Listing, Category, ListingsResponse, CategoryResponse, User } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Listings API
export interface ListingsParams {
  q?: string;
  category?: string;
  subcategory?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  days?: string;
  timeOfDay?: string;
  skillLevel?: string;
  commitmentType?: string;
  format?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const listingsApi = {
  getAll: async (params?: ListingsParams) => {
    const response = await api.get<ListingsResponse>('/listings', { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get<Listing[]>('/listings/featured');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ listing: Listing; related: Listing[] }>(`/listings/${id}`);
    return response.data;
  },

  create: async (data: Partial<Listing>) => {
    const response = await api.post<Listing>('/listings', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Listing>) => {
    const response = await api.put<Listing>(`/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/listings/${id}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getBySlug: async (slug: string, params?: { subcategory?: string; page?: number; limit?: number }) => {
    const response = await api.get<CategoryResponse>(`/categories/${slug}`, { params });
    return response.data;
  },
};

// Providers API
export const providersApi = {
  getById: async (id: string) => {
    const response = await api.get<{ provider: Listing['provider']; listings: Listing[] }>(`/providers/${id}`);
    return response.data;
  },
};

// User API (saved listings)
export const userApi = {
  getSaved: async () => {
    const response = await api.get<Listing[]>('/users/saved');
    return response.data;
  },

  saveListing: async (listingId: string) => {
    const response = await api.post<{ savedListings: string[] }>(`/users/saved/${listingId}`);
    return response.data;
  },

  unsaveListing: async (listingId: string) => {
    const response = await api.delete<{ savedListings: string[] }>(`/users/saved/${listingId}`);
    return response.data;
  },
};

export default api;
