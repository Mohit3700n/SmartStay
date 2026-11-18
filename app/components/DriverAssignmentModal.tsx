'use client';

import React from 'react';
import Image from 'next/image';
import { 
  X, 
  Phone, 
  Car, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Star, 
  Navigation, 
  ShieldAlert,
  CheckCircle2,
  Luggage
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DriverAssignmentModal: React.FC = () => {
  const { 
    isDriverModalOpen, 
    setIsDriverModalOpen, 
    activeDriver, 
    setIsSosModalOpen 
  } = useApp();

  if (!isDriverModalOpen || !activeDriver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden border border-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Chauffeur Tracking
            </span>
          </div>

          <button
            onClick={() => setIsDriverModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Profile Card */}
        <div className="mt-5 space-y-5">
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xs">
                <Image
                  src={activeDriver.avatar}
                  alt={activeDriver.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-neutral-900">{activeDriver.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span className="flex items-center gap-0.5 font-bold text-neutral-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {activeDriver.rating}
                  </span>
                  <span>·</span>
                  <span>{activeDriver.completedTrips}+ trips</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold">Police Verified</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${activeDriver.phone}`}
              className="w-10 h-10 rounded-2xl bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              title="Call driver"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <span className="text-neutral-400 block font-medium">Assigned Vehicle</span>
              <span className="font-bold text-neutral-900 mt-0.5 block">{activeDriver.vehicleModel}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <span className="text-neutral-400 block font-medium">License Plate</span>
              <span className="font-black text-neutral-900 font-mono text-sm mt-0.5 block tracking-wider">
                {activeDriver.vehicleNumber}
              </span>
            </div>
          </div>

          {/* Live Location & ETA */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Estimated Arrival
              </span>
              <span className="text-base font-black text-emerald-800">
                {activeDriver.etaMinutes} mins away
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeDriver.currentLocation}</span>
            </div>
          </div>

          {/* Live Progress Steps */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Trip Status
            </span>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Assigned</span>
              </div>
              <div className="h-[2px] flex-1 mx-2 bg-emerald-500 rounded-full" />
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Car className="w-4 h-4" />
                <span>En Route</span>
              </div>
              <div className="h-[2px] flex-1 mx-2 bg-neutral-200 rounded-full" />
              <div className="flex items-center gap-1 text-neutral-400">
                <Luggage className="w-4 h-4" />
                <span>Luggage Escort</span>
              </div>
            </div>
          </div>

          {/* Emergency SOS Bar */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100">
            <button
              onClick={() => {
                setIsDriverModalOpen(false);
                setIsSosModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency SOS</span>
            </button>

            <button
              onClick={() => setIsDriverModalOpen(false)}
              className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close Tracker
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
