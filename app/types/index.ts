export type CategoryId = 'all' | 'beach' | 'mountains' | 'villas' | 'apartments' | 'countryside' | 'unique';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type Language = 'EN' | 'HI' | 'FR' | 'ES';
export type UserRole = 'guest' | 'host' | 'visitor';
export type ActiveTab = 'stays' | 'experiences' | 'cabs' | 'concierge' | 'smartstay-plus' | 'guest-dashboard' | 'host-dashboard' | 'admin-dashboard';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'guest' | 'host';
  avatar: string;
  authProvider: 'supabase_email' | 'supabase_phone_otp' | 'demo';
  createdAt?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  cleanliness: number;
  accuracy: number;
  value: number;
}

export interface NearbyEssential {
  category: 'hospital' | 'pharmacy' | 'police' | 'atm' | 'transit';
  name: string;
  distance: string;
  phone?: string;
  address: string;
}

export interface SmartCheckInDetails {
  doorCode: string;
  wifiNetwork: string;
  wifiPassword: string;
  checkInTime: string;
  checkOutTime: string;
  houseRules: string[];
  directions: string;
  nearbyEssentials: NearbyEssential[];
}

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  state?: string;
  country: string;
  isDomesticIndia?: boolean;
  category: CategoryId;
  images: string[];
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  pricePerNight: number; // In INR base
  originalPrice?: number;
  guestFavorite?: boolean;
  superhost?: boolean;
  distance: string;
  availableDates: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    joinedYear: number;
    responseRate: string;
  };
  hasAirportPickup: boolean;
  hasLuggageAssistance: boolean;
  smartCheckIn?: SmartCheckInDetails;
}

export interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  category: 'heritage' | 'culinary' | 'adventure' | 'wellness' | 'nature';
  image: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number; // In INR
  duration: string;
  groupSize: string;
  languages: string[];
  included: string[];
  description: string;
  hostName: string;
  hostAvatar: string;
}

export interface CabPackage {
  id: string;
  title: string;
  type: 'hourly' | 'sightseeing' | 'airport' | 'outstation';
  duration: string;
  distanceCovered: string;
  description: string;
  popularIn: string;
  highlights: string[];
  basePrice: number; // In INR
  recommendedVehicle: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  completedTrips: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: 'sedan' | 'suv' | 'van';
  status: 'assigned' | 'en_route' | 'arrived' | 'completed';
  etaMinutes: number;
  currentLocation: string;
}

export interface OfflineAirportVoucher {
  bookingId: string;
  passengerName: string;
  passengerPhone: string;
  airportName: string;
  flightNumber: string;
  arrivalDateTime: string;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehicleNumber: string;
  terminalMeetingPoint: string;
  baggageCount: number;
  voucherCode: string;
  savedOfflineAt?: string;
  offlineTips: {
    airportWifi: string;
    roamingEsim: string;
    smsCallBackup: string;
  };
}

export interface UserBooking {
  id: string;
  itemType: 'stay' | 'experience' | 'cab';
  title: string;
  location: string;
  image: string;
  dateRange: string;
  guestsCount: number;
  totalPrice: number;
  currency: Currency;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  bookedAt: string;
  hasAirportTransfer?: boolean;
  driver?: DriverInfo;
  checkInPass?: {
    doorCode: string;
    wifiNetwork: string;
    wifiPassword: string;
  };
  offlineVoucher?: OfflineAirportVoucher;
}

export interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  rooms: number;
  priceRange?: [number, number];
  onlyAirportPickup?: boolean;
}
