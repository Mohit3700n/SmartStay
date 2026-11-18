'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { PropertyCard } from './components/PropertyCard';
import { ConciergeSection } from './components/ConciergeSection';
import { PropertyModal } from './components/PropertyModal';
import { HostModal } from './components/HostModal';
import { AuthModal } from './components/AuthModal';
import { WelcomeGateModal } from './components/WelcomeGateModal';
import { OfflineVoucherModal } from './components/OfflineVoucherModal';
import { ExperiencesSection } from './components/ExperiencesSection';
import { CabsSection } from './components/CabsSection';
import { DriverAssignmentModal } from './components/DriverAssignmentModal';
import { SafetySOSModal } from './components/SafetySOSModal';
import { SmartCheckInModal } from './components/SmartCheckInModal';
import { AiTravelAssistant } from './components/AiTravelAssistant';
import { SmartStayPlus } from './components/SmartStayPlus';
import { GuestDashboard } from './components/Dashboards/GuestDashboard';
import { HostDashboard } from './components/Dashboards/HostDashboard';
import { AdminDashboard } from './components/Dashboards/AdminDashboard';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { PROPERTIES } from './data/properties';
import { CategoryId, Property, SearchFilters } from './types';
import { useApp } from './context/AppContext';
import { Compass, RotateCcw, Heart, ShieldCheck } from 'lucide-react';
export default function Home() {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setCurrentUser,
    favorites,
    toggleFavoriteWithAuth,
    setSelectedCheckInProperty,
    formatPrice,
    t,
    // Auth & modals from AppContext
    isWelcomeGatewayOpen,
    setIsWelcomeGatewayOpen,
    authModalConfig,
    setAuthModalConfig,
    isOfflineVoucherModalOpen,
    setIsOfflineVoucherModalOpen,
    requireAuth,
    selectedOfflineVoucher,
  } = useApp();

  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // Favorites filter toggle on main stays page
  const [isShowingFavoritesOnly, setIsShowingFavoritesOnly] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [onlyAirportPickup, setOnlyAirportPickup] = useState(false);
  const [onlyGuestFavorite, setOnlyGuestFavorite] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  // Search State (synced with AppContext via HeroSection)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: { adults: 1, children: 0, infants: 0 },
    rooms: 1,
  });

  // Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Favorite — uses auth-aware method from AppContext
  const handleToggleFavorite = (propertyId: string) => {
    const success = toggleFavoriteWithAuth(propertyId);
    if (!success) return; // was blocked by auth gate

    const prop = PROPERTIES.find((p) => p.id === propertyId);
    const title = prop ? prop.location : 'Stay';

    if (favorites.has(propertyId)) {
      addToast('favorite', 'Removed from Wishlist', `${title} removed from your saved list.`);
    } else {
      addToast('favorite', 'Saved to Wishlist', `${title} added to your favourites!`);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setOnlyAirportPickup(false);
    setOnlyGuestFavorite(false);
    setMaxPriceFilter(null);
    setIsShowingFavoritesOnly(false);
    setSearchFilters({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: { adults: 1, children: 0, infants: 0 },
      rooms: 1,
    });
  };

  // Quick destination filter from hero
  const handleQuickDestinationSelect = (dest: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      destination: prev.destination.toLowerCase() === dest.toLowerCase() ? '' : dest,
    }));
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter Properties Calculation
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((property) => {
      // Favorites filter
      if (isShowingFavoritesOnly && !favorites.has(property.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && property.category !== selectedCategory) {
        return false;
      }

      // Destination search filter — matches city, state, country, location, or title
      if (searchFilters.destination.trim()) {
        const query = searchFilters.destination.toLowerCase().trim();
        const matchesCity = property.city?.toLowerCase().includes(query);
        const matchesState = property.state?.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesCountry = property.country.toLowerCase().includes(query);
        const matchesTitle = property.title.toLowerCase().includes(query);
        if (!matchesCity && !matchesState && !matchesLocation && !matchesCountry && !matchesTitle) {
          return false;
        }
      }

      // Guest count filter
      const totalGuests = searchFilters.guests.adults + searchFilters.guests.children;
      if (totalGuests > 1 && property.maxGuests < totalGuests) {
        return false;
      }

      // Airport pickup filter
      if (onlyAirportPickup && !property.hasAirportPickup) {
        return false;
      }

      // Guest favorite filter
      if (onlyGuestFavorite && !property.guestFavorite) {
        return false;
      }

      // Max price filter (base in INR)
      if (maxPriceFilter !== null && property.pricePerNight > maxPriceFilter * 84) {
        return false;
      }

      return true;
    });
  }, [
    isShowingFavoritesOnly,
    favorites,
    selectedCategory,
    searchFilters,
    onlyAirportPickup,
    onlyGuestFavorite,
    maxPriceFilter,
  ]);

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode, role: 'guest' })}
        onOpenHostModal={() => setIsHostModalOpen(true)}
        savedFavoritesCount={favorites.size}
        onToggleFavoritesFilter={() => setIsShowingFavoritesOnly(!isShowingFavoritesOnly)}
        isShowingFavoritesOnly={isShowingFavoritesOnly}
      />

      <main className="flex-1 w-full">
        
        {/* VIEW 1: STAYS (DEFAULT & AIRBNB-INSPIRED HOMEPAGE) */}
        {activeTab === 'stays' && (
          <>
            {/* Hero Section with Floating Search */}
            <HeroSection
              onSearch={(filters) => {
                setSearchFilters({ ...filters, rooms: filters.rooms ?? 1 });
                const el = document.getElementById('properties-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              activeFilters={searchFilters}
              onReset={handleResetFilters}
              onQuickDestinationSelect={handleQuickDestinationSelect}
            />

            {/* Category Filter Navigation */}
            <div id="properties-section">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => {
                  setSelectedCategory(id);
                  if (isShowingFavoritesOnly) setIsShowingFavoritesOnly(false);
                }}
                onlyAirportPickup={onlyAirportPickup}
                onToggleAirportPickup={() => setOnlyAirportPickup(!onlyAirportPickup)}
                onlyGuestFavorite={onlyGuestFavorite}
                onToggleGuestFavorite={() => setOnlyGuestFavorite(!onlyGuestFavorite)}
                maxPriceFilter={maxPriceFilter}
                onSetMaxPriceFilter={setMaxPriceFilter}
                totalFilteredCount={filteredProperties.length}
              />
            </div>

            {/* Wishlist Active Notification Banner */}
            {isShowingFavoritesOnly && (
              <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-2 mb-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between text-xs text-rose-900">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                    <span className="font-semibold text-sm">
                      Showing your {favorites.size} saved favourite stays.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsShowingFavoritesOnly(false)}
                    className="font-bold underline hover:text-rose-950 cursor-pointer text-xs"
                  >
                    Show All Stays
                  </button>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
              
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                    {searchFilters.destination ? (
                      `Stays matching "${searchFilters.destination}"`
                    ) : selectedCategory !== 'all' ? (
                      `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Accommodations`
                    ) : (
                      'Featured Stays in India & Worldwide'
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                    Verified properties with optional chauffeured airport luggage assistance.
                  </p>
                </div>

                <span className="text-xs font-semibold text-neutral-400">
                  {filteredProperties.length} stays available
                </span>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isFavorite={favorites.has(property.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(prop) => setSelectedProperty(prop)}
                    />
                  ))}
                </div>
              ) : (
                /* Minimal Empty State */
                <div className="py-24 text-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-4">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">No properties match your search</h3>
                  <p className="text-xs text-neutral-500 mt-1 mb-6 leading-relaxed">
                    Try searching for Goa, Udaipur, Manali, Kerala, Paris, or clear destination filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

            </section>

            {/* Airport Pickup and Luggage Assistance Special Section */}
            <ConciergeSection
              onBookAssistanceClick={(details) => {
                addToast(
                  'airport',
                  'Chauffeur Assigned & Reserved',
                  `${details.vehicle.toUpperCase()} requested at ${details.airport.split('(')[0]} with ${details.bags} luggage bags.`
                );
              }}
            />

            {/* Travel Safe Assurance Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 mb-12">
              <div className="rounded-3xl bg-neutral-50 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF385C] flex items-center justify-center shrink-0 border border-rose-100">
                    <ShieldCheck className="w-7 h-7 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Stay Smart. Travel Safe.
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl leading-relaxed">
                      Every SmartStay booking is covered by our comprehensive guest protection guarantee: verified host identities, sanitized cleanliness standards, and 24/7 dedicated travel concierge.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsHostModalOpen(true)}
                  className="whitespace-nowrap px-6 py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Learn About SmartStay Safe
                </button>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: EXPERIENCES */}
        {activeTab === 'experiences' && (
          <ExperiencesSection />
        )}

        {/* VIEW 3: CABS & SIGHTSEEING */}
        {activeTab === 'cabs' && (
          <CabsSection />
        )}

        {/* VIEW: SMARTSTAY+ TRIP HUB */}
        {activeTab === 'smartstay-plus' && (
          <SmartStayPlus />
        )}

        {/* VIEW 4: GUEST DASHBOARD */}
        {activeTab === 'guest-dashboard' && (
          <GuestDashboard />
        )}

        {/* VIEW 5: HOST DASHBOARD */}
        {activeTab === 'host-dashboard' && (
          <HostDashboard />
        )}

        {/* VIEW 6: ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}

      </main>

      {/* Global Footer */}
      <Footer />

      {/* ============================================================ */}
      {/* GLOBAL MODALS & DIALOGS                                       */}
      {/* ============================================================ */}

      {/* Welcome Gate — shown on first visit or when user opens role-selector */}
      <WelcomeGateModal
        isOpen={isWelcomeGatewayOpen}
        onClose={() => setIsWelcomeGatewayOpen(false)}
        onSelectRole={(role) => {
          setIsWelcomeGatewayOpen(false);
          setAuthModalConfig({ isOpen: true, mode: 'login', role });
        }}
        onContinueAsVisitor={() => {
          setIsWelcomeGatewayOpen(false);
          addToast('auth', 'Browsing as Visitor', 'You can explore stays. Login is required to book or save favourites.');
        }}
      />

      {/* Pre-Booked Airport Offline Voucher Modal */}
      <OfflineVoucherModal
        voucher={isOfflineVoucherModalOpen ? selectedOfflineVoucher : null}
        onClose={() => setIsOfflineVoucherModalOpen(false)}
      />

      {/* Property Detail & Booking Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.has(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenCheckIn={(prop) => setSelectedCheckInProperty(prop)}
        onBookSuccess={(prop, total) => {
          addToast(
            'booking',
            'Reservation Confirmed!',
            `Booked ${prop.title} for ${formatPrice(total)}. Digital keycard available in My Trips.`
          );
        }}
      />

      <HostModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
      />

      {/* Auth Modal — driven by AppContext authModalConfig */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        forcedRole={authModalConfig.role}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalConfig({ ...authModalConfig, isOpen: false });
          addToast('auth', `Welcome, ${user.name}!`, `Signed in as ${user.role === 'host' ? 'Host Partner' : 'Guest'}.`);
        }}
      />

      {/* Driver Tracking Simulation Modal */}
      <DriverAssignmentModal />

      {/* Safety SOS & Trip Sharing Modal */}
      <SafetySOSModal />

      {/* Smart Keycard & Nearby Essentials Modal */}
      <SmartCheckInModal />

      {/* AI Travel Assistant Copilot */}
      <AiTravelAssistant />

      {/* Floating Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
