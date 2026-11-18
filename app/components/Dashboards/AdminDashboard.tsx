'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Car, 
  Luggage, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { formatPrice } = useApp();

  const [pendingListings, setPendingListings] = useState([
    {
      id: 'LST-PEND-01',
      title: 'Heritage Tea Estate Bungalow',
      location: 'Munnar, Kerala, India',
      host: 'Anil Kurup',
      priceINR: 11500,
      status: 'pending',
    },
    {
      id: 'LST-PEND-02',
      title: 'Pali Hill Sunset Luxury Studio',
      location: 'Bandra, Mumbai, India',
      host: 'Rhea Kapoor',
      priceINR: 9200,
      status: 'pending',
    },
  ]);

  const [driverFleet, setDriverFleet] = useState([
    {
      id: 'DRV-01',
      name: 'Rajesh Sharma',
      vehicle: 'Toyota Innova Crysta (GA 03 E 4590)',
      city: 'Goa',
      status: 'On Active Chauffeur Dispatch',
      phone: '+91 98201 44521',
      rating: 4.96,
    },
    {
      id: 'DRV-02',
      name: 'Vikramjit Verma',
      vehicle: 'Prime Sedan Dzire (DL 01 AZ 3309)',
      city: 'Delhi NCR',
      status: 'Standby at IGI Terminal 3',
      phone: '+91 97112 55901',
      rating: 4.97,
    },
    {
      id: 'DRV-03',
      name: 'Gajendra Meena',
      vehicle: 'Executive SUV Hycross (RJ 14 TC 2102)',
      city: 'Jaipur',
      status: 'Completed Sightseeing Circuit',
      phone: '+91 94140 88210',
      rating: 4.94,
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingListings((prev) => prev.filter((item) => item.id !== id));
    alert(`Listing ${id} approved & published to SmartStay global marketplace!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Platform Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1.5">
            Admin Portal & Service Provider Operations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time platform overview, host inspection queue, and airport concierge fleet monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-neutral-700">Platform Status: 100% Operational</span>
        </div>
      </div>

      {/* High-Level Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-neutral-900 text-white">
          <span className="text-xs font-medium text-neutral-400">Total Gross Volume</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatPrice(14800000)}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            ↑ 24.8% Year-over-Year
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Active Accommodations</span>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            19 Stays
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            India (7) · International (12)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Verified Chauffeur Fleet</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            42 Drivers
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            All police background verified
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-500">Baggage Safety Score</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
            100%
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            0 lost baggage incidents
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pending Property Approvals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Pending Listing Approvals ({pendingListings.length})
            </h3>
            <span className="text-xs text-neutral-400">100-Point Inspection Required</span>
          </div>

          {pendingListings.length > 0 ? (
            <div className="space-y-3">
              {pendingListings.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-400">{item.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Awaiting Verification
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 mt-1">{item.title}</h4>
                    <p className="text-xs text-neutral-500">{item.location} · Host: {item.host}</p>
                    <span className="text-xs font-black text-neutral-800 mt-1 block">
                      Proposed: {formatPrice(item.priceINR)} / night
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setPendingListings(pendingListings.filter((l) => l.id !== item.id));
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                      title="Decline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-neutral-50 text-center text-xs text-neutral-500">
              No pending listings in verification queue.
            </div>
          )}
        </div>

        {/* Right Column: Chauffeur & Dispatch Operations Monitor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Chauffeur & Airport Dispatch Monitor
            </h3>
            <span className="text-xs text-emerald-700 font-bold">Live Fleet Status</span>
          </div>

          <div className="space-y-3">
            {driverFleet.map((drv) => (
              <div key={drv.id} className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-neutral-900">{drv.name}</span>
                    <span className="text-xs text-neutral-500">({drv.city})</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">★ {drv.rating}</span>
                </div>

                <div className="text-xs text-neutral-600">
                  <span className="font-medium text-neutral-500">Vehicle: </span>
                  <span className="font-mono font-semibold">{drv.vehicle}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
                  <span className="text-emerald-700 font-semibold">{drv.status}</span>
                  <a href={`tel:${drv.phone}`} className="font-mono text-neutral-500 hover:text-neutral-900">
                    {drv.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
