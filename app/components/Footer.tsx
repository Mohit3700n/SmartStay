'use client';

import React from 'react';
import { Globe, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F7F7F7] border-t border-neutral-200 mt-20 pt-14 pb-10 text-neutral-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main 4 Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-200/80">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF385C] to-[#E00B41] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2L2 9.5V20.5C2 21.3284 2.67157 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V9.5L12 2Z"/>
                </svg>
              </div>
              <span className="font-extrabold text-lg text-neutral-900 tracking-tight">SmartStay</span>
            </div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Stay Smart · Travel Safe
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              Exceptional stays paired with seamless chauffeured airport transfers and door-to-door luggage escort.
            </p>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">SmartStay Safe Cover</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Combating discrimination</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Accessibility support</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Cancellation policies</a></li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Hosting</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">SmartStay your home</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Host damage protection</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Hosting resources</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Community forum</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Host responsibly</a></li>
            </ul>
          </div>

          {/* Concierge & Travel */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Airport & Luggage</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#concierge-section" className="hover:underline hover:text-neutral-900 transition-colors">Airport Chauffeur Network</a></li>
              <li><a href="#concierge-section" className="hover:underline hover:text-neutral-900 transition-colors">Hands-free Luggage Delivery</a></li>
              <li><a href="#concierge-section" className="hover:underline hover:text-neutral-900 transition-colors">Flight delay protection</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">VIP terminal meet & greet</a></li>
              <li><a href="#" className="hover:underline hover:text-neutral-900 transition-colors">Zero lost bag guarantee</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Settings */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 SmartStay, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-neutral-800">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-neutral-800">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-neutral-800">Sitemap</a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-neutral-800">Company details</a>
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <button className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </button>
            <button className="hover:underline cursor-pointer">
              <span>$ USD</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
