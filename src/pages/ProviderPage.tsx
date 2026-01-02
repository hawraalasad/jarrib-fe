import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, Instagram, Globe, ChevronRight } from 'lucide-react';
import { providersApi } from '../services/api';
import type { Listing, Provider } from '../types';
import ListingCard from '../components/listings/ListingCard';

export default function ProviderPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await providersApi.getById(id);
        setProvider(data.provider);
        setListings(data.listings);
      } catch (error) {
        console.error('Failed to fetch provider:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-lilac rounded-full" />
            <div>
              <div className="h-6 bg-lilac rounded w-48 mb-2" />
              <div className="h-4 bg-lilac rounded w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl text-deep-violet mb-4">
          Provider not found
        </h2>
        <Link to="/browse" className="btn-primary">
          Browse Classes
        </Link>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div className="bg-soft-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-ui text-lavender mb-6">
          <Link to="/" className="hover:text-indigo">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-deep-violet">{provider.name}</span>
        </nav>

        {/* Provider Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-light-lavender rounded-full flex items-center justify-center flex-shrink-0">
              {provider.photo ? (
                <img
                  src={provider.photo}
                  alt={provider.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-ui font-semibold text-3xl text-indigo">
                  {provider.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-2xl font-semibold text-deep-violet mb-1">
                {provider.name}
              </h1>
              {provider.name_ar && (
                <p className="font-arabic text-lavender mb-4">{provider.name_ar}</p>
              )}
              <p className="font-ui text-deep-violet mb-6">{provider.bio}</p>

              {/* Contact Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>

                {provider.phone && (
                  <a
                    href={`tel:${provider.phone}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}

                {provider.instagram && (
                  <a
                    href={`https://instagram.com/${provider.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}

                {provider.website && (
                  <a
                    href={`https://${provider.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Provider's Listings */}
        <h2 className="font-display text-xl font-semibold text-deep-violet mb-6">
          Classes by {provider.name}
        </h2>

        {listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="font-ui text-lavender">No classes listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
