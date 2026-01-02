import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import type { Listing } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isListingSaved, addSavedListing, removeSavedListing } = useAuth();
  const isSaved = isListingSaved(listing._id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeSavedListing(listing._id);
    } else {
      addSavedListing(listing._id);
    }
  };

  const formatDuration = () => {
    if (listing.total_duration) {
      return `${listing.total_duration.value} ${listing.total_duration.unit.toUpperCase()}`;
    }
    if (listing.commitment_type === 'drop-in') {
      return 'DROP-IN';
    }
    if (listing.duration_minutes) {
      if (listing.duration_minutes >= 60) {
        const hours = Math.floor(listing.duration_minutes / 60);
        return `${hours}h`;
      }
      return `${listing.duration_minutes}min`;
    }
    return null;
  };

  const duration = formatDuration();

  return (
    <Link to={`/listing/${listing._id}`} className="card group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={listing.title_en || listing.title_ar}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration Badge */}
        {duration && (
          <span className="absolute top-3 left-3 bg-deep-violet/80 text-white font-ui font-semibold text-xs px-2 py-1 rounded">
            {duration}
          </span>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isSaved
              ? 'bg-terracotta text-white'
              : 'bg-white/80 text-lavender hover:bg-white hover:text-terracotta'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Tag */}
        <span className="tag text-xs mb-2">
          {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
        </span>

        {/* Title */}
        <h3 className="font-display font-semibold text-deep-violet text-lg mb-1 line-clamp-2">
          {listing.title_en || listing.title_ar}
        </h3>

        {/* Provider */}
        <p className="font-ui text-sm text-lavender mb-3">
          {listing.provider.name}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-lavender font-ui">
            <MapPin className="w-4 h-4" />
            {listing.area || 'Online'}
          </span>
          <span className="font-ui font-semibold text-deep-violet">
            {listing.price} {listing.price_currency}
            {listing.price_type === 'per-class' && ' / class'}
            {listing.price_type === 'per-month' && ' / month'}
          </span>
        </div>

        {/* Payment Plans Badge */}
        {listing.payment_plans && (
          <span className="inline-block mt-2 text-xs font-ui text-success bg-success/10 px-2 py-1 rounded">
            Payment plans available
          </span>
        )}
      </div>
    </Link>
  );
}
