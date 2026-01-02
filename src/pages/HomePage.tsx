import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { categoriesApi, listingsApi } from '../services/api';
import type { Category, Listing } from '../types';
import CategoryCard from '../components/ui/CategoryCard';
import ListingCard from '../components/listings/ListingCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, listings] = await Promise.all([
          categoriesApi.getAll(),
          listingsApi.getFeatured(),
        ]);
        setCategories(cats);
        setFeaturedListings(listings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = ['pottery', 'yoga', 'cooking', 'photography', 'guitar'];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-light-lavender to-soft-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-arabic text-6xl md:text-8xl font-semibold text-indigo mb-4">
            جرّب
          </h1>
          <p className="font-display text-xl md:text-2xl text-deep-violet mb-8">
            Try something new today
          </p>
          <p className="font-ui text-lavender mb-8 max-w-lg mx-auto">
            Discover classes, workshops, and experiences in Kuwait
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
              <input
                type="text"
                placeholder="What do you want to try?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-lilac rounded-xl pl-12 pr-4 py-4 font-display text-base placeholder:text-lavender focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all shadow-md"
              />
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-ui text-sm text-lavender">Popular:</span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                to={`/browse?q=${term}`}
                className="font-ui text-sm text-indigo hover:text-deep-violet hover:underline"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-soft-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet">
              Explore Categories
            </h2>
            <Link
              to="/browse"
              className="font-ui text-indigo hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-14 h-14 mx-auto mb-4 bg-lilac rounded-xl" />
                  <div className="h-4 bg-lilac rounded mx-auto w-20 mb-2" />
                  <div className="h-3 bg-lilac rounded mx-auto w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-light-lavender">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet">
              Recently Added
            </h2>
            <Link
              to="/browse"
              className="font-ui text-indigo hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-soft-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet text-center mb-12">
            How Jarrib Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-light-lavender rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                Browse
              </h3>
              <p className="font-ui text-lavender">
                Discover classes and experiences across Kuwait
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-light-lavender rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                Connect
              </h3>
              <p className="font-ui text-lavender">
                Contact providers directly via WhatsApp
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-light-lavender rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                Try
              </h3>
              <p className="font-ui text-lavender">
                Show up and try something new
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA Section */}
      <section className="py-16 bg-indigo text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
            Are you a provider?
          </h2>
          <p className="font-ui text-lavender mb-8 max-w-lg mx-auto">
            List your class for free and reach new students
          </p>
          <Link to="/add-listing" className="btn-accent inline-block">
            Add Your Class
          </Link>
        </div>
      </section>
    </div>
  );
}
