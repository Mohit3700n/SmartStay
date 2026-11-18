'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  Check, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle,
  Copy,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EMERGENCY_DIRECTORY, SAFE_GUARANTEE_POINTS } from '../data/essentials';

export const SafetySOSModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen, bookings } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<'India' | 'International'>('India');
  const [isCopied, setIsCopied] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  if (!isSosModalOpen) return null;

  const contacts = EMERGENCY_DIRECTORY[selectedCountry];

  const handleShareTrip = () => {
    const activeStay = bookings.find((b) => b.itemType === 'stay') || bookings[0];
    const tripText = `I am traveling with SmartStay. My current trip is "${activeStay?.title || 'SmartStay Luxury Retreat'}" in ${activeStay?.location || 'India'}. SmartStay Safe 24/7 Helpline is active. Booking ID: ${activeStay?.id || 'BK-SAFE-2026'}. Live emergency link: https://smartstay.travel/safe/${activeStay?.id || 'demo'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tripText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    setTimeout(() => {
      setSosTriggered(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF385C] flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900">Safety Center & Emergency SOS</h3>
              <p className="text-xs text-neutral-400">Stay Smart. Travel Safe · 24/7 Rapid Response</p>
            </div>
          </div>

          <button
            onClick={() => setIsSosModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 space-y-5 py-4">
          
          {/* Instant SOS Action */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Emergency Rapid Dispatch
            </span>
            <div className="flex items-center justify-center gap-3">
              <a
                href={selectedCountry === 'India' ? 'tel:112' : 'tel:911'}
                onClick={handleTriggerSOS}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call Emergency ({selectedCountry === 'India' ? '112' : '911'})</span>
              </a>
            </div>

            {sosTriggered && (
              <p className="text-xs text-red-800 font-semibold mt-1">
                Emergency alert recorded! Sending simulated location beacon to nearest police & medical unit.
              </p>
            )}
          </div>

          {/* Country Selection */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Select Region Numbers:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedCountry('India')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCountry === 'India'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                🇮🇳 India (112)
              </button>
              <button
                onClick={() => setSelectedCountry('International')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCountry === 'International'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                🌍 Global / International
              </button>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Police Assistance</span>
              <a href={`tel:${contacts.police}`} className="font-bold text-neutral-900 text-sm hover:underline block mt-0.5">
                📞 {contacts.police}
              </a>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Medical / Ambulance</span>
              <a href={`tel:${contacts.ambulance}`} className="font-bold text-neutral-900 text-sm hover:underline block mt-0.5">
                🚑 {contacts.ambulance}
              </a>
            </div>
            {contacts.womenHelpline && (
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-400 block font-medium">Women Helpline</span>
                <a href={`tel:${contacts.womenHelpline}`} className="font-bold text-neutral-900 text-sm hover:underline block mt-0.5">
                  🛡️ {contacts.womenHelpline}
                </a>
              </div>
            )}
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Tourist Helpline (24/7)</span>
              <span className="font-bold text-neutral-900 text-xs block mt-0.5">
                {contacts.touristHelpline}
              </span>
            </div>
          </div>

          {/* Live Trip Sharing */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Live Trip & Safety Sharing</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Share live villa address, driver license plate & status with loved ones</p>
              </div>
              <Share2 className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareTrip}
                className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Trip Link Copied to Clipboard!' : 'Copy Trip Share Link'}</span>
              </button>
            </div>
          </div>

          {/* Safety Guarantees */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">SmartStay Safety Standards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SAFE_GUARANTEE_POINTS.map((pt, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-neutral-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-900">{pt.title}: </strong>
                    <span className="text-neutral-500">{pt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
