'use client';

import React from 'react';
import Image from 'next/image';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  User, 
  Eye, 
  Lock, 
  Car, 
  Luggage 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WelcomeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'guest' | 'host') => void;
  onContinueAsVisitor: () => void;
}

export const WelcomeGateModal: React.FC<WelcomeGateModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onContinueAsVisitor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 overflow-hidden border border-neutral-100">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-[#FF385C] border border-rose-200/80 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>India & Global Travel Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Welcome to SmartStay
          </h1>
          
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Stay Smart. Travel Safe. Verified accommodations, local experiences, and airport luggage concierge.
          </p>
        </div>

        {/* Two Primary Role Pathways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* 1. Continue as Guest */}
          <div
            onClick={() => onSelectRole('guest')}
            className="group p-5 rounded-3xl border-2 border-neutral-200 hover:border-[#FF385C] bg-neutral-50/60 hover:bg-rose-50/20 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center mb-3 shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-[#FF385C] transition-colors">
                Continue as Guest
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Discover curated stays in India and worldwide, book local cabs, guided tours, and manage your trips.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#FF385C]">
              <span>Sign In / Register as Guest</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Continue as Host */}
          <div
            onClick={() => onSelectRole('host')}
            className="group p-5 rounded-3xl border-2 border-neutral-200 hover:border-amber-500 bg-neutral-50/60 hover:bg-amber-50/20 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center mb-3 shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-amber-700 transition-colors">
                Continue as Host
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                List your property, upload photos, set pricing, synchronize airport concierge, and manage bookings.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-amber-700">
              <span>Sign In / Register as Host</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Option 3: Explore as Visitor */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={onContinueAsVisitor}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-neutral-400" />
            <span>Explore Public Listings as Visitor</span>
          </button>

          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Login is required for reservations & wishlists</span>
          </span>
        </div>

      </div>
    </div>
  );
};
