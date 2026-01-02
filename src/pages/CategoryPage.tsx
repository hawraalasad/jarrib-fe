import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoriesApi } from '../services/api';
import type { Category, Listing, Pagination } from '../types';
import ListingCard from '../components/listings/ListingCard';
import CategoryCard from '../components/ui/CategoryCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const [catData, cats] = await Promise.all([
          categoriesApi.getBySlug(slug, {
            subcategory: selectedSubcategory || undefined,
            page,
          }),
          categoriesApi.getAll(),
        ]);
        setCategory(catData.category);
        setListings(catData.listings);
        setPagination(catData.pagination);
        setAllCategories(cats);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, selectedSubcategory, page]);

  const relatedCategories = allCategories
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  if (isLoading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-lilac rounded w-48 mb-8" />
          <div className="h-8 bg-lilac rounded w-64 mb-4" />
          <div className="h-4 bg-lilac rounded w-full max-w-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-lilac" />
                <div className="p-4">
                  <div className="h-4 bg-lilac rounded w-16 mb-3" />
                  <div className="h-5 bg-lilac rounded w-full mb-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl text-deep-violet mb-4">
          Category not found
        </h2>
        <Link to="/browse" className="btn-primary">
          Browse Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-soft-white min-h-screen">
      {/* Category Header */}
      <div className="bg-gradient-to-b from-light-lavender to-soft-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-ui text-lavender mb-6">
            <Link to="/" className="hover:text-indigo">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-deep-violet">{category.name_en}</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-deep-violet mb-2">
              {category.name_en}
            </h1>
            <p className="font-arabic text-lavender mb-4">{category.name_ar}</p>
            <p className="font-ui text-lavender">{category.description_en}</p>
            <p className="font-ui text-sm text-lavender mt-2">
              {pagination?.total || 0} classes available
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subcategory Pills */}
        {category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => {
                setSelectedSubcategory('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full font-ui text-sm transition-colors ${
                !selectedSubcategory
                  ? 'bg-indigo text-white'
                  : 'bg-light-lavender text-deep-violet hover:bg-lilac'
              }`}
            >
              All
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubcategory(sub);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-ui text-sm transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-indigo text-white'
                    : 'bg-light-lavender text-deep-violet hover:bg-lilac'
                }`}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-lilac" />
                <div className="p-4">
                  <div className="h-4 bg-lilac rounded w-16 mb-3" />
                  <div className="h-5 bg-lilac rounded w-full mb-2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-display text-xl text-deep-violet mb-2">
              No classes found
            </h3>
            <p className="font-ui text-lavender">
              Check back soon for new classes in this category
            </p>
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
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="font-ui text-lavender px-4">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-deep-violet mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
