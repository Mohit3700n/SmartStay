'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Menu, 
  User, 
  Heart,
  Luggage,
  Sparkles,
  HelpCircle,
  LogOut,
  Car,
  Compass,
  Check,
  ShieldAlert,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  FileCheck2,
  Users2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Currency, Language, ActiveTab } from '../types';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenHostModal: () => void;
  savedFavoritesCount: number;
  onToggleFavoritesFilter: () => void;
  isShowingFavoritesOnly: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenHostModal,
  savedFavoritesCount,
  onToggleFavoritesFilter,
  isShowingFavoritesOnly,
}) => {
  const { 
    currency, 
    setCurrency, 
    language, 
    setLanguage, 
    activeTab, 
    setActiveTab, 
    currentUser, 
    logout,
    requireAuth,
    setIsWelcomeGatewayOpen,
    setIsOfflineVoucherModalOpen,
    setIsAiModalOpen,
    setIsSosModalOpen,
    t
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'guest-dashboard') {
      if (!requireAuth('guest', 'view your Guest Dashboard & Trips')) {
        return;
      }
    }
    if (tab === 'host-dashboard') {
      if (!requireAuth('host', 'access the Host Partner Console')) {
        return;
      }
    }

    setActiveTab(tab);
    if (isShowingFavoritesOnly) onToggleFavoritesFilter();
    window.scrollTo({ top: tab === 'stays' ? 520 : 0, behavior: 'smooth' });
  };

  const handleBecomeHostClick = () => {
    if (!requireAuth('host', 'register as a SmartStay Host partner')) {
      return;
    }
    setActiveTab('host-dashboard');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'glass-header border-b border-neutral-200/80 shadow-xs py-3' 
          : 'bg-white border-b border-neutral-100 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between gap-2">
          
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('stays');
                if (isShowingFavoritesOnly) onToggleFavoritesFilter();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF385C] to-[#E00B41] flex items-center justify-center text-white shadow-sm shadow-[#FF385C]/30 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 9.5V20.5C2 21.3284 2.67157 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V9.5L12 2Z" fill="currentColor" opacity="0.3"/>
                  <path d="M12 4.5L4 10.5V20H20V10.5L12 4.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C10.6193 11 9.5 12.1193 9.5 13.5C9.5 15.375 12 18 12 18C12 18 14.5 15.375 14.5 13.5C14.5 12.1193 13.3807 11 12 11Z" fill="white"/>
                </svg>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-[#FF385C] transition-colors leading-none">
                    SmartStay
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    INDIA & GLOBAL
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-neutral-400 tracking-wider mt-1 uppercase">
                  Stay Smart · Travel Safe
                </span>
              </div>
            </a>
          </div>

          {/* 2. Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/70 p-1.5 rounded-full border border-neutral-200/60 shadow-inner text-sm">
            
            <button
              onClick={() => handleNavClick('stays')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stays' && !isShowingFavoritesOnly
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{t('stays')}</span>
            </button>

            <button
              onClick={() => handleNavClick('experiences')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'experiences'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('experiences')}</span>
            </button>

            <button
              onClick={() => handleNavClick('cabs')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cabs'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('cabs')}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('stays');
                const el = document.getElementById('concierge-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-full font-semibold text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer flex items-center gap-1"
            >
              <Luggage className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('concierge')}</span>
            </button>

            <button
              onClick={() => handleNavClick('smartstay-plus')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'smartstay-plus'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>SmartStay+</span>
            </button>

            <button
              onClick={() => handleNavClick('guest-dashboard')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guest-dashboard'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-neutral-700" />
              <span>{t('dashboard')}</span>
            </button>

          </nav>

          {/* 3. Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Role indicator pill if logged in */}
            {currentUser && (
              <span className={`hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                currentUser.role === 'host'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {currentUser.role === 'host' ? '★ Host Partner' : '✓ Guest Account'}
              </span>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-rose-50 hover:from-purple-100 hover:to-rose-100 border border-purple-200/80 rounded-full text-xs font-bold text-purple-900 shadow-2xs transition-all cursor-pointer"
              title="Launch AI Travel Assistant"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">AI Travel Guide</span>
            </button>

            {/* Offline Airport Voucher Quick Button */}
            <button
              onClick={() => setIsOfflineVoucherModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-full text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
              title="Pre-Booked Airport Offline Voucher"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Airport Voucher</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full text-xs font-bold text-[#FF385C] transition-colors cursor-pointer"
              title="Emergency SOS & Trip Safety"
            >
              <ShieldAlert className="w-4 h-4 text-[#FF385C] animate-pulse" />
              <span className="hidden md:inline">SOS Safety</span>
            </button>

            {/* Currency & Language Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-800 text-xs font-semibold text-neutral-800 transition-all cursor-pointer bg-white"
                aria-label="Currency and language"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-600" />
                <span>{currency}</span>
                <span className="text-neutral-300">·</span>
                <span>{language}</span>
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-neutral-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Currency Section */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                      Select Currency (Default: INR)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { code: 'INR', label: 'INR (₹) - India' },
                        { code: 'USD', label: 'USD ($)' },
                        { code: 'EUR', label: 'EUR (€)' },
                        { code: 'GBP', label: 'GBP (£)' },
                      ].map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code as Currency);
                          }}
                          className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                            currency === c.code
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <span>{c.label}</span>
                          {currency === c.code && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Section */}
                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                      Language
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { code: 'EN', name: 'English' },
                        { code: 'HI', name: 'हिंदी (Hindi)' },
                        { code: 'FR', name: 'Français' },
                        { code: 'ES', name: 'Español' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLanguage(l.code as Language);
                          }}
                          className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                            language === l.code
                              ? 'bg-rose-50 text-[#FF385C] border border-rose-200'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <span>{l.name}</span>
                          {language === l.code && <Check className="w-3.5 h-3.5 text-[#FF385C]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* User Profile Pill Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 border border-neutral-200 rounded-full hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                aria-label="User navigation"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentUser ? (
                    currentUser.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-3.5 h-3.5 text-neutral-200" />
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-3xl shadow-2xl border border-neutral-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {currentUser ? (
                    <>
                      <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/60 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-neutral-900">{currentUser.name}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-700">
                            {currentUser.role}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">{currentUser.email || currentUser.phone || 'Signed in via Supabase'}</p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveTab('guest-dashboard');
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                          <span>Guest Dashboard (My Trips & Stays)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (currentUser.role !== 'host') {
                              requireAuth('host', 'access the Host Partner Console');
                              return;
                            }
                            setActiveTab('host-dashboard');
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Host Dashboard (Manage Listings)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsOfflineVoucherModalOpen(true);
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          <span>Pre-Booked Airport Offline Voucher</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsWelcomeGatewayOpen(true);
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Users2 className="w-4 h-4 text-purple-600" />
                          <span>Switch Welcome Gate / Role</span>
                        </button>
                      </div>

                      <div className="border-t border-neutral-100 pt-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/70">
                        <p className="text-xs font-bold text-neutral-800">Welcome to SmartStay</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Explore stays as a visitor or sign in to book.</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsWelcomeGatewayOpen(true);
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-[#FF385C] hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Users2 className="w-4 h-4" />
                          <span>Choose Guest / Host Welcome Gate</span>
                        </button>

                        <button
                          onClick={() => {
                            onOpenAuth('signup');
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-5 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-50 cursor-pointer"
                        >
                          Sign up
                        </button>
                        <button
                          onClick={() => {
                            onOpenAuth('login');
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                        >
                          Log in
                        </button>
                      </div>

                      <div className="border-t border-neutral-100 my-1.5" />

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleBecomeHostClick();
                          }}
                          className="w-full text-left px-5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Host your home</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsOfflineVoucherModalOpen(true);
                          }}
                          className="w-full text-left px-5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pre-Booked Airport Pass</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsSosModalOpen(true);
                          }}
                          className="w-full text-left px-5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                          <span>Safety Center & Emergency</span>
                        </button>
                      </div>
                    </>
                  )}

                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around border-t border-neutral-100 mt-2.5 pt-2 text-xs font-semibold text-neutral-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleNavClick('stays')}
            className={`py-1 px-3 rounded-full whitespace-nowrap ${activeTab === 'stays' ? 'text-[#FF385C] font-bold bg-rose-50' : ''}`}
          >
            Stays
          </button>
          <button
            onClick={() => handleNavClick('experiences')}
            className={`py-1 px-3 rounded-full whitespace-nowrap ${activeTab === 'experiences' ? 'text-rose-600 font-bold bg-rose-50' : ''}`}
          >
            Experiences
          </button>
          <button
            onClick={() => handleNavClick('cabs')}
            className={`py-1 px-3 rounded-full whitespace-nowrap ${activeTab === 'cabs' ? 'text-emerald-700 font-bold bg-emerald-50' : ''}`}
          >
            Cabs
          </button>
          <button
            onClick={() => handleNavClick('smartstay-plus')}
            className={`py-1 px-3 rounded-full whitespace-nowrap ${activeTab === 'smartstay-plus' ? 'text-purple-700 font-bold bg-purple-50' : ''}`}
          >
            SmartStay+
          </button>
          <button
            onClick={() => handleNavClick('guest-dashboard')}
            className={`py-1 px-3 rounded-full whitespace-nowrap ${activeTab === 'guest-dashboard' ? 'text-neutral-900 font-bold bg-neutral-100' : ''}`}
          >
            My Trips
          </button>
        </div>

      </div>
    </header>
  );
};
