import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Grid3X3,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { DashboardData } from '../../types';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await adminApi.getDashboard();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-lg">
        {error || 'Failed to load data'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-deep-violet">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Listings"
          value={data.stats.totalListings}
          icon={FileText}
          trend={{ value: data.stats.newListingsThisWeek, label: 'this week' }}
          color="indigo"
        />
        <StatsCard
          title="Pending Approval"
          value={data.stats.pendingListings}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Total Users"
          value={data.stats.totalUsers}
          icon={Users}
          trend={{ value: data.stats.newUsersThisWeek, label: 'this week' }}
          color="success"
        />
        <StatsCard
          title="Categories"
          value={data.stats.totalCategories}
          icon={Grid3X3}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      {data.stats.pendingListings > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-warning font-medium">
                You have {data.stats.pendingListings} listings pending approval
              </span>
            </div>
            <Link
              to="/admin/listings?status=pending"
              className="text-warning hover:text-warning/80 font-medium text-sm"
            >
              Review now →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-lilac/20">
          <div className="px-6 py-4 border-b border-lilac/20 flex items-center justify-between">
            <h2 className="font-semibold text-deep-violet">Recent Listings</h2>
            <Link
              to="/admin/listings"
              className="text-sm text-indigo hover:text-indigo/80"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-lilac/10">
            {data.recentListings.map((listing) => (
              <div key={listing._id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-deep-violet truncate">
                    {listing.title_en || listing.title_ar}
                  </p>
                  <p className="text-sm text-gray-500">{listing.provider?.name}</p>
                </div>
                <StatusBadge status={listing.status || 'approved'} />
              </div>
            ))}
            {data.recentListings.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No listings yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-lilac/20">
          <div className="px-6 py-4 border-b border-lilac/20 flex items-center justify-between">
            <h2 className="font-semibold text-deep-violet">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-indigo hover:text-indigo/80"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-lilac/10">
            {data.recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-deep-violet truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            ))}
            {data.recentUsers.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No users yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Listings by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20">
        <div className="px-6 py-4 border-b border-lilac/20">
          <h2 className="font-semibold text-deep-violet">Listings by Category</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.listingsByCategory.map((item) => {
              const percentage = data.stats.totalListings > 0
                ? (item.count / data.stats.totalListings) * 100
                : 0;
              return (
                <div key={item.category} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600 capitalize">
                    {item.category}
                  </div>
                  <div className="flex-1 bg-lilac/20 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-indigo h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {item.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
