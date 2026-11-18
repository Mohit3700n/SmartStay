'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  KeyRound, 
  Wifi, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Check, 
  Copy, 
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartCheckInModal: React.FC = () => {
  const { selectedCheckInProperty, setSelectedCheckInProperty } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  if (!selectedCheckInProperty) return null;

  const checkIn = selectedCheckInProperty.smartCheckIn || {
    doorCode: '4829#',
    wifiNetwork: 'SmartStay_Guest_HighSpeed',
    wifiPassword: 'stay-smart-2026',
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    houseRules: ['Quiet hours after 10:30 PM', 'Smoking on outdoor lawn only', 'Sanitize hands upon arrival'],
    directions: 'Follow main landmark road, gate with SmartStay plaque on the right.',
    nearbyEssentials: [
      { category: 'hospital', name: 'City Primary General Hospital', distance: '1.4 km', phone: '+91 832 248 9032', address: 'Main Hospital Road' },
      { category: 'pharmacy', name: 'Apollo Pharmacy 24/7', distance: '350 m', phone: '+91 832 248 9911', address: 'Market Road' },
      { category: 'police', name: 'Local Police Station', distance: '2.8 km', phone: '100 / 112', address: 'Civic Centre' },
      { category: 'atm', name: 'State Bank of India / HDFC ATM', distance: '200 m', address: 'Near Supermarket' },
    ],
  };

  const handleCopy = (text: string, type: 'code' | 'wifi') => {
    navigator.clipboard?.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900">Digital Key & Smart Check-in</h3>
              <p className="text-xs text-neutral-400">{selectedCheckInProperty.title}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCheckInProperty(null)}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 space-y-5 py-4">
          
          {/* Keyless Door Access Code */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Digital Keypad Access Code</span>
              <span className="text-emerald-400 font-bold">Active for your stay</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black font-mono tracking-widest text-white">
                {checkIn.doorCode}
              </span>
              <button
                onClick={() => handleCopy(checkIn.doorCode, 'code')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Enter this code on the door handle keypad followed by # to unlock.
            </p>
          </div>

          {/* Wi-Fi Credentials */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
              <Wifi className="w-4 h-4 text-neutral-600" />
              <span>High-Speed Wi-Fi Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block font-medium">Network Name</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{checkIn.wifiNetwork}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Password</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-bold text-neutral-900">{checkIn.wifiPassword}</span>
                  <button
                    onClick={() => handleCopy(checkIn.wifiPassword, 'wifi')}
                    className="p-1 hover:bg-neutral-200 rounded-md text-neutral-600"
                    title="Copy password"
                  >
                    {copiedWifi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timings & Directions */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <span className="text-neutral-400 block font-medium">Check-in / Check-out</span>
              <span className="font-bold text-neutral-900 block mt-0.5">
                In: {checkIn.checkInTime} · Out: {checkIn.checkOutTime}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <span className="text-neutral-400 block font-medium">Host Directions</span>
              <span className="text-neutral-700 block mt-0.5 leading-snug">
                {checkIn.directions}
              </span>
            </div>
          </div>

          {/* Nearby Essential Services (Hospitals, Pharmacies, Police, ATMs) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Nearby Essential Services (Verified)
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                24/7 Emergency Coverage
              </span>
            </div>

            <div className="space-y-2">
              {checkIn.nearbyEssentials.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-neutral-200/80 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-900">{item.name}</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.2 rounded-md">
                        {item.distance}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{item.address}</p>
                  </div>

                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white font-bold flex items-center gap-1.5 shrink-0 hover:bg-black transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
