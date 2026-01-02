import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { listingsApi, ListingsParams } from '../services/api';
import type { Listing, Pagination } from '../types';
import ListingCard from '../components/listings/ListingCard';
import FilterSidebar from '../components/filters/FilterSidebar';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Build filters from URL params
  const filters = {
    category: searchParams.get('category') || undefined,
    area: searchParams.get('area') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    days: searchParams.get('days') || undefined,
    skillLevel: searchParams.get('skillLevel') || undefined,
    commitmentType: searchParams.get('commitmentType') || undefined,
  };

  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const params: ListingsParams = {
          q: searchParams.get('q') || undefined,
          ...filters,
          sort,
          page,
          limit: 12,
        };

        const data = await listingsApi.getAll(params);
        setListings(data.listings);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    const newParams = new URLSearchParams(searchParams);

    // Update filter params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset page when filters change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Quick filter pills
  const quickFilters = [
    { label: 'All', value: '' },
    { label: 'Drop-in', value: 'drop-in' },
    { label: 'Workshops', value: 'workshop' },
    { label: 'Courses', value: 'course' },
    { label: 'Bootcamps', value: 'bootcamp' },
  ];

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Search Header */}
      <div className="bg-white border-b border-lilac/30 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden btn-secondary flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="bg-indigo text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() =>
                  handleFilterChange({
                    ...filters,
                    commitmentType: filter.value || undefined,
                  })
                }
                className={`px-4 py-1.5 rounded-full font-ui text-sm whitespace-nowrap transition-colors ${
                  (filter.value === '' && !filters.commitmentType) ||
                  filters.commitmentType === filter.value
                    ? 'bg-indigo text-white'
                    : 'bg-light-lavender text-deep-violet hover:bg-lilac'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-ui text-lavender">
                {pagination
                  ? `${pagination.total} ${pagination.total === 1 ? 'class' : 'classes'} found`
                  : 'Loading...'}
              </p>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input w-auto py-2"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-lilac" />
                    <div className="p-4">
                      <div className="h-4 bg-lilac rounded w-16 mb-3" />
                      <div className="h-5 bg-lilac rounded w-full mb-2" />
                      <div className="h-4 bg-lilac rounded w-24 mb-3" />
                      <div className="h-4 bg-lilac rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-light-lavender rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-lavender" />
                </div>
                <h3 className="font-display text-xl text-deep-violet mb-2">
                  No classes found
                </h3>
                <p className="font-ui text-lavender mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="font-ui text-lavender px-4">
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.pages}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white animate-fade-in">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClose={() => setIsFilterOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}
