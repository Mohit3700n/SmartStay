'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Star, ChevronLeft, ChevronRight, Luggage, KeyRound } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { getStayReadiness } from '../data/stayReadiness';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const { formatPrice, t, setSelectedCheckInProperty } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const readiness = getStayReadiness(property);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(property.id);
  };

  return (
    <div
      onClick={() => onClick(property)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* 1. Large Rounded Image Container */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-xs group-hover:shadow-md transition-shadow duration-300">
        
        {/* Responsive Image */}
        <Image
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          priority={false}
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {property.guestFavorite && (
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-neutral-100 text-[11px] font-semibold text-neutral-900 tracking-tight flex items-center gap-1">
              <span>★ {t('guestFavorite')}</span>
            </div>
          )}
          {property.hasAirportPickup && (
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs text-[10px] font-semibold text-emerald-800 tracking-tight flex items-center gap-1 border border-emerald-100">
              <Luggage className="w-3 h-3 text-emerald-600" />
              <span>Airport Chauffeur</span>
            </div>
          )}
        </div>

        {/* Favorite Heart Button (Top Right) */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
            isFavorite ? 'animate-heart-pop' : ''
          }`}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-200 drop-shadow-xs ${
              isFavorite
                ? 'fill-[#FF385C] text-[#FF385C]'
                : 'fill-black/30 text-white hover:fill-black/45'
            }`}
          />
        </button>

        {/* Image Carousel Arrows */}
        {property.images.length > 1 && isHovered && (
          <div className="hidden sm:flex items-center justify-between absolute inset-x-2 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next photo"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Dot Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'w-4 bg-white shadow-xs'
                    : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* 2. Property Information */}
      <div className="mt-3 flex flex-col gap-0.5">
        
        {/* Title / Location & Rating */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold text-neutral-900 text-[15px] truncate tracking-tight flex items-center gap-1">
            <span>{property.location}</span>
            {property.isDomesticIndia && (
              <span className="text-[10px] font-bold text-neutral-400">· IN</span>
            )}
          </h3>
          <div className="flex items-center gap-1 text-sm font-semibold text-neutral-900 shrink-0">
            <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
            <span>{property.rating.toFixed(2)}</span>
            <span className="text-neutral-400 font-normal text-xs">({property.reviewsCount})</span>
          </div>
        </div>

        {/* Distance or View summary */}
        <p className="text-neutral-500 text-sm truncate font-normal">
          {property.distance}
        </p>

        {/* Available Dates */}
        <p className="text-neutral-500 text-sm">
          {property.availableDates}
        </p>

        <p
          className="mt-0.5 w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
          title="Based on information present in this listing, not an independent inspection"
        >
          Stay details {readiness.score}/{readiness.total}
        </p>

        {/* Dynamic Formatted Price in Selected Currency */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-bold text-neutral-900 text-[16px]">
            {formatPrice(property.pricePerNight)}
          </span>
          <span className="text-neutral-500 text-sm font-normal">{t('perNight')}</span>
          {property.originalPrice && (
            <span className="text-neutral-400 text-xs line-through ml-1">
              {formatPrice(property.originalPrice)}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
