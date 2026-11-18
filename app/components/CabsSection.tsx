'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Car, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Users, 
  Luggage,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAB_PACKAGES, VEHICLE_FLEET } from '../data/cabs';
import { CabPackage } from '../types';

export const CabsSection: React.FC = () => {
  const { formatPrice, addBooking, setActiveDriver, setIsDriverModalOpen } = useApp();

  const [selectedPackage, setSelectedPackage] = useState<CabPackage>(CAB_PACKAGES[1]); // Full-day circuit
  const [selectedVehicleId, setSelectedVehicleId] = useState('v-suv');
  const [pickupCity, setPickupCity] = useState('Goa (North & South)');
  const [pickupAddress, setPickupAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-11-22');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [isBooked, setIsBooked] = useState(false);

  const selectedVehicle = VEHICLE_FLEET.find((v) => v.id === selectedVehicleId) || VEHICLE_FLEET[0];
  const finalPriceINR = Math.round(selectedPackage.basePrice * selectedVehicle.priceMultiplier);

  const handleBookCab = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);

    const driver = {
      id: `drv-cab-${Date.now()}`,
      name: 'Vikramjit Verma',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      phone: '+91 97112 55901',
      rating: 4.97,
      completedTrips: 1890,
      vehicleModel: selectedVehicle.name,
      vehicleNumber: 'DL 01 AZ 3309',
      vehicleType: selectedVehicle.category,
      status: 'assigned' as const,
      etaMinutes: 15,
      currentLocation: `${pickupCity.split('(')[0].trim()} City Hub`,
    };

    setActiveDriver(driver);

    addBooking({
      itemType: 'cab',
      title: `${selectedPackage.title} (${selectedVehicle.name})`,
      location: `${pickupCity} · Pickup: ${pickupAddress || 'Stay Address'}`,
      image: selectedVehicle.image,
      dateRange: `${bookingDate} at ${bookingTime} · ${selectedPackage.duration}`,
      guestsCount: selectedVehicle.category === 'van' ? 8 : selectedVehicle.category === 'suv' ? 6 : 4,
      totalPrice: finalPriceINR,
      currency: 'INR',
      status: 'active',
      driver: driver,
    });

    setTimeout(() => {
      setIsBooked(false);
      setIsDriverModalOpen(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Title & Value Proposition */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
          <Car className="w-3.5 h-3.5" />
          <span>Local Mobility & Certified Drivers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          Sightseeing Cabs & Local Transport
        </h2>
        <p className="mt-2 text-neutral-500 text-sm">
          Book verified private cars on demand with transparent separate pricing. No haggling, zero surge rates, and 24/7 GPS safety tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Package Options & Vehicles */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
              1. Choose Sightseeing Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CAB_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                        : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm">{pkg.title}</h4>
                      <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                        {formatPrice(pkg.basePrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-2 opacity-80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {pkg.duration}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {pkg.distanceCovered}
                      </span>
                    </div>

                    <p className={`text-xs mt-2 leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {pkg.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                      {pkg.highlights.slice(0, 2).map((h, i) => (
                        <span 
                          key={i} 
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            isSelected ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Fleet Choices */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
              2. Select Vehicle Class
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VEHICLE_FLEET.map((vehicle) => {
                const isSelected = selectedVehicleId === vehicle.id;
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-rose-50/40 border-2'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 truncate">{vehicle.name}</h5>
                    <div className="text-[11px] text-neutral-500 mt-0.5 space-y-0.5">
                      <div>{vehicle.capacity}</div>
                      <div>{vehicle.luggageCapacity}</div>
                    </div>
                    <div className="mt-2 text-xs font-black text-neutral-900 flex items-center justify-between">
                      <span>{formatPrice(Math.round(selectedPackage.basePrice * vehicle.priceMultiplier))}</span>
                      {isSelected && <span className="text-[10px] text-[#FF385C] font-bold">Selected</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Reservation Card */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Cab Itinerary Summary</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Separate transparent payment on arrival or card</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleBookCab} className="space-y-4">
            
            {/* City */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">City / Region</label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-none"
              >
                <option value="Goa (North & South)">Goa (Candolim, Panaji, South Goa)</option>
                <option value="Jaipur & Amer">Jaipur (Pink City, Amber Fort, Nahargarh)</option>
                <option value="Udaipur Lake District">Udaipur (Lake Pichola, Monsoon Palace)</option>
                <option value="Delhi NCR">Delhi (Old Delhi, Qutub, Red Fort, Agra highway)</option>
                <option value="Mumbai Metropolitan">Mumbai (South Bombay, Marine Drive, Bandra)</option>
                <option value="Manali & Kullu">Manali (Solang Valley, Rohtang Pass, Kasol)</option>
                <option value="Kerala (Cochin & Alleppey)">Kerala (Kochi Fort, Backwaters, Munnar)</option>
              </select>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Pickup Address / Stay Name</label>
              <input
                type="text"
                required
                placeholder="e.g. SmartStay Villa Ocean Mist or Hotel Lobby"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 AM"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Transparent Pricing Breakdown */}
            <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>{selectedPackage.title}</span>
                <span className="font-semibold text-neutral-900">{formatPrice(selectedPackage.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle class ({selectedVehicle.name})</span>
                <span className="font-semibold text-neutral-900">x{selectedVehicle.priceMultiplier}</span>
              </div>
              <div className="flex justify-between">
                <span>Toll tax, state permits & fuel</span>
                <span className="font-semibold text-emerald-700">Included Free</span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-neutral-900">Total Cab Fare</span>
                <span className="text-2xl font-black text-neutral-900">{formatPrice(finalPriceINR)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBooked}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 active:scale-98 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isBooked ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Assigning Verified Driver...
                </span>
              ) : (
                <span>Confirm Cab & Assign Driver</span>
              )}
            </button>

            <div className="text-center text-[11px] text-neutral-400">
              Free cancellation up to 2 hours before trip · 24/7 SOS safety cover
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
