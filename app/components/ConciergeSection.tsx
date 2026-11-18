'use client';

import React, { useState } from 'react';
import { 
  Luggage, 
  Car, 
  Plane, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  PhoneCall,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DriverInfo } from '../types';

interface ConciergeSectionProps {
  onBookAssistanceClick?: (details: { airport: string; vehicle: string; bags: number }) => void;
}

export const ConciergeSection: React.FC<ConciergeSectionProps> = ({ onBookAssistanceClick }) => {
  const { formatPrice, setActiveDriver, setIsDriverModalOpen, addBooking } = useApp();

  const [selectedAirport, setSelectedAirport] = useState('Goa Dabolim / Mopa (GOI/GOX) - India');
  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'van'>('suv');
  const [bagsCount, setBagsCount] = useState(2);
  const [flightNumber, setFlightNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // INR base prices
  const getVehiclePriceINR = () => {
    switch (vehicleType) {
      case 'suv':
        return 2800; // INR
      case 'van':
        return 4500; // INR
      case 'sedan':
      default:
        return 1800; // INR
    }
  };

  const luggageFeeINR = bagsCount > 2 ? (bagsCount - 2) * 350 : 0;
  const totalPriceINR = getVehiclePriceINR() + luggageFeeINR;

  const handleSubmitEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const assignedDriver: DriverInfo = {
      id: `drv-${Date.now()}`,
      name: 'Rajesh Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      phone: '+91 98201 44521',
      rating: 4.96,
      completedTrips: 1420,
      vehicleModel: vehicleType === 'suv' ? 'Toyota Innova Crysta (Luxury 7-Seater)' : vehicleType === 'van' ? 'Force Urbania Luxury Van' : 'Honda City / Swift Dzire',
      vehicleNumber: 'GA 03 E 4590',
      vehicleType: vehicleType,
      status: 'en_route',
      etaMinutes: 12,
      currentLocation: `${selectedAirport.split('(')[0].trim()} Terminal Approach`,
    };

    setActiveDriver(assignedDriver);

    // Add to user bookings
    addBooking({
      itemType: 'cab',
      title: `Airport Transfer & Luggage: ${selectedAirport.split('-')[0].trim()}`,
      location: selectedAirport,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      dateRange: `Flight: ${flightNumber || 'Tracked on Arrival'}`,
      guestsCount: vehicleType === 'van' ? 8 : vehicleType === 'suv' ? 5 : 3,
      totalPrice: totalPriceINR,
      currency: 'INR',
      status: 'active',
      driver: assignedDriver,
    });

    if (onBookAssistanceClick) {
      onBookAssistanceClick({
        airport: selectedAirport,
        vehicle: vehicleType,
        bags: bagsCount,
      });
    }

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="concierge-section" className="w-full max-w-7xl mx-auto px-4 sm:px-8 my-14 sm:my-20">
      
      {/* Outer Card with Refined Neutral Aesthetics */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-neutral-800">
        
        {/* Subtle Decorative Background Ambience */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story & Services */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SmartStay Travel Concierge · India & Global</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Airport Transfers & <br className="hidden sm:inline" />
                White-Glove Luggage Care.
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg font-normal">
                Stay Smart. Travel Safe. Travel completely hands-free from flight arrival terminal to your villa terrace.
              </p>
            </div>

            {/* Service Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3">
                  <Plane className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="font-semibold text-white text-sm">Flight Tracking</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Real-time flight sync. Drivers auto-adjust for delays at zero extra cost.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3">
                  <Luggage className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-white text-sm">Luggage Forwarding</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Bags securely transported straight to your room while you explore early.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white text-sm">Verified Chauffeurs</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  English & Hindi speaking, background-checked executive drivers in sanitized vehicles.
                </p>
              </div>

            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free cancellation up to 2 hours prior
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero baggage loss protection guarantee
              </span>
            </div>

          </div>

          {/* Right Column: Clean Instant Arrival Estimator */}
          <div className="lg:col-span-5 bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Book Arrival Chauffeur</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Transparent separate pricing & live tracking</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleSubmitEstimate} className="mt-5 space-y-4">
              
              {/* Airport select */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Arrival Airport
                </label>
                <select
                  value={selectedAirport}
                  onChange={(e) => setSelectedAirport(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                >
                  <optgroup label="India Hubs (Default)">
                    <option value="Goa Dabolim / Mopa (GOI/GOX) - India">Goa Dabolim / Mopa (GOI/GOX) - India</option>
                    <option value="Delhi IGI (DEL) - India">Delhi Indira Gandhi IGI (DEL) - India</option>
                    <option value="Mumbai CSMIA (BOM) - India">Mumbai Chhatrapati Shivaji (BOM) - India</option>
                    <option value="Bengaluru Kempegowda (BLR) - India">Bengaluru Kempegowda (BLR) - India</option>
                    <option value="Jaipur International (JAI) - India">Jaipur International (JAI) - India</option>
                    <option value="Kochi International (COK) - India">Kochi International (COK) - India</option>
                    <option value="Udaipur Maharana Pratap (UDR) - India">Udaipur Maharana Pratap (UDR) - India</option>
                  </optgroup>
                  <optgroup label="International Hubs">
                    <option value="Paris CDG (Charles de Gaulle) - France">Paris CDG (Charles de Gaulle) - France</option>
                    <option value="Santorini JTR (Thira) - Greece">Santorini JTR (Thira) - Greece</option>
                    <option value="Bali DPS (Ngurah Rai) - Indonesia">Bali DPS (Ngurah Rai) - Indonesia</option>
                    <option value="Tokyo HND (Haneda) - Japan">Tokyo HND (Haneda) - Japan</option>
                    <option value="Geneva GVA (Cointrin) - Switzerland">Geneva GVA (Cointrin) - Switzerland</option>
                    <option value="Dubai DXB - United Arab Emirates">Dubai DXB - UAE</option>
                  </optgroup>
                </select>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Vehicle Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sedan', label: 'Prime Sedan', cap: '1-4 guests', priceINR: 1800 },
                    { id: 'suv', label: 'Executive SUV', cap: '1-6 guests', priceINR: 2800 },
                    { id: 'van', label: 'VIP Van', cap: '1-10 guests', priceINR: 4500 },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleType(v.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        vehicleType === v.id
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{v.label}</div>
                      <div className={`text-[10px] ${vehicleType === v.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {v.cap}
                      </div>
                      <div className="text-xs font-black mt-1">
                        {formatPrice(v.priceINR)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Luggage Counter */}
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Luggage Bags to Escort</div>
                  <div className="text-[11px] text-neutral-400">2 bags included complimentary</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBagsCount(Math.max(1, bagsCount - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{bagsCount}</span>
                  <button
                    type="button"
                    onClick={() => setBagsCount(Math.min(8, bagsCount + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Flight Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Flight Number (Optional for automated delay tracking)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6E 204 or AI 102"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 uppercase font-mono"
                />
              </div>

              {/* Total & Action Button */}
              <div className="pt-2">
                <div className="flex items-baseline justify-between py-2 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-500">Service Fee:</span>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatPrice(totalPriceINR)}
                  </span>
                </div>

                {submitted ? (
                  <div className="space-y-2">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Chauffeur Assigned! Driver Rajesh Sharma en-route with Innova Crysta.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDriverModalOpen(true)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Track Driver Status in Real-Time</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md shadow-rose-500/20 cursor-pointer"
                  >
                    <span>Reserve Concierge & Assign Driver</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};
