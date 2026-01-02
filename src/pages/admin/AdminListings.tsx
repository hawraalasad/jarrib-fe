import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { Listing, Pagination } from '../../types';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function AdminListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; listing: Listing | null }>({
    isOpen: false,
    listing: null,
  });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; listing: Listing | null }>({
    isOpen: false,
    listing: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getListings({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      });
      setListings(data.listings);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search, status: statusFilter, page: '1' });
    fetchListings();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setSearchParams({ search, status, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ search, status: statusFilter, page: page.toString() });
  };

  const handleApprove = async (listing: Listing) => {
    setActionLoading(listing._id);
    try {
      await adminApi.approveListing(listing._id);
      fetchListings();
    } catch (error) {
      console.error('Failed to approve listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.listing) return;
    setActionLoading(rejectModal.listing._id);
    try {
      await adminApi.rejectListing(rejectModal.listing._id, rejectReason);
      setRejectModal({ isOpen: false, listing: null });
      setRejectReason('');
      fetchListings();
    } catch (error) {
      console.error('Failed to reject listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.listing) return;
    setActionLoading(deleteModal.listing._id);
    try {
      await adminApi.deleteListing(deleteModal.listing._id);
      setDeleteModal({ isOpen: false, listing: null });
      fetchListings();
    } catch (error) {
      console.error('Failed to delete listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-deep-violet">Listings</h1>
        <p className="text-gray-500 mt-1">Manage all listings on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
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
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-lilac rounded-lg px-3 py-2 focus:outline-none focus:border-indigo"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-lilac/20 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No listings found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-lavender">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lilac/10">
                  {listings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-light-lavender/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-lilac/20 overflow-hidden flex-shrink-0">
                            {listing.photos?.[0] ? (
                              <img
                                src={listing.photos[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-deep-violet">
                              {listing.title_en || listing.title_ar}
                            </p>
                            <p className="text-sm text-gray-500">{listing.provider?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-gray-600">{listing.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {listing.price} {listing.price_currency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={listing.status || 'approved'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/listing/${listing._id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-indigo rounded-lg hover:bg-indigo/10"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {listing.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(listing)}
                                disabled={actionLoading === listing._id}
                                className="p-2 text-gray-400 hover:text-success rounded-lg hover:bg-success/10 disabled:opacity-50"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRejectModal({ isOpen: true, listing })}
                                disabled={actionLoading === listing._id}
                                className="p-2 text-gray-400 hover:text-warning rounded-lg hover:bg-warning/10 disabled:opacity-50"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, listing })}
                            disabled={actionLoading === listing._id}
                            className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/10 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
        onClose={() => setDeleteModal({ isOpen: false, listing: null })}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteModal.listing?.title_en || deleteModal.listing?.title_ar}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive
        isLoading={!!actionLoading}
      />

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setRejectModal({ isOpen: false, listing: null })}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-deep-violet">Reject Listing</h3>
            <p className="mt-2 text-gray-600">
              Please provide a reason for rejecting "{rejectModal.listing?.title_en || rejectModal.listing?.title_ar}".
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full mt-4 p-3 border border-lilac rounded-lg focus:outline-none focus:border-indigo resize-none"
              rows={3}
            />
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setRejectModal({ isOpen: false, listing: null });
                  setRejectReason('');
                }}
                disabled={!!actionLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!!actionLoading || !rejectReason.trim()}
                className="px-4 py-2 rounded-lg font-medium text-white bg-warning hover:bg-warning/90 disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
