'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  DollarSign, 
  Home, 
  Users, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Luggage,
  Calendar,
  Eye,
  SlidersHorizontal,
  Upload,
  ImagePlus,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROPERTIES } from '../../data/properties';
import { Property } from '../../types';

export const HostDashboard: React.FC = () => {
  const { formatPrice, setActiveTab, currentUser, requireAuth } = useApp();

  const [hostListings, setHostListings] = useState<Property[]>(PROPERTIES.slice(0, 3));
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [priceINR, setPriceINR] = useState(7500);
  const [category, setCategory] = useState<'beach' | 'mountains' | 'villas' | 'apartments'>('villas');
  const [bedrooms, setBedrooms] = useState(2);
  const [maxGuests, setMaxGuests] = useState(4);
  const [hasAirportPickup, setHasAirportPickup] = useState(true);
  const [description, setDescription] = useState('');
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);

  // Photo upload state
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setPreviewPhotos((prev) => [...prev.slice(-3), url]); // keep up to 4 photos
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOpenAddListing = () => {
    if (!requireAuth('host', 'add a property listing')) {
      return;
    }
    setIsNewListingModalOpen(true);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newProp: Property = {
      id: `prop-host-${Date.now()}`,
      title: title || 'New SmartStay Boutique Villa',
      location: `${city || 'North Goa'}, ${country}`,
      city: city || 'Goa',
      country: country,
      isDomesticIndia: country.toLowerCase() === 'india',
      category: category,
      images: previewPhotos.length > 0 ? previewPhotos : [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
      rating: 5.0,
      reviewsCount: 1,
      pricePerNight: priceINR,
      superhost: true,
      guestFavorite: true,
      distance: 'Prime central location with garden views',
      availableDates: 'Available from next week',
      maxGuests: maxGuests,
      bedrooms: bedrooms,
      beds: bedrooms,
      baths: Math.max(1, Math.floor(bedrooms / 2)),
      description: description || 'Newly listed verified SmartStay retreat with premium amenities and airport concierge integration.',
      amenities: ['Private Pool', 'High-Speed Wi-Fi', 'Air Conditioning', 'Airport Transfer Supported'],
      host: {
        name: currentUser?.name || 'Verified Host',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        isSuperhost: true,
        joinedYear: 2026,
        responseRate: '100% within 15 min',
      },
      hasAirportPickup: hasAirportPickup,
      hasLuggageAssistance: true,
    };

    setHostListings([newProp, ...hostListings]);
    setIsCreatedSuccess(true);
    setTimeout(() => {
      setIsCreatedSuccess(false);
      setIsNewListingModalOpen(false);
      // Reset form
      setTitle('');
      setCity('');
      setDescription('');
      setPreviewPhotos([]);
    }, 1800);
  };

  // If not a host, show lock screen
  if (!currentUser || currentUser.role !== 'host') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Host Access Required</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6 max-w-sm mx-auto">
          The Host Dashboard is only available for verified Host Partner accounts. Sign up or switch to your host account to manage listings.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => requireAuth('host', 'access the Host Dashboard')}
            className="px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Sign In as Host
          </button>
          <button
            onClick={() => setActiveTab('stays')}
            className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 text-sm font-bold hover:border-neutral-600 transition-colors cursor-pointer"
          >
            Browse as Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Host Partner Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1.5">
            Host Performance & Listings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your properties, monitor earnings, and coordinate guest arrivals with SmartStay Concierge.
            {currentUser && <span className="text-amber-700 font-semibold"> · {currentUser.name}</span>}
          </p>
        </div>

        <button
          onClick={handleOpenAddListing}
          className="px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Monthly Earnings</span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            {formatPrice(215000)}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            +18% from last month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Occupancy Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            84.2%
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            26 booked nights this month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Guest Rating</span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span>4.97</span>
          </div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            Superhost Verified Status
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Damage Protection</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {formatPrice(8400000)}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            SmartStay HostCover active
          </span>
        </div>
      </div>

      {/* Listings Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Your Active Listings ({hostListings.length})</h2>
          <span className="text-xs text-neutral-400">All properties 100-point safety inspected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostListings.map((prop) => (
            <div key={prop.id} className="rounded-3xl border border-neutral-200/80 overflow-hidden bg-white shadow-2xs space-y-3 p-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
                <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-full text-[10px] font-bold text-neutral-900">
                  Active Online
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 truncate">{prop.title}</h4>
                <p className="text-xs text-neutral-500">{prop.location}</p>
                <div className="mt-2 flex items-baseline justify-between text-xs font-bold text-neutral-900">
                  <span>{formatPrice(prop.pricePerNight)} / night</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">★ {prop.rating}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Airport Sync: {prop.hasAirportPickup ? '✓ Yes' : '✗ No'}</span>
                <button
                  onClick={() => alert(`Opening listing settings for ${prop.title}`)}
                  className="text-xs font-bold text-neutral-800 underline hover:text-black cursor-pointer"
                >
                  Edit Rates
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Listing Modal */}
      {isNewListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setIsNewListingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-neutral-900 mb-1">List Your Property on SmartStay</h3>
            <p className="text-xs text-neutral-500 mb-5">India & International hosts welcome. Zero upfront fees.</p>

            <form onSubmit={handleCreateListing} className="space-y-4">
              
              {/* Property Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Heritage Villa with Infinity Pool"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Candolim, Goa"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="India">India (Default)</option>
                    <option value="Greece">Greece</option>
                    <option value="France">France</option>
                    <option value="Indonesia">Indonesia (Bali)</option>
                    <option value="Japan">Japan</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="UAE">UAE (Dubai)</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Maldives">Maldives</option>
                  </select>
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nightly Price (INR)</label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={priceINR}
                    onChange={(e) => setPriceINR(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="villas">Villas</option>
                    <option value="beach">Beach</option>
                    <option value="mountains">Mountains</option>
                    <option value="apartments">Apartments</option>
                    <option value="countryside">Countryside</option>
                    <option value="unique">Unique Stays</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your property's highlights, views, amenities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Property Photos</label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-neutral-300 hover:border-[#FF385C] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors cursor-pointer text-neutral-500 hover:text-[#FF385C]"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-semibold">Click to upload photos</span>
                  <span className="text-[11px] text-neutral-400">JPG, PNG, WEBP · Up to 4 photos</span>
                </button>

                {/* Photo Previews */}
                {previewPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {previewPhotos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                        <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setPreviewPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Airport Pickup Toggle */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between cursor-pointer">
                <div className="text-xs">
                  <div className="font-bold text-neutral-900">Enable SmartStay Airport Chauffeur</div>
                  <div className="text-[10px] text-neutral-500">Pair your stay with certified arrival drivers</div>
                </div>
                <input
                  type="checkbox"
                  checked={hasAirportPickup}
                  onChange={(e) => setHasAirportPickup(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              {isCreatedSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Listing Published Successfully to SmartStay!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Publish Property Listing
                </button>
              )}
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
