export interface Provider {
  name: string;
  name_ar?: string;
  bio: string;
  whatsapp: string;
  phone?: string;
  instagram?: string;
  website?: string;
  email?: string;
  photo?: string;
}

export interface Duration {
  value: number;
  unit: 'hours' | 'days' | 'weeks' | 'months';
}

export interface Listing {
  _id: string;
  title_ar: string;
  title_en?: string;
  category: string;
  subcategory?: string;
  description_en: string;
  description_ar: string;
  provider: Provider;
  location_type: 'in-person' | 'online' | 'both';
  area?: string;
  address?: string;
  schedule_type: 'one-time' | 'recurring' | 'flexible';
  days?: string[];
  time_start?: string;
  time_end?: string;
  duration_minutes?: number;
  commitment_type?: 'drop-in' | 'workshop' | 'short-course' | 'course' | 'bootcamp' | 'certification';
  total_duration?: Duration;
  total_sessions?: number;
  hours_per_week?: number;
  format?: 'drop-in' | 'fixed-schedule' | 'self-paced' | 'intensive-full-time' | 'intensive-part-time';
  start_dates?: string[];
  credential?: string;
  career_support?: boolean;
  payment_plans?: boolean;
  price: number;
  price_type: 'per-class' | 'per-month' | 'package';
  price_currency: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_size?: number;
  whats_included?: string[];
  requirements?: string;
  photos: string[];
  createdAt: string;
  isActive: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface Category {
  _id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  icon: string;
  description_en: string;
  description_ar: string;
  subcategories: string[];
  listingCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  savedListings?: string[];
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ListingsResponse {
  listings: Listing[];
  pagination: Pagination;
}

export interface CategoryResponse {
  category: Category;
  listings: Listing[];
  pagination: Pagination;
}

// Admin types
export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  rejectedListings: number;
  totalUsers: number;
  totalCategories: number;
  newListingsThisWeek: number;
  newUsersThisWeek: number;
}

export interface DashboardData {
  stats: DashboardStats;
  listingsByCategory: { category: string; count: number }[];
  listingsByStatus: { status: string; count: number }[];
  recentListings: Listing[];
  recentUsers: User[];
}

export interface AdminListingsResponse {
  listings: Listing[];
  pagination: Pagination;
}

export interface AdminUsersResponse {
  users: User[];
  pagination: Pagination;
}
