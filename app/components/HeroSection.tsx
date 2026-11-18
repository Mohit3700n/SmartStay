'use client';

import React from 'react';
import Image from 'next/image';
import { SearchBar } from './SearchBar';
import { SearchFilters } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Luggage, Sparkles, Star, MapPin, Compass, Car } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
  activeFilters: SearchFilters;
  onReset: () => void;
  onQuickDestinationSelect: (dest: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  activeFilters,
  onReset,
  onQuickDestinationSelect,
}) => {
  const { setActiveTab } = useApp();

  const quickDestinations = [
    { label: 'Goa', query: 'Goa', isIndia: true },
    { label: 'Udaipur', query: 'Udaipur', isIndia: true },
    { label: 'Manali', query: 'Manali', isIndia: true },
    { label: 'Kerala', query: 'Kerala', isIndia: true },
    { label: 'Jaipur', query: 'Jaipur', isIndia: true },
    { label: 'Mumbai', query: 'Mumbai', isIndia: true },
    { label: 'Santorini', query: 'Santorini', isIndia: false },
    { label: 'Paris', query: 'Paris', isIndia: false },
    { label: 'Bali', query: 'Bali', isIndia: false },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-2 pb-6 sm:pb-10">
      
      {/* Hero Banner Card Container with Rounded Edges */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-neutral-900 min-h-[490px] sm:min-h-[530px] flex flex-col justify-between p-6 sm:p-12 text-white shadow-2xl">
        
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1590059390047-65fb48b0a944?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Lake Palace & Stays"
            fill
            priority
            className="object-cover object-center brightness-60 scale-102 transition-transform duration-1000"
          />
          {/* Subtle vignette gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60" />
        </div>

        {/* Top Tagline Badge & Rating Pill */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Stay Smart · Travel Safe · India & Global</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-neutral-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">4.97 / 5.0</span>
            <span>from 30,000+ verified travelers</span>
          </div>
        </div>

        {/* Center Headline & Search Container */}
        <div className="relative z-10 text-center my-auto py-6 sm:py-8">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Book verified stays & tours <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-rose-300">
              across India and worldwide.
            </span>
          </h1>

          <p className="mt-3 text-neutral-200 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            From Goa beachfront villas & Udaipur lake havelis to Parisian lofts. Complete with airport concierge, sightseeing cabs, and 24/7 travel safety.
          </p>

          {/* Integrated Floating Search Bar */}
          <div className="mt-7 text-neutral-900">
            <SearchBar
              onSearch={onSearch}
              activeFilters={activeFilters}
              onReset={onReset}
            />
          </div>

          {/* Quick Destination Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/70 font-semibold mr-1">Trending:</span>
            {quickDestinations.map((d) => (
              <button
                key={d.label}
                onClick={() => onQuickDestinationSelect(d.query)}
                className={`px-3 py-1 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  activeFilters.destination.toLowerCase() === d.query.toLowerCase()
                    ? 'bg-white text-neutral-900 font-bold shadow-xs'
                    : 'bg-white/15 hover:bg-white/30 text-white/90 border border-white/20'
                }`}
              >
                {d.label} {d.isIndia && '🇮🇳'}
              </button>
            ))}
          </div>

        </div>

        {/* Bottom Feature Badges & Mode Shortcuts */}
        <div className="relative z-10 border-t border-white/15 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-300">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>100-Point Safe Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Door-to-Door Luggage Care</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Sightseeing Cabs Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Superhost Hospitality</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('experiences')}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-rose-300" />
              <span>View Guided Tours</span>
            </button>
            <button
              onClick={() => setActiveTab('cabs')}
              className="px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>Book Local Cab</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
