'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Car, 
  KeyRound, 
  Luggage, 
  Download, 
  X, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Heart,
  FileCheck2,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROPERTIES } from '../../data/properties';
import { UserBooking, Property } from '../../types';

export const GuestDashboard: React.FC = () => {
  const { 
    bookings, 
    cancelBooking, 
    formatPrice, 
    setActiveTab, 
    setSelectedCheckInProperty,
    setIsDriverModalOpen,
    setActiveDriver,
    favorites,
    toggleFavoriteWithAuth,
    setSelectedOfflineVoucher,
    setIsOfflineVoucherModalOpen,
    currentUser,
    requireAuth,
  } = useApp();

  const [dashTab, setDashTab] = useState<'bookings' | 'wishlist'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Auth check on mount effect
  const isAuthed = !!currentUser;

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const wishlistProperties = PROPERTIES.filter((p) => favorites.has(p.id));

  const handleOpenKey = (booking: UserBooking) => {
    const matchingProp = PROPERTIES.find((p) => p.title.toLowerCase().includes(booking.title.toLowerCase().slice(0, 10))) || PROPERTIES[0];
    setSelectedCheckInProperty(matchingProp);
  };

  const handleTrackDriver = (booking: UserBooking) => {
    if (booking.driver) {
      setActiveDriver(booking.driver);
    }
    setIsDriverModalOpen(true);
  };

  const handleViewVoucher = (booking: UserBooking) => {
    if (booking.offlineVoucher) {
      setSelectedOfflineVoucher(booking.offlineVoucher);
      setIsOfflineVoucherModalOpen(true);
    }
  };

  const handleDownloadInvoice = (bookingId: string) => {
    alert(`Generating SmartStay Tax Invoice & Boarding Pass for ${bookingId}... (PDF export requires print/save in browser)`);
  };

  if (!isAuthed) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldCheck className="w-8 h-8 text-[#FF385C]" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Login Required</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6 max-w-sm mx-auto">
          Sign in as a Guest to view your trips, bookings, and saved wishlist.
        </p>
        <button
          onClick={() => requireAuth('guest', 'view your Guest Dashboard')}
          className="px-6 py-3 rounded-full bg-[#FF385C] text-white text-sm font-bold hover:bg-[#E00B41] transition-colors cursor-pointer"
        >
          Sign In / Register as Guest
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Guest Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-0.5">
            My Trips & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Welcome back, <strong>{currentUser?.name}</strong>. Manage your stays, cabs, and arrival passes.
          </p>
        </div>

        {/* Top-level tab: Bookings | Wishlist */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDashTab('bookings')}
            className={`px-5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              dashTab === 'bookings'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setDashTab('wishlist')}
            className={`px-5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              dashTab === 'wishlist'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${dashTab === 'wishlist' ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
            Wishlist ({favorites.size})
          </button>
        </div>
      </div>

      {/* ========== BOOKINGS TAB ========== */}
      {dashTab === 'bookings' && (
        <>
          {/* Booking Filter Pills */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl text-xs font-bold w-fit mb-5">
            <button
              onClick={() => setBookingFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                bookingFilter === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setBookingFilter('active')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                bookingFilter === 'active' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active & Upcoming
            </button>
            <button
              onClick={() => setBookingFilter('completed')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                bookingFilter === 'completed' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Past Stays
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all"
                >
                  {/* Left Item Details */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                      <Image src={b.image} alt={b.title} fill className="object-cover" />
                      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase">
                        {b.itemType}
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-neutral-400">
                          {b.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                        {b.hasAirportTransfer && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Airport Transfer
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-neutral-900 truncate max-w-lg">
                        {b.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                          {b.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-semibold text-neutral-800">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          {b.dateRange}
                        </span>
                      </div>

                      <div className="text-xs font-black text-neutral-900 pt-0.5">
                        Total: {formatPrice(b.totalPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    
                    {b.itemType === 'stay' && b.status === 'active' && (
                      <button
                        onClick={() => handleOpenKey(b)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Smart Key</span>
                      </button>
                    )}

                    {b.driver && b.status === 'active' && (
                      <button
                        onClick={() => handleTrackDriver(b)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Track Chauffeur</span>
                      </button>
                    )}

                    {/* Offline Voucher Button — shown when airport transfer booked */}
                    {b.hasAirportTransfer && b.status === 'active' && (
                      <button
                        onClick={() => handleViewVoucher(b)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="View & Save Offline Airport Voucher"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Offline Pass</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownloadInvoice(b.id)}
                      className="p-2 border border-neutral-200 hover:border-neutral-400 rounded-xl text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                      title="Download Invoice PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {b.status === 'active' && (
                      <button
                        onClick={() => {
                          if (confirm(`Cancel booking ${b.id}? Refund processed as per cancellation policy.`)) {
                            cancelBooking(b.id);
                          }
                        }}
                        className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* Empty Bookings State */
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No trips in this view</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-5">
                Explore authentic stays in Goa, Manali, Jaipur or worldwide.
              </p>
              <button
                onClick={() => setActiveTab('stays')}
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore Stays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ========== WISHLIST TAB ========== */}
      {dashTab === 'wishlist' && (
        <>
          {wishlistProperties.length > 0 ? (
            <div>
              <p className="text-xs text-neutral-500 mb-5">
                Your {wishlistProperties.length} saved favourite{wishlistProperties.length > 1 ? 's' : ''} — ready to book whenever you are.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {wishlistProperties.map((prop) => (
                  <div key={prop.id} className="relative group rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs bg-white hover:shadow-md transition-all">
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <Image src={prop.images[0]} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button
                        onClick={() => toggleFavoriteWithAuth(prop.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm transition-all hover:scale-110 cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-neutral-500 truncate">{prop.location}, {prop.country}</p>
                      <h4 className="text-sm font-bold text-neutral-900 truncate mt-0.5">{prop.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-neutral-900">
                          {formatPrice(prop.pricePerNight)}
                          <span className="text-xs font-normal text-neutral-500"> / night</span>
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-0.5">
                          ★ {prop.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-5">
                Tap the heart icon on any property to save it here for later.
              </p>
              <button
                onClick={() => setActiveTab('stays')}
                className="px-5 py-2.5 rounded-full bg-[#FF385C] text-white text-xs font-bold hover:bg-[#E00B41] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Discover Stays</span>
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
