'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Star, 
  Heart, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  Luggage, 
  Check, 
  Car, 
  Award,
  KeyRound,
  MessageSquare,
  Send,
  Plus
} from 'lucide-react';
import { Property, Review, OfflineAirportVoucher } from '../types';
import { useApp } from '../context/AppContext';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBookSuccess: (property: Property, total: number) => void;
  onOpenCheckIn: (property: Property) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBookSuccess,
  onOpenCheckIn,
}) => {
  const { 
    formatPrice, 
    addBooking, 
    setActiveDriver, 
    activeDriver, 
    currentUser, 
    requireAuth, 
    setSelectedOfflineVoucher,
    t 
  } = useApp();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [nights, setNights] = useState(4);
  const [includeAirportPickup, setIncludeAirportPickup] = useState(true);
  const [includeDayCab, setIncludeDayCab] = useState(false);
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  // Reviews state (allows adding a new review interactively)
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    if (property) {
      setReviewsList(property.reviews || [
        {
          id: 'rev-def-1',
          userName: 'Priya Sharma',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          date: 'October 2026',
          comment: 'Outstanding stay! The place was spotless, check-in was seamless, and the chauffeur transfer was on time with our luggage escorted to our room.',
          cleanliness: 5,
          accuracy: 5,
          value: 5,
        },
        {
          id: 'rev-def-2',
          userName: 'Marcus Sterling',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          rating: 4.9,
          date: 'September 2026',
          comment: 'Spectacular views and world-class hospitality. Having the verified driver on standby made exploring so easy.',
          cleanliness: 5,
          accuracy: 5,
          value: 4.8,
        },
      ]);
    }
  }, [property]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!property) return null;

  // Transparent calculations in INR base
  const basePrice = property.pricePerNight * nights;
  const cleaningFee = 1500;
  const serviceFee = Math.round(basePrice * 0.08);
  const airportFee = includeAirportPickup ? 2400 : 0;
  const dayCabFee = includeDayCab ? 3200 : 0;
  const totalPrice = basePrice + cleaningFee + serviceFee + airportFee + dayCabFee;

  const handleReserve = () => {
    // Auth guard — must be logged in as a guest to book
    if (!requireAuth('guest', 'reserve a stay')) {
      return;
    }

    setIsBookingDone(true);
    setTimeout(() => {
      // Build offline airport voucher if airport pickup selected
      let offlineVoucher: OfflineAirportVoucher | undefined;
      if (includeAirportPickup) {
        const bookingRef = `SS-${property.city?.toUpperCase().slice(0, 3) || 'AIR'}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        offlineVoucher = {
          bookingId: bookingRef,
          passengerName: currentUser?.name || 'SmartStay Guest',
          passengerPhone: currentUser?.phone || '+91 XXXXX XXXXX',
          airportName: `${property.city || property.location} Airport — ${property.country}`,
          flightNumber: 'TBD — update in My Trips',
          arrivalDateTime: property.availableDates,
          driverName: activeDriver?.name || 'Rajesh Sharma',
          driverPhone: activeDriver?.phone || '+91 98201 44521',
          vehicleModel: activeDriver?.vehicleModel || 'Toyota Innova Crysta (Luxury SUV)',
          vehicleNumber: activeDriver?.vehicleNumber || 'GA 03 E 4590',
          terminalMeetingPoint: 'Arrival Exit Gate — Pillar #4 (Driver with SmartStay Gold Name Plaque)',
          baggageCount: 2,
          voucherCode: bookingRef,
          savedOfflineAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          offlineTips: {
            airportWifi: 'Connect to "Free_Airport_WiFi" → Enter mobile number → Receive complimentary 45-min access.',
            roamingEsim: 'If on an international carrier, enable data roaming or buy a prepaid eSIM from the airport kiosk.',
            smsCallBackup: 'In case of luggage carousel delay, call or SMS the driver directly without internet.',
          },
        };
        setSelectedOfflineVoucher(offlineVoucher);
      }

      // Create real persistent booking in AppContext
      addBooking({
        itemType: 'stay',
        title: property.title,
        location: `${property.location}, ${property.country}`,
        image: property.images[0],
        dateRange: `${nights} Nights · ${property.availableDates}`,
        guestsCount: property.maxGuests,
        totalPrice: totalPrice,
        currency: 'INR',
        status: 'active',
        hasAirportTransfer: includeAirportPickup,
        driver: includeAirportPickup ? (activeDriver || undefined) : undefined,
        checkInPass: property.smartCheckIn ? {
          doorCode: property.smartCheckIn.doorCode,
          wifiNetwork: property.smartCheckIn.wifiNetwork,
          wifiPassword: property.smartCheckIn.wifiPassword,
        } : undefined,
        offlineVoucher,
      });

      onBookSuccess(property, totalPrice);
      setIsBookingDone(false);
      onClose();
    }, 1200);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: newReviewAuthor.trim() || 'Verified Guest',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      cleanliness: newReviewRating,
      accuracy: 5,
      value: newReviewRating,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewComment('');
    setNewReviewAuthor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-800 bg-neutral-100 px-3 py-1 rounded-full">
              SmartStay Verified Stay
            </span>
            {property.isDomesticIndia && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                🇮🇳 Incredible India
              </span>
            )}
            {property.guestFavorite && (
              <span className="text-xs font-semibold text-[#FF385C] bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full hidden sm:inline">
                ★ {t('guestFavorite')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCheckIn(property)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
              title="Preview Digital Smart Key & Directions"
            >
              <KeyRound className="w-3.5 h-3.5 text-neutral-700" />
              <span className="hidden sm:inline">Smart Key Info</span>
            </button>

            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Listing link copied to clipboard!");
              }}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors ml-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-neutral-600">
              <span className="flex items-center gap-1 font-bold text-neutral-900">
                <Star className="w-4 h-4 fill-neutral-900" />
                {property.rating.toFixed(2)} · <span className="underline">{reviewsList.length} reviews</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium text-neutral-700">
                <MapPin className="w-4 h-4 text-[#FF385C]" />
                {property.location}, {property.country}
              </span>
            </div>
          </div>

          {/* Photo Gallery Grid (Iconic Airbnb 3-Column / 5-Photo Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <div className="relative md:col-span-2 h-64 md:h-full bg-neutral-100 cursor-pointer overflow-hidden group">
              <Image
                src={property.images[selectedPhotoIndex] || property.images[0]}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-3 h-full">
              {property.images.slice(1, 3).map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedPhotoIndex(i + 1)}
                  className="relative h-full bg-neutral-100 cursor-pointer overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`${property.title} view ${i + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation: Overview vs Reviews */}
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Overview & Amenities
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Guest Reviews ({reviewsList.length})</span>
            </button>
          </div>

          {/* 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {activeTab === 'overview' ? (
                <>
                  {/* Host & Capacity */}
                  <div className="pb-6 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900">
                        Entire home hosted by {property.host.name}
                      </h2>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} baths
                      </p>
                    </div>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-200">
                      <Image
                        src={property.host.avatar}
                        alt={property.host.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-4 py-2 border-b border-neutral-100">
                    {property.superhost && (
                      <div className="flex items-start gap-4">
                        <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-neutral-900 text-sm">Superhost Experience</h4>
                          <p className="text-xs text-neutral-500">
                            {property.host.name} has a 100% verified rating and {property.host.responseRate} response time.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <Luggage className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm">Airport Chauffeur & Luggage VIP</h4>
                        <p className="text-xs text-neutral-500">
                          Pre-arranged terminal meet & greet, flight delay sync, and door-to-door luggage handling available.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm">Stay Smart. Travel Safe Guarantee</h4>
                        <p className="text-xs text-neutral-500">
                          Sanitized premises, 100-point safety check, and 24/7 dedicated travel concierge support.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="py-2 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-900 text-base mb-2">About this space</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="py-2">
                    <h3 className="font-bold text-neutral-900 text-base mb-4">What this place offers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-neutral-700">
                          <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Reviews Tab Content */
                <div className="space-y-6">
                  
                  {/* Reviews Summary */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-neutral-900 flex items-center gap-1.5">
                        <Star className="w-6 h-6 fill-neutral-900 text-neutral-900" />
                        <span>{property.rating.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">Overall rating based on {reviewsList.length} verified stays</p>
                    </div>

                    <div className="text-right text-xs space-y-1">
                      <div className="text-neutral-700 font-semibold">Cleanliness: 4.9 ★</div>
                      <div className="text-neutral-700 font-semibold">Accuracy: 5.0 ★</div>
                      <div className="text-neutral-700 font-semibold">Location: 4.9 ★</div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl border border-neutral-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
                              <Image src={rev.userAvatar} alt={rev.userName} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{rev.userName}</p>
                              <p className="text-[11px] text-neutral-400">{rev.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-full">
                            ★ {rev.rating}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Form */}
                  <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                    <h4 className="text-sm font-bold text-neutral-900">Leave a Review</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Great</option>
                        <option value={3}>3 Stars - Average</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience (cleanliness, comfort, airport transfer, etc.)..."
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-800 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </button>
                    </div>
                  </form>

                </div>
              )}

            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl space-y-4 sticky top-20">
              
              {/* Price header */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-3">
                <div>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatPrice(property.pricePerNight)}
                  </span>
                  <span className="text-neutral-500 text-sm ml-1 font-normal">/ {t('perNight')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                  <Star className="w-3.5 h-3.5 fill-neutral-900" />
                  <span>{property.rating.toFixed(2)}</span>
                  <span className="text-neutral-400 font-normal">({reviewsList.length})</span>
                </div>
              </div>

              {/* Nights selector */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Duration</span>
                  <span className="text-sm font-semibold text-neutral-900">{nights} Nights Stay</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{nights}</span>
                  <button
                    onClick={() => setNights(Math.min(30, nights + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Optional Add-on 1: Airport Pickup & Luggage Care */}
              <div 
                onClick={() => setIncludeAirportPickup(!includeAirportPickup)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  includeAirportPickup 
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeAirportPickup}
                  onChange={() => {}}
                  className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5 text-emerald-600" />
                      Airport Chauffeur & Luggage Escort
                    </span>
                    <span className="font-bold text-emerald-700">+{formatPrice(2400)}</span>
                  </div>
                  <p className="text-neutral-500 mt-0.5 leading-snug">
                    Punctual flight tracking, terminal greeting & door-to-door luggage handling.
                  </p>
                </div>
              </div>

              {/* Optional Add-on 2: Local Sightseeing Day Cab */}
              <div 
                onClick={() => setIncludeDayCab(!includeDayCab)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  includeDayCab 
                    ? 'border-blue-500 bg-blue-50/40 shadow-2xs' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeDayCab}
                  onChange={() => {}}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      Dedicated Sightseeing Cab (8h)
                    </span>
                    <span className="font-bold text-blue-700">+{formatPrice(3200)}</span>
                  </div>
                  <p className="text-neutral-500 mt-0.5 leading-snug">
                    Full-day car on standby for local monuments, dining, and city exploration.
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning & sanitization fee</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(cleaningFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SmartStay Safe service & travel cover</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(serviceFee)}</span>
                </div>
                {includeAirportPickup && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Airport Concierge & Bags</span>
                    <span>{formatPrice(airportFee)}</span>
                  </div>
                )}
                {includeDayCab && (
                  <div className="flex justify-between text-blue-700 font-semibold">
                    <span>Sightseeing Cab (8 Hours)</span>
                    <span>{formatPrice(dayCabFee)}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-neutral-900">Total Price</span>
                  <span className="text-2xl font-black text-neutral-900">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Reserve CTA */}
              <button
                onClick={handleReserve}
                disabled={isBookingDone}
                className="w-full bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:brightness-105 active:scale-98 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBookingDone ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming Reservation...
                  </span>
                ) : (
                  <span>{t('reserve')} with SmartStay</span>
                )}
              </button>

              <div className="text-center text-[11px] text-neutral-400">
                Transparent pricing · No hidden fees · Safe Guarantee
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
