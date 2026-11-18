'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Compass, 
  Star, 
  Clock, 
  Users, 
  Check, 
  MapPin, 
  X, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EXPERIENCES } from '../data/experiences';
import { Experience } from '../types';
import { useApp } from '../context/AppContext';

export const ExperiencesSection: React.FC = () => {
  const { formatPrice, addBooking, t } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [expGuests, setExpGuests] = useState(2);
  const [expDate, setExpDate] = useState('2026-11-28');
  const [isBooked, setIsBooked] = useState(false);

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'culinary', label: 'Food & Cooking' },
    { id: 'heritage', label: 'Heritage & Culture' },
    { id: 'nature', label: 'Sailing & Water' },
    { id: 'wellness', label: 'Yoga & Retreats' },
    { id: 'adventure', label: 'Trekking & Wildlife' },
  ];

  const filteredExperiences = selectedCategory === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter((e) => e.category === selectedCategory);

  const handleBookExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExp) return;

    setIsBooked(true);
    const totalINR = selectedExp.pricePerPerson * expGuests;

    addBooking({
      itemType: 'experience',
      title: selectedExp.title,
      location: `${selectedExp.location}, ${selectedExp.country}`,
      image: selectedExp.image,
      dateRange: `${expDate} (${selectedExp.duration})`,
      guestsCount: expGuests,
      totalPrice: totalINR,
      currency: 'INR',
      status: 'confirmed',
    });

    setTimeout(() => {
      setIsBooked(false);
      setSelectedExp(null);
      alert(`Booking confirmed! You have reserved "${selectedExp.title}" for ${expGuests} guests.`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Title & Category Pills */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Immersive Local Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Curated Local Experiences & Activities
          </h2>
          <p className="mt-1 text-neutral-500 text-sm">
            Handcrafted heritage tours, private sailing cruises, culinary masterclasses, and sunrise treks led by local insiders.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredExperiences.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setSelectedExp(exp)}
            className="group flex flex-col bg-white rounded-3xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-104 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-900 shadow-xs">
                ★ {exp.rating} ({exp.reviewsCount})
              </div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
                {exp.duration}
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span>{exp.location}, {exp.country}</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#FF385C] transition-colors leading-snug">
                  {exp.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">From</span>
                  <span className="font-black text-neutral-900 text-base">
                    {formatPrice(exp.pricePerPerson)}
                  </span>
                  <span className="text-xs text-neutral-500 font-normal ml-1">/ person</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-200">
                    <Image src={exp.hostAvatar} alt={exp.hostName} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">{exp.hostName.split(' ')[0]}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Experience Booking Modal */}
      {selectedExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedExp(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <Image src={selectedExp.image} alt={selectedExp.title} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                    <span>{selectedExp.location}, {selectedExp.country}</span>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 leading-tight mt-0.5">
                    {selectedExp.title}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-1 flex items-center gap-3">
                    <span>★ {selectedExp.rating} ({selectedExp.reviewsCount} reviews)</span>
                    <span>·</span>
                    <span>{selectedExp.duration}</span>
                    <span>·</span>
                    <span>{selectedExp.groupSize}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 leading-relaxed">
                {selectedExp.description}
              </div>

              {/* Inclusions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">What is Included</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedExp.included.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-800">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookExperience} className="p-5 rounded-2xl border border-neutral-200 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Participants</label>
                    <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <span className="text-xs font-bold">{expGuests} Guests</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpGuests(Math.max(1, expGuests - 1))}
                          className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpGuests(Math.min(8, expGuests + 1))}
                          className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-neutral-500">
                    {formatPrice(selectedExp.pricePerPerson)} x {expGuests} guests:
                  </span>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatPrice(selectedExp.pricePerPerson * expGuests)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isBooked}
                  className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isBooked ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Reserving Experience...
                    </span>
                  ) : (
                    <span>Reserve Guided Experience</span>
                  )}
                </button>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
