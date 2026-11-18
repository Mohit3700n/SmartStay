'use client';

import React, { useState } from 'react';
import { X, Sparkles, DollarSign, Home, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostModal: React.FC<HostModalProps> = ({ isOpen, onClose }) => {
  const [nights, setNights] = useState(7);
  const [estimatedNightlyRate, setEstimatedNightlyRate] = useState(240);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const estimatedEarnings = nights * estimatedNightlyRate * 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Header */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartStay Host Partner Program</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Host your property on SmartStay
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Join top-rated hosts worldwide. We provide airport concierge integration, 24/7 guest verification, and up to $1M damage protection.
            </p>
          </div>

          {/* Earnings Estimator */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Potential monthly income
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#FF385C] mt-1">
                ${estimatedEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Based on {nights} booked nights per week at ${estimatedNightlyRate}/night
              </p>
            </div>

            {/* Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-neutral-700">
                <span>Nights booked per week: {nights}</span>
                <span>${estimatedNightlyRate} / night</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full accent-[#FF385C] cursor-pointer"
              />
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>$1,000,000 SmartStay Host Cover</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free airport baggage handling sync</span>
            </div>
          </div>

          {/* Action button */}
          <div>
            {submitted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Our Host Onboarding Concierge will contact you within 24h.</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSubmitted(true);
                  setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                  }, 2500);
                }}
                className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Start SmartStay Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
