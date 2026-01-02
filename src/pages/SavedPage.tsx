import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { listingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Listing } from '../types';
import ListingCard from '../components/listings/ListingCard';

export default function SavedPage() {
  const { savedListings, user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedListings = async () => {
      if (savedListings.length === 0) {
        setListings([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch each saved listing
        const listingPromises = savedListings.map((id) =>
          listingsApi.getById(id).then((data) => data.listing).catch(() => null)
        );
        const results = await Promise.all(listingPromises);
        setListings(results.filter((l): l is Listing => l !== null));
      } catch (error) {
        console.error('Failed to fetch saved listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedListings();
  }, [savedListings]);

  return (
    <div className="bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet">
              Saved Classes
            </h1>
            <p className="font-ui text-lavender">
              {savedListings.length} {savedListings.length === 1 ? 'class' : 'classes'} saved
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
              <Heart className="w-10 h-10 text-lavender" />
            </div>
            <h3 className="font-display text-xl text-deep-violet mb-2">
              Nothing saved yet
            </h3>
            <p className="font-ui text-lavender mb-6">
              Browse classes and tap the heart to save them for later
            </p>
            <Link to="/browse" className="btn-primary">
              Browse Classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {!user && savedListings.length > 0 && (
          <div className="mt-8 p-6 bg-light-lavender rounded-xl text-center">
            <p className="font-ui text-deep-violet mb-4">
              Create an account to sync your saved classes across devices
            </p>
            <Link to="/signup" className="btn-primary">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
