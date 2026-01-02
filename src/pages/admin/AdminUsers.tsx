import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { User, Pagination } from '../../types';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [roleModal, setRoleModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers({
        page: currentPage,
        limit: 10,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: search || undefined,
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search, role: roleFilter, page: '1' });
    fetchUsers();
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    setSearchParams({ search, role, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ search, role: roleFilter, page: page.toString() });
  };

  const handleToggleRole = async () => {
    if (!roleModal.user) return;
    setActionLoading(roleModal.user.id);
    try {
      const newRole = roleModal.user.role === 'admin' ? 'user' : 'admin';
      await adminApi.updateUser(roleModal.user.id, { role: newRole });
      setRoleModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setActionLoading(deleteModal.user.id);
    try {
      await adminApi.deleteUser(deleteModal.user.id);
      setDeleteModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-deep-violet">Users</h1>
        <p className="text-gray-500 mt-1">Manage all users on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-lilac rounded-lg focus:outline-none focus:border-indigo"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo text-white rounded-lg hover:bg-indigo/90"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
              className="border border-lilac rounded-lg px-3 py-2 focus:outline-none focus:border-indigo"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-lavender">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lilac/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-light-lavender/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-medium flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-deep-violet">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-indigo/10 text-indigo'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => setRoleModal({ isOpen: true, user })}
                                disabled={actionLoading === user.id}
                                className="p-2 text-gray-400 hover:text-indigo rounded-lg hover:bg-indigo/10 disabled:opacity-50"
                                title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, user })}
                                disabled={actionLoading === user.id}
                                className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/10 disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {user.id === currentUser?.id && (
                            <span className="text-xs text-gray-400 italic">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-lilac/20 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 text-gray-400 hover:text-indigo disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 text-gray-400 hover:text-indigo disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.user?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive
        isLoading={!!actionLoading}
      />

      {/* Role Modal */}
      <ConfirmModal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal({ isOpen: false, user: null })}
        onConfirm={handleToggleRole}
        title={roleModal.user?.role === 'admin' ? 'Remove Admin Role' : 'Make Admin'}
        message={
          roleModal.user?.role === 'admin'
            ? `Are you sure you want to remove admin privileges from "${roleModal.user?.name}"?`
            : `Are you sure you want to give admin privileges to "${roleModal.user?.name}"?`
        }
        confirmText={roleModal.user?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
        isLoading={!!actionLoading}
      />
    </div>
  );
}
