'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Currency, 
  Language, 
  UserRole, 
  ActiveTab, 
  UserBooking, 
  DriverInfo, 
  Property, 
  UserProfile, 
  OfflineAirportVoucher,
  SearchFilters
} from '../types';
import { authService } from '../lib/supabase';

interface AppContextType {
  // Localization & Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  formatPrice: (amountInINR: number) => string;
  convertPrice: (amountInINR: number) => number;
  t: (key: string) => string;

  // Navigation & Role
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;

  // Search Filters (Synchronized & Working)
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  handleApplySearch: (filters: SearchFilters) => void;
  handleResetSearch: () => void;

  // Bookings & Wishlist
  bookings: UserBooking[];
  addBooking: (booking: Omit<UserBooking, 'id' | 'bookedAt'>) => UserBooking;
  cancelBooking: (id: string) => void;
  favorites: Set<string>;
  toggleFavoriteWithAuth: (id: string) => boolean;

  // Role Gate & Access Control
  requireAuth: (targetRole: 'guest' | 'host', actionDescription: string) => boolean;
  isWelcomeGatewayOpen: boolean;
  setIsWelcomeGatewayOpen: (open: boolean) => void;
  authModalConfig: { isOpen: boolean; mode: 'login' | 'signup'; role: 'guest' | 'host' };
  setAuthModalConfig: React.Dispatch<React.SetStateAction<{ isOpen: boolean; mode: 'login' | 'signup'; role: 'guest' | 'host' }>>;

  // Active Driver & Offline Airport Voucher
  activeDriver: DriverInfo | null;
  setActiveDriver: (driver: DriverInfo | null) => void;
  isDriverModalOpen: boolean;
  setIsDriverModalOpen: (open: boolean) => void;
  selectedOfflineVoucher: OfflineAirportVoucher | null;
  setSelectedOfflineVoucher: (v: OfflineAirportVoucher | null) => void;
  isOfflineVoucherModalOpen: boolean;
  setIsOfflineVoucherModalOpen: (open: boolean) => void;

  // Global Modals
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  selectedCheckInProperty: Property | null;
  setSelectedCheckInProperty: (p: Property | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Exchange rates relative to 1 INR (Base)
const EXCHANGE_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012, // 1 USD ≈ 83.3 INR
  EUR: 0.011, // 1 EUR ≈ 90.9 INR
  GBP: 0.0094, // 1 GBP ≈ 106.4 INR
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    stays: 'Stays',
    experiences: 'Experiences',
    cabs: 'Cabs & Sightseeing',
    concierge: 'Airport Concierge',
    dashboard: 'My Trips',
    hostDashboard: 'Host Dashboard',
    adminDashboard: 'Admin Portal',
    becomeHost: 'Become a Host',
    wishlists: 'Wishlists',
    login: 'Log in',
    signup: 'Sign up',
    search: 'Search',
    where: 'Where',
    when: 'When',
    who: 'Who',
    rooms: 'Rooms',
    addGuests: 'Add guests & rooms',
    searchDestinations: 'Search India or worldwide',
    guestFavorite: 'Guest favourite',
    perNight: 'night',
    perPerson: 'person',
    bookNow: 'Book Now',
    reserve: 'Reserve',
    safeGuarantee: 'Stay Smart. Travel Safe.',
    sosEmergency: 'Emergency SOS',
    aiAssistant: 'AI Travel Assistant',
  },
  HI: {
    stays: 'ठहराव (Stays)',
    experiences: 'अनुभव (Experiences)',
    cabs: 'कैब और दर्शनीय स्थल (Cabs)',
    concierge: 'एयरपोर्ट सेवा (Concierge)',
    dashboard: 'मेरी यात्राएं (My Trips)',
    hostDashboard: 'मेजबान डैशबोर्ड',
    adminDashboard: 'व्यवस्थापक पोर्टल',
    becomeHost: 'मेजबान बनें',
    wishlists: 'पसंदीदा सूची',
    login: 'लॉग इन करें',
    signup: 'साइन अप करें',
    search: 'खोजें',
    where: 'कहाँ',
    when: 'कब',
    who: 'कौन',
    rooms: 'कमरे',
    addGuests: 'मेहमान और कमरे जोड़ें',
    searchDestinations: 'भारत या विश्वभर में खोजें',
    guestFavorite: 'अतिथियों की पसंद',
    perNight: 'प्रति रात',
    perPerson: 'प्रति व्यक्ति',
    bookNow: 'अभी बुक करें',
    reserve: 'आरक्षित करें',
    safeGuarantee: 'स्मार्ट रहें. सुरक्षित घूमें.',
    sosEmergency: 'आपातकालीन एसओएस',
    aiAssistant: 'एआई यात्रा सहायक',
  },
  FR: {
    stays: 'Logements',
    experiences: 'Expériences',
    cabs: 'Taxis & Visites',
    concierge: 'Conciergerie Aéroport',
    dashboard: 'Mes Voyages',
    hostDashboard: 'Tableau de bord Hôte',
    adminDashboard: 'Portail Admin',
    becomeHost: 'Devenir hôte',
    wishlists: 'Favoris',
    login: 'Connexion',
    signup: 'Inscription',
    search: 'Rechercher',
    where: 'Destination',
    when: 'Dates',
    who: 'Voyageurs',
    rooms: 'Chambres',
    addGuests: 'Voyageurs et chambres',
    searchDestinations: 'Inde ou monde entier',
    guestFavorite: 'Coup de cœur voyageurs',
    perNight: 'nuit',
    perPerson: 'personne',
    bookNow: 'Réserver',
    reserve: 'Réserver',
    safeGuarantee: 'Voyagez Malin. Voyagez Sûr.',
    sosEmergency: 'Urgence SOS',
    aiAssistant: 'Assistant Voyage IA',
  },
  ES: {
    stays: 'Alojamientos',
    experiences: 'Experiencias',
    cabs: 'Taxis y Rutas',
    concierge: 'Conserjería Aeropuerto',
    dashboard: 'Mis Viajes',
    hostDashboard: 'Panel de Anfitrión',
    adminDashboard: 'Panel de Administrador',
    becomeHost: 'Hazte anfitrión',
    wishlists: 'Favoritos',
    login: 'Iniciar sesión',
    signup: 'Regístrate',
    search: 'Buscar',
    where: 'Destino',
    when: 'Fechas',
    who: 'Huéspedes',
    rooms: 'Habitaciones',
    addGuests: 'Huéspedes y habitaciones',
    searchDestinations: 'India o en todo el mundo',
    guestFavorite: 'Favorito entre huéspedes',
    perNight: 'noche',
    perPerson: 'persona',
    bookNow: 'Reservar ahora',
    reserve: 'Reservar',
    safeGuarantee: 'Viaja Inteligente. Viaja Seguro.',
    sosEmergency: 'Emergencia SOS',
    aiAssistant: 'Asistente de Viaje IA',
  },
};

const SAMPLE_ASSIGNED_DRIVER: DriverInfo = {
  id: 'drv-101',
  name: 'Rajesh Sharma',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  phone: '+91 98201 44521',
  rating: 4.96,
  completedTrips: 1420,
  vehicleModel: 'Toyota Innova Crysta (Luxury 7-Seater)',
  vehicleNumber: 'GA 03 E 4590',
  vehicleType: 'suv',
  status: 'en_route',
  etaMinutes: 10,
  currentLocation: 'Airport Expressway, Terminal 2 Approach',
};

const INITIAL_OFFLINE_VOUCHER: OfflineAirportVoucher = {
  bookingId: 'SS-AIR-2026-VCHR',
  passengerName: 'Aarav Mehta',
  passengerPhone: '+91 98201 44521',
  airportName: 'Goa Dabolim / Mopa (GOI/GOX) - India',
  flightNumber: '6E 204',
  arrivalDateTime: 'Nov 20, 2026 · 11:30 AM',
  driverName: 'Rajesh Sharma',
  driverPhone: '+91 98201 44521',
  vehicleModel: 'Toyota Innova Crysta (Silver AC)',
  vehicleNumber: 'GA 03 E 4590',
  terminalMeetingPoint: 'Arrival Gate 3, Pillar #4 (Driver holding SmartStay Gold Name Plaque)',
  baggageCount: 2,
  voucherCode: 'VCHR-9921-OK',
  savedOfflineAt: 'Nov 15, 2026',
  offlineTips: {
    airportWifi: 'Connect to "Free_Airport_WiFi" -> Enter mobile number -> Receive complimentary 45-min access.',
    roamingEsim: 'If landing on an international carrier, enable data roaming or purchase an airport kiosk prepaid eSIM.',
    smsCallBackup: 'In case of luggage carousel delay, place a direct voice call or standard SMS to +91 98201 44521 without internet.',
  },
};

const INITIAL_BOOKINGS: UserBooking[] = [
  {
    id: 'BK-IND-9021',
    itemType: 'stay',
    title: 'Villa Ocean Mist with Private Plunge Pool & Beach Trail',
    location: 'Candolim, North Goa, India',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    dateRange: 'Nov 20 – 25, 2026',
    guestsCount: 4,
    totalPrice: 42500,
    currency: 'INR',
    status: 'active',
    bookedAt: '12 Nov 2026',
    hasAirportTransfer: true,
    driver: SAMPLE_ASSIGNED_DRIVER,
    offlineVoucher: INITIAL_OFFLINE_VOUCHER,
    checkInPass: {
      doorCode: '4829#',
      wifiNetwork: 'OceanMist_Villa_5G',
      wifiPassword: 'sunsetparadise!',
    },
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [language, setLanguage] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState<ActiveTab>('stays');

  // User Profile & Authentication State (Null initially so welcome gate can guide Guest vs Host)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Welcome Gate Modal state (opens on first launch or when switching pathways)
  const [isWelcomeGatewayOpen, setIsWelcomeGatewayOpen] = useState(false);

  // Auth Modal Config
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
    role: 'guest' | 'host';
  }>({
    isOpen: false,
    mode: 'login',
    role: 'guest',
  });

  // Working Global Search State
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: { adults: 1, children: 0, infants: 0 },
    rooms: 1,
  });

  const [bookings, setBookings] = useState<UserBooking[]>(INITIAL_BOOKINGS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['prop-in-1', 'prop-in-2']));
  const [activeDriver, setActiveDriver] = useState<DriverInfo | null>(SAMPLE_ASSIGNED_DRIVER);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  // Offline Airport Voucher State
  const [selectedOfflineVoucher, setSelectedOfflineVoucher] = useState<OfflineAirportVoucher | null>(INITIAL_OFFLINE_VOUCHER);
  const [isOfflineVoucherModalOpen, setIsOfflineVoucherModalOpen] = useState(false);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [selectedCheckInProperty, setSelectedCheckInProperty] = useState<Property | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('smartstay_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Show welcome gate on first unauthenticated visit
        setIsWelcomeGatewayOpen(true);
      }

      const savedVoucher = localStorage.getItem('smartstay_offline_voucher');
      if (savedVoucher) {
        setSelectedOfflineVoucher(JSON.parse(savedVoucher));
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }, []);

  // Save user changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('smartstay_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('smartstay_user');
      }
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [currentUser]);

  // Auth Protection Gate
  const requireAuth = (targetRole: 'guest' | 'host', actionDescription: string): boolean => {
    if (currentUser) {
      if (targetRole === 'host' && currentUser.role !== 'host') {
        alert(`You are currently signed in as a Guest. Please sign in with your Host Partner account to ${actionDescription}.`);
        setAuthModalConfig({ isOpen: true, mode: 'login', role: 'host' });
        return false;
      }
      return true;
    }

    // Unauthenticated: prompt Login
    alert(`Login required: Please sign in or register as a ${targetRole === 'host' ? 'Host' : 'Guest'} to ${actionDescription}. Visitors can browse public listings.`);
    setAuthModalConfig({ isOpen: true, mode: 'login', role: targetRole });
    return false;
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setActiveTab('stays');
    alert('You have been safely signed out of SmartStay.');
  };

  const convertPrice = (amountInINR: number): number => {
    const rate = EXCHANGE_RATES[currency] || 1;
    return Math.round(amountInINR * rate);
  };

  const formatPrice = (amountInINR: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency] || '₹';
    const converted = convertPrice(amountInINR);
    return `${symbol}${converted.toLocaleString()}`;
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const toggleFavoriteWithAuth = (id: string): boolean => {
    if (!requireAuth('guest', 'save properties to your wishlist')) {
      return false;
    }

    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    return true;
  };

  const addBooking = (bookingData: Omit<UserBooking, 'id' | 'bookedAt'>): UserBooking => {
    const newBooking: UserBooking = {
      ...bookingData,
      id: `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      bookedAt: 'Just now',
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const handleApplySearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetSearch = () => {
    setSearchFilters({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: { adults: 1, children: 0, infants: 0 },
      rooms: 1,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        formatPrice,
        convertPrice,
        t,
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        logout,
        searchFilters,
        setSearchFilters,
        handleApplySearch,
        handleResetSearch,
        bookings,
        addBooking,
        cancelBooking,
        favorites,
        toggleFavoriteWithAuth,
        requireAuth,
        isWelcomeGatewayOpen,
        setIsWelcomeGatewayOpen,
        authModalConfig,
        setAuthModalConfig,
        activeDriver,
        setActiveDriver,
        isDriverModalOpen,
        setIsDriverModalOpen,
        selectedOfflineVoucher,
        setSelectedOfflineVoucher,
        isOfflineVoucherModalOpen,
        setIsOfflineVoucherModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isSosModalOpen,
        setIsSosModalOpen,
        selectedCheckInProperty,
        setSelectedCheckInProperty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
