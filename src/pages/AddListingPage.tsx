import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle } from 'lucide-react';
import { listingsApi, categoriesApi } from '../services/api';
import type { Category } from '../types';

interface FormData {
  title_ar: string;
  title_en: string;
  category: string;
  subcategory: string;
  description_en: string;
  description_ar: string;
  location_type: 'in-person' | 'online' | 'both';
  area: string;
  address: string;
  schedule_type: 'one-time' | 'recurring' | 'flexible';
  days: string[];
  time_start: string;
  time_end: string;
  duration_minutes: string;
  price: string;
  price_type: 'per-class' | 'per-month' | 'package';
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_size: string;
  whats_included: string;
  requirements: string;
  provider_name: string;
  provider_bio: string;
  provider_whatsapp: string;
  provider_phone: string;
  provider_instagram: string;
  provider_email: string;
}

const areas = [
  { id: 'kuwait-city', name: 'Kuwait City' },
  { id: 'salmiya', name: 'Salmiya' },
  { id: 'hawalli', name: 'Hawalli' },
  { id: 'jabriya', name: 'Jabriya' },
  { id: 'mishref', name: 'Mishref' },
  { id: 'farwaniya', name: 'Farwaniya' },
  { id: 'fahaheel', name: 'Fahaheel' },
  { id: 'online', name: 'Online' },
];

const daysOfWeek = [
  { id: 'saturday', name: 'Saturday' },
  { id: 'sunday', name: 'Sunday' },
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
];

export default function AddListingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title_ar: '',
    title_en: '',
    category: '',
    subcategory: '',
    description_en: '',
    description_ar: '',
    location_type: 'in-person',
    area: '',
    address: '',
    schedule_type: 'recurring',
    days: [],
    time_start: '',
    time_end: '',
    duration_minutes: '',
    price: '',
    price_type: 'per-class',
    skill_level: 'all',
    max_size: '',
    whats_included: '',
    requirements: '',
    provider_name: '',
    provider_bio: '',
    provider_whatsapp: '',
    provider_phone: '',
    provider_instagram: '',
    provider_email: '',
  });

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const selectedCategory = categories.find((c) => c.slug === formData.category);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handlePhotoAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && photos.length < 5) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title_ar.trim()) newErrors.title_ar = 'Arabic title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.description_en.length < 50)
      newErrors.description_en = 'Description must be at least 50 characters';
    if (!formData.description_ar.trim())
      newErrors.description_ar = 'Arabic description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.provider_name.trim())
      newErrors.provider_name = 'Your name is required';
    if (!formData.provider_whatsapp.trim())
      newErrors.provider_whatsapp = 'WhatsApp number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const listingData = {
        title_ar: formData.title_ar,
        title_en: formData.title_en || undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        location_type: formData.location_type,
        area: formData.area || undefined,
        address: formData.address || undefined,
        schedule_type: formData.schedule_type,
        days: formData.days.length > 0 ? formData.days : undefined,
        time_start: formData.time_start || undefined,
        time_end: formData.time_end || undefined,
        duration_minutes: formData.duration_minutes
          ? parseInt(formData.duration_minutes)
          : undefined,
        price: parseFloat(formData.price),
        price_type: formData.price_type,
        price_currency: 'KD',
        skill_level: formData.skill_level,
        max_size: formData.max_size ? parseInt(formData.max_size) : undefined,
        whats_included: formData.whats_included
          ? formData.whats_included.split('\n').filter(Boolean)
          : undefined,
        requirements: formData.requirements || undefined,
        photos: photos.length > 0 ? photos : ['https://via.placeholder.com/800x600?text=Class+Photo'],
        provider: {
          name: formData.provider_name,
          bio: formData.provider_bio,
          whatsapp: formData.provider_whatsapp,
          phone: formData.provider_phone || undefined,
          instagram: formData.provider_instagram || undefined,
          email: formData.provider_email || undefined,
        },
      };

      await listingsApi.create(listingData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to create listing:', error);
      setErrors({ submit: 'Failed to submit listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-deep-violet mb-2">
          Listing submitted!
        </h1>
        <p className="font-ui text-lavender mb-8">
          Your class is now live. Share it with your audience!
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/browse')} className="btn-primary">
            View Listings
          </button>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                title_ar: '',
                title_en: '',
                category: '',
                subcategory: '',
                description_en: '',
                description_ar: '',
                location_type: 'in-person',
                area: '',
                address: '',
                schedule_type: 'recurring',
                days: [],
                time_start: '',
                time_end: '',
                duration_minutes: '',
                price: '',
                price_type: 'per-class',
                skill_level: 'all',
                max_size: '',
                whats_included: '',
                requirements: '',
                provider_name: '',
                provider_bio: '',
                provider_whatsapp: '',
                provider_phone: '',
                provider_instagram: '',
                provider_email: '',
              });
              setPhotos([]);
            }}
            className="btn-secondary"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-soft-white min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-deep-violet mb-2">
          Add Your Class
        </h1>
        <p className="font-ui text-lavender mb-8">
          List your class or workshop — it's free
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Basic Info
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Title (Arabic) *
                </label>
                <input
                  type="text"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  placeholder="e.g., دورة الفخار للمبتدئين"
                  className={`input ${errors.title_ar ? 'border-error' : ''}`}
                  dir="rtl"
                />
                {errors.title_ar && (
                  <p className="text-error text-sm mt-1">{errors.title_ar}</p>
                )}
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  placeholder="e.g., Beginner Pottery Class"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`input ${errors.category ? 'border-error' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name_en}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-error text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="input"
                    disabled={!selectedCategory}
                  >
                    <option value="">Select subcategory</option>
                    {selectedCategory?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Description (English) *
                </label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  placeholder="Describe your class — what will students learn? What's the experience like?"
                  rows={4}
                  className={`input ${errors.description_en ? 'border-error' : ''}`}
                />
                {errors.description_en && (
                  <p className="text-error text-sm mt-1">{errors.description_en}</p>
                )}
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Description (Arabic) *
                </label>
                <textarea
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  placeholder="صف صفك — ماذا سيتعلم الطلاب؟"
                  rows={4}
                  className={`input ${errors.description_ar ? 'border-error' : ''}`}
                  dir="rtl"
                />
                {errors.description_ar && (
                  <p className="text-error text-sm mt-1">{errors.description_ar}</p>
                )}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Location
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-ui text-sm text-deep-violet mb-2">
                  Where does your class take place?
                </label>
                <div className="flex gap-4">
                  {(['in-person', 'online', 'both'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="location_type"
                        value={type}
                        checked={formData.location_type === type}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo"
                      />
                      <span className="font-ui text-sm text-deep-violet capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.location_type !== 'online' && (
                <>
                  <div>
                    <label className="block font-ui text-sm text-deep-violet mb-1">
                      Area
                    </label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select area</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-ui text-sm text-deep-violet mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Building name, street, area"
                      className="input"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Schedule */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Schedule
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-ui text-sm text-deep-violet mb-2">
                  Schedule Type
                </label>
                <div className="flex gap-4">
                  {(['one-time', 'recurring', 'flexible'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="schedule_type"
                        value={type}
                        checked={formData.schedule_type === type}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo"
                      />
                      <span className="font-ui text-sm text-deep-violet capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-2">
                  Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleDayToggle(day.id)}
                      className={`px-3 py-1 rounded-full text-sm font-ui transition-colors ${
                        formData.days.includes(day.id)
                          ? 'bg-indigo text-white'
                          : 'bg-light-lavender text-deep-violet hover:bg-lilac'
                      }`}
                    >
                      {day.name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="time_start"
                    value={formData.time_start}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="time_end"
                    value={formData.time_end}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    placeholder="e.g., 60"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Pricing
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Price (KD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  className={`input ${errors.price ? 'border-error' : ''}`}
                />
                {errors.price && (
                  <p className="text-error text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Price Type
                </label>
                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="per-class">Per Class</option>
                  <option value="per-month">Per Month</option>
                  <option value="package">Package</option>
                </select>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Skill Level
                  </label>
                  <select
                    name="skill_level"
                    value={formData.skill_level}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Max Class Size
                  </label>
                  <input
                    type="number"
                    name="max_size"
                    value={formData.max_size}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  What's Included (one per line)
                </label>
                <textarea
                  name="whats_included"
                  value={formData.whats_included}
                  onChange={handleChange}
                  placeholder="All materials provided&#10;Equipment included&#10;Certificate"
                  rows={3}
                  className="input"
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="e.g., No prior experience needed"
                  rows={2}
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Photos
            </h2>

            <div className="flex flex-wrap gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handlePhotoRemove(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={handlePhotoAdd}
                  className="w-24 h-24 border-2 border-dashed border-lilac rounded-lg flex flex-col items-center justify-center text-lavender hover:border-indigo hover:text-indigo transition-colors"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <p className="font-ui text-xs text-lavender mt-2">
              Max 5 photos. First photo will be the main image.
            </p>
          </section>

          {/* Provider Info */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-deep-violet mb-4">
              Your Info
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleChange}
                  placeholder="e.g., Sara's Clay Studio"
                  className={`input ${errors.provider_name ? 'border-error' : ''}`}
                />
                {errors.provider_name && (
                  <p className="text-error text-sm mt-1">{errors.provider_name}</p>
                )}
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Bio
                </label>
                <textarea
                  name="provider_bio"
                  value={formData.provider_bio}
                  onChange={handleChange}
                  placeholder="Tell students about yourself and your experience..."
                  rows={3}
                  className="input"
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="provider_whatsapp"
                  value={formData.provider_whatsapp}
                  onChange={handleChange}
                  placeholder="+965 XXXX XXXX"
                  className={`input ${errors.provider_whatsapp ? 'border-error' : ''}`}
                />
                {errors.provider_whatsapp && (
                  <p className="text-error text-sm mt-1">{errors.provider_whatsapp}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="provider_phone"
                    value={formData.provider_phone}
                    onChange={handleChange}
                    placeholder="+965 XXXX XXXX"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block font-ui text-sm text-deep-violet mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="provider_instagram"
                    value={formData.provider_instagram}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-ui text-sm text-deep-violet mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="provider_email"
                  value={formData.provider_email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          {errors.submit && (
            <p className="text-error text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
