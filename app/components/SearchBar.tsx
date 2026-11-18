'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, X, Plus, Minus, Compass, Building } from 'lucide-react';
import { SearchFilters } from '../types';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  activeFilters: SearchFilters;
  onReset: () => void;
}

const POPULAR_DESTINATIONS = [
  // India destinations (Default Primary)
  { name: 'All India & Global', query: '', country: 'Search all destinations', flag: '🇮🇳' },
  { name: 'Goa', query: 'Goa', country: 'India · Beaches, villas & sunset cruises', flag: '🌴' },
  { name: 'Udaipur', query: 'Udaipur', country: 'India · Lake Pichola royal havelis', flag: '🏰' },
  { name: 'Manali', query: 'Manali', country: 'India · Himalayan snow chalets', flag: '🏔️' },
  { name: 'Kerala', query: 'Kerala', country: 'India · Backwater lake estates', flag: '🛶' },
  { name: 'Jaipur', query: 'Jaipur', country: 'India · Pink City royal courtyards', flag: '👑' },
  { name: 'Mumbai', query: 'Mumbai', country: 'India · Sea-facing design penthouses', flag: '🌊' },
  { name: 'Delhi NCR', query: 'Delhi', country: 'India · Capital heritage suites', flag: '🏛️' },
  { name: 'Varanasi', query: 'Varanasi', country: 'India · Ganges spiritual ghats', flag: '🪔' },
  { name: 'Leh Ladakh', query: 'Ladakh', country: 'India · Dark sky stargazer domes', flag: '✨' },
  // International destinations
  { name: 'Santorini', query: 'Santorini', country: 'Greece · Caldera sunset villas', flag: '🇬🇷' },
  { name: 'Paris', query: 'Paris', country: 'France · Eiffel views & Haussmann lofts', flag: '🇫🇷' },
  { name: 'Bali', query: 'Bali', country: 'Indonesia · Ubud jungle sanctuaries', flag: '🇮🇩' },
  { name: 'Tokyo', query: 'Tokyo', country: 'Japan · Shinjuku skyline lofts', flag: '🇯🇵' },
  { name: 'Zermatt', query: 'Zermatt', country: 'Switzerland · Matterhorn ski chalets', flag: '🇨🇭' },
  { name: 'Dubai', query: 'Dubai', country: 'UAE · Marina luxury towers', flag: '🇦🇪' },
  { name: 'London', query: 'London', country: 'UK · Kensington townhouses', flag: '🇬🇧' },
  { name: 'New York', query: 'New York', country: 'USA · Manhattan penthouses', flag: '🇺🇸' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  activeFilters,
  onReset,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'guests' | null>(null);

  const [destination, setDestination] = useState(activeFilters.destination || '');
  const [checkIn, setCheckIn] = useState(activeFilters.checkIn || '');
  const [checkOut, setCheckOut] = useState(activeFilters.checkOut || '');
  const [adults, setAdults] = useState(activeFilters.guests?.adults || 1);
  const [children, setChildren] = useState(activeFilters.guests?.children || 0);
  const [infants, setInfants] = useState(activeFilters.guests?.infants || 0);
  const [rooms, setRooms] = useState(activeFilters.rooms || 1);

  const barRef = useRef<HTMLDivElement>(null);

  // Sync with activeFilters if parent updates
  useEffect(() => {
    setDestination(activeFilters.destination || '');
    setCheckIn(activeFilters.checkIn || '');
    setCheckOut(activeFilters.checkOut || '');
    if (activeFilters.guests) {
      setAdults(activeFilters.guests.adults || 1);
      setChildren(activeFilters.guests.children || 0);
      setInfants(activeFilters.guests.infants || 0);
    }
    setRooms(activeFilters.rooms || 1);
  }, [activeFilters]);

  const totalGuests = adults + children;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = (newDest?: string) => {
    const finalDest = newDest !== undefined ? newDest : destination;
    setActiveTab(null);
    onSearch({
      destination: finalDest.trim(),
      checkIn,
      checkOut,
      guests: { adults, children, infants },
      rooms,
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setRooms(1);
    setActiveTab(null);
    onReset();
  };

  const isFiltered = Boolean(destination || checkIn || checkOut || totalGuests > 1 || rooms > 1);

  // Dynamic destination search suggestions
  const filteredSuggestions = POPULAR_DESTINATIONS.filter((d) => {
    if (!destination.trim()) return true;
    const q = destination.toLowerCase().trim();
    return d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={barRef}>
      
      {/* Floating White Pill Search Bar */}
      <div 
        className={`bg-white rounded-full border transition-all duration-300 search-pill-shadow flex flex-col md:flex-row items-center p-1.5 sm:p-2 ${
          activeTab ? 'border-neutral-400 bg-neutral-50/50' : 'border-neutral-200'
        }`}
      >
        
        {/* 1. Destination (Where) */}
        <div
          onClick={() => setActiveTab('where')}
          className={`flex-1 w-full md:w-auto px-6 py-2.5 sm:py-3 rounded-full cursor-pointer transition-colors text-left ${
            activeTab === 'where' ? 'bg-white shadow-xs' : 'hover:bg-neutral-100/70'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
            {t('where')}
          </div>
          <input
            type="text"
            placeholder="Search India or any city worldwide..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setActiveTab('where')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApply();
            }}
            className="w-full bg-transparent text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal focus:outline-none truncate mt-0.5 cursor-pointer"
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block h-8 w-[1px] bg-neutral-200" />

        {/* 2. When (Check-in & Check-out) */}
        <div
          onClick={() => setActiveTab('dates')}
          className={`flex-1 w-full md:w-auto px-6 py-2.5 sm:py-3 rounded-full cursor-pointer transition-colors text-left ${
            activeTab === 'dates' ? 'bg-white shadow-xs' : 'hover:bg-neutral-100/70'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
            {t('when')}
          </div>
          <div className="text-sm font-medium text-neutral-900 truncate mt-0.5">
            {checkIn && checkOut ? (
              <span className="font-semibold text-neutral-900">{checkIn} → {checkOut}</span>
            ) : checkIn ? (
              <span className="font-semibold text-neutral-900">From {checkIn}</span>
            ) : (
              <span className="text-neutral-400 font-normal">Add dates</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-8 w-[1px] bg-neutral-200" />

        {/* 3. Who & Rooms & Search Button */}
        <div
          onClick={() => setActiveTab('guests')}
          className={`flex-1 w-full md:w-auto pl-6 pr-2 py-2 rounded-full cursor-pointer transition-colors flex items-center justify-between gap-3 text-left ${
            activeTab === 'guests' ? 'bg-white shadow-xs' : 'hover:bg-neutral-100/70'
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
              {t('who')} & {t('rooms')}
            </div>
            <div className="text-sm truncate mt-0.5">
              {totalGuests > 0 ? (
                <span className="font-semibold text-neutral-900">
                  {totalGuests} guest{totalGuests > 1 ? 's' : ''}
                  {infants > 0 ? `, ${infants} inf` : ''} · {rooms} rm{rooms > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-neutral-400 font-normal">{t('addGuests')}</span>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {isFiltered && (
              <button
                onClick={handleReset}
                title="Reset filters"
                className="w-8 h-8 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleApply()}
              aria-label="Search"
              className="bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:brightness-105 active:scale-95 text-white p-3.5 md:px-5 md:py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline font-bold">{t('search')}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Popovers */}
      
      {/* 1. Destination Popover */}
      {activeTab === 'where' && (
        <div className="absolute left-0 md:left-2 top-[105%] w-full md:w-[460px] bg-white rounded-3xl shadow-2xl border border-neutral-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[440px] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 pb-2 flex items-center justify-between">
            <span>India & Global Destinations</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">India Primary</span>
          </div>

          {destination.trim() && (
            <button
              type="button"
              onClick={() => handleApply(destination)}
              className="w-full text-left px-3.5 py-2.5 mb-2 rounded-2xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF385C] text-white flex items-center justify-center shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-rose-900">Search for &ldquo;{destination}&rdquo;</div>
                <div className="text-[11px] text-rose-600">Explore any city, country, or neighborhood worldwide</div>
              </div>
            </button>
          )}

          <div className="space-y-1">
            {filteredSuggestions.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => {
                  setDestination(dest.query);
                  handleApply(dest.query);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-neutral-50 flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-white flex items-center justify-center text-base border border-neutral-200/60 shadow-2xs">
                  {dest.flag}
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-neutral-900">{dest.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{dest.country}</div>
                </div>
              </button>
            ))}

            {filteredSuggestions.length === 0 && (
              <div className="p-4 text-center text-xs text-neutral-500">
                Press Enter or click Search to find stays matching &ldquo;{destination}&rdquo;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Dates Popover */}
      {activeTab === 'dates' && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[105%] w-full sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-neutral-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-neutral-900">Select Travel Dates</div>
            {(checkIn || checkOut) && (
              <button
                type="button"
                onClick={() => {
                  setCheckIn('');
                  setCheckOut('');
                }}
                className="text-xs font-bold text-[#FF385C] hover:underline"
              >
                Clear Dates
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 bg-neutral-50"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                {checkIn && checkOut ? 'Dates configured' : 'Flexible cancellation'}
              </span>
              <button
                type="button"
                onClick={() => handleApply()}
                className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Apply Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Guests & Rooms Popover */}
      {activeTab === 'guests' && (
        <div className="absolute right-0 md:right-2 top-[105%] w-full sm:w-[340px] bg-white rounded-3xl shadow-2xl border border-neutral-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Adults */}
          <div className="flex items-center justify-between py-2.5 border-b border-neutral-100">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Adults</p>
              <p className="text-xs text-neutral-400">Ages 13 or above</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={adults <= 1}
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{adults}</span>
              <button
                type="button"
                disabled={adults >= 16}
                onClick={() => setAdults(adults + 1)}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-2.5 border-b border-neutral-100">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Children</p>
              <p className="text-xs text-neutral-400">Ages 2–12</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={children <= 0}
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{children}</span>
              <button
                type="button"
                disabled={children >= 8}
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-2.5 border-b border-neutral-100">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Infants</p>
              <p className="text-xs text-neutral-400">Under 2</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={infants <= 0}
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{infants}</span>
              <button
                type="button"
                disabled={infants >= 4}
                onClick={() => setInfants(infants + 1)}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rooms Selector */}
          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-500" />
                Rooms
              </p>
              <p className="text-xs text-neutral-400">Number of bedrooms required</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={rooms <= 1}
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{rooms}</span>
              <button
                type="button"
                disabled={rooms >= 10}
                onClick={() => setRooms(rooms + 1)}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              {totalGuests} guest{totalGuests > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
