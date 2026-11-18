import { CabPackage } from '../types';

export const CAB_PACKAGES: CabPackage[] = [
  {
    id: 'cab-pkg-1',
    title: 'Half-Day City Sightseeing Highlights',
    type: 'sightseeing',
    duration: '4 Hours',
    distanceCovered: '40 km included',
    popularIn: 'Delhi, Mumbai, Jaipur, Udaipur, Goa',
    basePrice: 1850, // INR
    recommendedVehicle: 'Air-conditioned Sedan (Swift Dzire / Etios)',
    description: 'Perfect for quick local monument visits, shopping in heritage bazaars, or scenic coastline drives with an English/Hindi speaking certified driver.',
    highlights: ['Flexible stops on demand', 'Complimentary bottled water', 'Toll & parking included', 'Air-conditioned sanitized car'],
  },
  {
    id: 'cab-pkg-2',
    title: 'Full-Day Grand Heritage Circuit',
    type: 'sightseeing',
    duration: '8 Hours',
    distanceCovered: '80 km included',
    popularIn: 'Jaipur, Delhi, Udaipur, Agra, Kerala',
    basePrice: 3200, // INR
    recommendedVehicle: 'Premium Sedan or 6-Seater SUV',
    description: 'Comprehensive day exploration covering all top fortresses, palaces, museums, and scenic viewpoints at your own pace without taxi surge pricing.',
    highlights: ['Zero surge pricing guarantee', 'Driver acts as local culture guide', 'Customizable pickup & drop', 'Luggage space included'],
  },
  {
    id: 'cab-pkg-3',
    title: 'Executive Hourly Rental on Standby',
    type: 'hourly',
    duration: 'Hourly (Min 2 hrs)',
    distanceCovered: '10 km per hour',
    popularIn: 'All Indian Metro & Tourist Cities',
    basePrice: 650, // INR per hour
    recommendedVehicle: 'Toyota Innova Crysta / Honda City',
    description: 'A chauffeured vehicle on continuous standby outside your villa or hotel for meetings, dining out, and spontaneous visits.',
    highlights: ['Driver waits at all stops', 'Fuel & insurance covered', 'Pay per extra hour transparently', 'Instant SOS & GPS tracking'],
  },
  {
    id: 'cab-pkg-4',
    title: 'Scenic Outstation Day Excursion',
    type: 'outstation',
    duration: '12 Hours',
    distanceCovered: '180 km included',
    popularIn: 'Goa to Gokarna / Manali to Rohtang / Jaipur to Pushkar',
    basePrice: 5400, // INR
    recommendedVehicle: 'All-Terrain 7-Seater SUV',
    description: 'Intercity mountain passes, coastal beach hopping, or rural wildlife sanctuary excursions with an experienced highway chauffeur.',
    highlights: ['Highway toll passes included', 'All-weather mountain certified driver', 'Emergency roadside assistance', 'Phone charging & Wi-Fi hotspot'],
  },
];

export interface VehicleOption {
  id: string;
  category: 'sedan' | 'suv' | 'van';
  name: string;
  image: string;
  capacity: string;
  luggageCapacity: string;
  acType: string;
  priceMultiplier: number;
}

export const VEHICLE_FLEET: VehicleOption[] = [
  {
    id: 'v-sedan',
    category: 'sedan',
    name: 'Prime Sedan (Dzire / Etios / Honda City)',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    capacity: '1 - 4 Passengers',
    luggageCapacity: '2 Medium Suitcases',
    acType: 'Climate Controlled AC',
    priceMultiplier: 1.0,
  },
  {
    id: 'v-suv',
    category: 'suv',
    name: 'Executive SUV (Toyota Innova Crysta / Hycross)',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    capacity: '1 - 6 Passengers',
    luggageCapacity: '4 Large Suitcases',
    acType: 'Dual-Zone Air Conditioning',
    priceMultiplier: 1.45,
  },
  {
    id: 'v-van',
    category: 'van',
    name: 'VIP Traveler Van (Force Urbania / Mercedes Van)',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    capacity: '1 - 10 Passengers',
    luggageCapacity: '8+ Suitcases',
    acType: 'Individual AC Vents + Reclining Seats',
    priceMultiplier: 2.1,
  },
];
