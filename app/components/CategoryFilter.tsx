'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Palmtree, 
  Mountain, 
  Castle, 
  Building2, 
  Trees, 
  Sparkles, 
  Compass, 
  SlidersHorizontal,
  Luggage,
  Award,
  X,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  onlyAirportPickup: boolean;
  onToggleAirportPickup: () => void;
  onlyGuestFavorite: boolean;
  onToggleGuestFavorite: () => void;
  maxPriceFilter: number | null;
  onSetMaxPriceFilter: (price: number | null) => void;
  totalFilteredCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  onlyAirportPickup,
  onToggleAirportPickup,
  onlyGuestFavorite,
  onToggleGuestFavorite,
  maxPriceFilter,
  onSetMaxPriceFilter,
  totalFilteredCount,
}) => {
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsFilterPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFiltersCount = 
    (onlyAirportPickup ? 1 : 0) + 
    (onlyGuestFavorite ? 1 : 0) + 
    (maxPriceFilter !== null ? 1 : 0);

  const getCategoryIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-6 h-6 transition-colors duration-200 ${
      isSelected ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'
    }`;

    switch (iconName) {
      case 'beach':
        return <Palmtree className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'mountains':
        return <Mountain className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'villas':
        return <Castle className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'apartments':
        return <Building2 className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'countryside':
        return <Trees className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'unique':
        return <Sparkles className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
      case 'all':
      default:
        return <Compass className={iconClass} strokeWidth={isSelected ? 2.2 : 1.7} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200/70 pb-3">
        
        {/* Horizontal Category Icons List */}
        <div className="flex items-center gap-7 sm:gap-9 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 group cursor-pointer whitespace-nowrap pb-2.5 relative transition-all min-w-[64px] ${
                  isSelected
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 font-medium'
                }`}
              >
                <div className="p-1 transition-transform group-hover:scale-105 duration-200">
                  {getCategoryIcon(cat.iconName, isSelected)}
                </div>
                <span className="text-xs tracking-tight">{cat.label}</span>

                {/* Subtle active underline indicator */}
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-2 h-[2px] bg-neutral-900 rounded-full transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal Filters Button & Popover */}
        <div className="relative shrink-0" ref={popoverRef}>
          <button
            onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Filter Popover Dropdown */}
          {isFilterPopoverOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-neutral-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <span className="font-bold text-sm text-neutral-900">Preferences</span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      if (onlyAirportPickup) onToggleAirportPickup();
                      if (onlyGuestFavorite) onToggleGuestFavorite();
                      if (maxPriceFilter) onSetMaxPriceFilter(null);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                
                {/* 1. Airport Pickup toggle */}
                <div 
                  onClick={onToggleAirportPickup}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Luggage className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-neutral-800">Airport Pickup Available</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    onlyAirportPickup ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300'
                  }`}>
                    {onlyAirportPickup && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* 2. Guest Favorite toggle */}
                <div 
                  onClick={onToggleGuestFavorite}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-neutral-800">Guest Favorites Only</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    onlyGuestFavorite ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
                  }`}>
                    {onlyGuestFavorite && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* 3. Price Filter */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="text-xs font-semibold text-neutral-800 mb-2">Max Price Per Night</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSetMaxPriceFilter(maxPriceFilter === 350 ? null : 350)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        maxPriceFilter === 350
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      Under $350
                    </button>
                    <button
                      onClick={() => onSetMaxPriceFilter(maxPriceFilter === 500 ? null : 500)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        maxPriceFilter === 500
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      Under $500
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {totalFilteredCount} {totalFilteredCount === 1 ? 'stay' : 'stays'} available
                  </span>
                  <button
                    onClick={() => setIsFilterPopoverOpen(false)}
                    className="px-4 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-black"
                  >
                    Done
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
