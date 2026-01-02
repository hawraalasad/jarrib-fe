import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Phone,
  Instagram,
  Globe,
  ChevronRight,
  CheckCircle,
  Award,
  Briefcase,
  CreditCard,
} from 'lucide-react';
import { listingsApi } from '../services/api';
import type { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/listings/ListingCard';

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isListingSaved, addSavedListing, removeSavedListing } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await listingsApi.getById(id);
        setListing(data.listing);
        setRelated(data.related);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-lilac rounded w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[16/9] bg-lilac rounded-xl mb-6" />
              <div className="h-8 bg-lilac rounded w-3/4 mb-4" />
              <div className="h-4 bg-lilac rounded w-1/4 mb-8" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-lilac rounded" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-64 bg-lilac rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl text-deep-violet mb-4">
          Listing not found
        </h2>
        <Link to="/browse" className="btn-primary">
          Browse Classes
        </Link>
      </div>
    );
  }

  const isSaved = isListingSaved(listing._id);
  const whatsappMessage = encodeURIComponent(
    `Hi! I found your class '${listing.title_en || listing.title_ar}' on Jarrib and I'm interested in learning more.`
  );
  const whatsappLink = `https://wa.me/${listing.provider.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const formatDuration = () => {
    if (listing.total_duration) {
      return `${listing.total_duration.value} ${listing.total_duration.unit}`;
    }
    if (listing.duration_minutes) {
      if (listing.duration_minutes >= 60) {
        const hours = Math.floor(listing.duration_minutes / 60);
        const mins = listing.duration_minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${listing.duration_minutes} minutes`;
    }
    return null;
  };

  const formatDays = (days?: string[]) => {
    if (!days || days.length === 0) return 'Flexible';
    return days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
  };

  const skillLevelLabel = {
    beginner: 'Beginner — no experience needed',
    intermediate: 'Intermediate — some experience helpful',
    advanced: 'Advanced — experience required',
    all: 'All levels welcome',
  };

  return (
    <div className="bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-ui text-lavender mb-6">
          <Link to="/" className="hover:text-indigo">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${listing.category}`} className="hover:text-indigo">
            {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-deep-violet truncate">
            {listing.title_en || listing.title_ar}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-2">
                <img
                  src={listing.photos[selectedImage] || 'https://via.placeholder.com/800x450?text=No+Image'}
                  alt={listing.title_en || listing.title_ar}
                  className="w-full h-full object-cover"
                />
              </div>
              {listing.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index ? 'border-indigo' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${listing.title_en} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Save */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {listing.title_ar && (
                  <h2 className="font-arabic text-xl text-lavender mb-1" dir="rtl">
                    {listing.title_ar}
                  </h2>
                )}
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet">
                  {listing.title_en || listing.title_ar}
                </h1>
                <Link
                  to={`/provider/${listing._id}`}
                  className="font-ui text-indigo hover:underline"
                >
                  by {listing.provider.name}
                </Link>
              </div>
              <button
                onClick={() =>
                  isSaved
                    ? removeSavedListing(listing._id)
                    : addSavedListing(listing._id)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm transition-colors ${
                  isSaved
                    ? 'bg-terracotta text-white'
                    : 'bg-light-lavender text-deep-violet hover:bg-lilac'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-light-lavender rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <p className="font-ui text-xs text-lavender">Price</p>
                  <p className="font-ui font-semibold text-deep-violet">
                    {listing.price} {listing.price_currency}
                    {listing.price_type === 'per-class' && ' / class'}
                    {listing.price_type === 'per-month' && ' / month'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo" />
                </div>
                <div>
                  <p className="font-ui text-xs text-lavender">Location</p>
                  <p className="font-ui font-semibold text-deep-violet">
                    {listing.area || 'Online'}
                  </p>
                </div>
              </div>

              {formatDuration() && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo" />
                  </div>
                  <div>
                    <p className="font-ui text-xs text-lavender">Duration</p>
                    <p className="font-ui font-semibold text-deep-violet">
                      {formatDuration()}
                    </p>
                  </div>
                </div>
              )}

              {listing.max_size && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo" />
                  </div>
                  <div>
                    <p className="font-ui text-xs text-lavender">Class Size</p>
                    <p className="font-ui font-semibold text-deep-violet">
                      Max {listing.max_size}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bootcamp Duration Section */}
            {listing.commitment_type && listing.total_duration && (
              <div className="mb-8 p-4 bg-indigo/5 border border-indigo/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-indigo" />
                  <h3 className="font-ui font-semibold text-deep-violet">
                    {listing.total_duration.value}-{listing.total_duration.unit.slice(0, -1).charAt(0).toUpperCase() + listing.total_duration.unit.slice(1, -1)} {listing.commitment_type.charAt(0).toUpperCase() + listing.commitment_type.slice(1)}
                  </h3>
                </div>
                <p className="font-ui text-sm text-lavender mb-3">
                  {listing.format?.replace(/-/g, ' ')} • {listing.hours_per_week} hrs/week
                  {listing.total_sessions && ` • ${listing.total_sessions} sessions`}
                </p>
                {listing.start_dates && listing.start_dates.length > 0 && (
                  <div>
                    <p className="font-ui text-sm font-semibold text-deep-violet mb-1">
                      Next cohort starts:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {listing.start_dates.slice(0, 3).map((date, i) => (
                        <span
                          key={i}
                          className="bg-white px-3 py-1 rounded text-sm font-ui text-indigo"
                        >
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-semibold text-deep-violet mb-3">
                Description
              </h3>
              <p className="font-display text-deep-violet leading-relaxed whitespace-pre-line">
                {listing.description_en}
              </p>
              {listing.description_ar && listing.description_ar !== listing.description_en && (
                <p
                  className="font-arabic text-lavender mt-4 leading-relaxed"
                  dir="rtl"
                >
                  {listing.description_ar}
                </p>
              )}
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-semibold text-deep-violet mb-3">
                Schedule
              </h3>
              <div className="bg-white rounded-xl p-4 border border-lilac/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-ui text-sm text-lavender">Days</p>
                    <p className="font-ui font-medium text-deep-violet">
                      {formatDays(listing.days)}
                    </p>
                  </div>
                  {listing.time_start && (
                    <div>
                      <p className="font-ui text-sm text-lavender">Time</p>
                      <p className="font-ui font-medium text-deep-violet">
                        {listing.time_start} - {listing.time_end}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-ui text-sm text-lavender">Type</p>
                    <p className="font-ui font-medium text-deep-violet">
                      {listing.schedule_type === 'one-time'
                        ? 'One-time workshop'
                        : listing.schedule_type === 'recurring'
                        ? 'Recurring weekly'
                        : 'Flexible schedule'}
                    </p>
                  </div>
                  <div>
                    <p className="font-ui text-sm text-lavender">Skill Level</p>
                    <p className="font-ui font-medium text-deep-violet">
                      {skillLevelLabel[listing.skill_level]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {listing.whats_included && listing.whats_included.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-deep-violet mb-3">
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {listing.whats_included.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="font-ui text-deep-violet">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {listing.requirements && (
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-deep-violet mb-3">
                  Requirements
                </h3>
                <p className="font-ui text-deep-violet">{listing.requirements}</p>
              </div>
            )}

            {/* Credential & Career Support */}
            {(listing.credential || listing.career_support) && (
              <div className="mb-8 flex flex-wrap gap-4">
                {listing.credential && (
                  <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg">
                    <Award className="w-5 h-5" />
                    <span className="font-ui text-sm font-medium">{listing.credential}</span>
                  </div>
                )}
                {listing.career_support && (
                  <div className="flex items-center gap-2 bg-indigo/10 text-indigo px-4 py-2 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-ui text-sm font-medium">Career Support Included</span>
                  </div>
                )}
                {listing.payment_plans && (
                  <div className="flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-2 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-ui text-sm font-medium">Payment Plans Available</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="card p-6">
                <p className="font-display text-2xl font-semibold text-deep-violet mb-1">
                  {listing.price} {listing.price_currency}
                </p>
                <p className="font-ui text-sm text-lavender mb-6">
                  {listing.price_type === 'per-class' && 'per class'}
                  {listing.price_type === 'per-month' && 'per month'}
                  {listing.price_type === 'package' && 'for full program'}
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>

                <button className="btn-secondary w-full mb-4">I'm Interested</button>

                {listing.provider.phone && (
                  <a
                    href={`tel:${listing.provider.phone}`}
                    className="flex items-center gap-2 text-indigo hover:underline font-ui text-sm mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    {listing.provider.phone}
                  </a>
                )}

                {listing.provider.instagram && (
                  <a
                    href={`https://instagram.com/${listing.provider.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo hover:underline font-ui text-sm mb-2"
                  >
                    <Instagram className="w-4 h-4" />
                    {listing.provider.instagram}
                  </a>
                )}

                {listing.provider.website && (
                  <a
                    href={`https://${listing.provider.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo hover:underline font-ui text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    {listing.provider.website}
                  </a>
                )}
              </div>

              {/* Provider Card */}
              <div className="card p-6">
                <h4 className="font-ui text-sm text-lavender mb-3">About the Provider</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-light-lavender rounded-full flex items-center justify-center">
                    <span className="font-ui font-semibold text-indigo text-lg">
                      {listing.provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-deep-violet">
                      {listing.provider.name}
                    </p>
                    {listing.provider.name_ar && (
                      <p className="font-arabic text-sm text-lavender">
                        {listing.provider.name_ar}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-ui text-sm text-deep-violet line-clamp-3">
                  {listing.provider.bio}
                </p>
                <Link
                  to={`/provider/${listing._id}`}
                  className="inline-block mt-3 font-ui text-sm text-indigo hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-deep-violet mb-6">
              More classes you might like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
