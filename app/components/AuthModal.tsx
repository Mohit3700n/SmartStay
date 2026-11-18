'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  KeyRound, 
  Sparkles,
  User
} from 'lucide-react';
import { authService, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  forcedRole?: 'guest' | 'host';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  forcedRole = 'guest',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [role, setRole] = useState<'guest' | 'host'>(forcedRole);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status & Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const hasSupabase = isSupabaseConfigured();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      if (hasSupabase) {
        if (mode === 'signup') {
          const res = await authService.signUpEmail(email, password, {
            name: name || email.split('@')[0],
            role: role,
          });
          onSuccess({
            id: res.user?.id || `usr-${Date.now()}`,
            name: name || email.split('@')[0],
            email: email,
            role: role,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            authProvider: 'supabase_email',
          });
        } else {
          const res = await authService.signInEmail(email, password);
          onSuccess({
            id: res.user?.id || `usr-${Date.now()}`,
            name: res.user?.user_metadata?.name || email.split('@')[0],
            email: email,
            role: (res.user?.user_metadata?.role as any) || role,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            authProvider: 'supabase_email',
          });
        }
      } else {
        // Explicit Sandbox mode when credentials are not yet entered in .env.local
        onSuccess({
          id: `sandbox-usr-${Date.now()}`,
          name: name || (email ? email.split('@')[0] : (role === 'host' ? 'Host Partner' : 'SmartStay Traveler')),
          email: email || 'guest@smartstay.travel',
          role: role,
          avatar: role === 'host'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          authProvider: 'demo',
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid international or Indian phone number with country code (e.g. +91 98201 44521).');
      return;
    }

    setIsLoading(true);
    try {
      if (hasSupabase) {
        await authService.sendPhoneOtp(phone);
        setOtpSent(true);
        setInfoMessage(`SMS OTP sent to ${phone}. Enter the 6-digit code below.`);
      } else {
        // Transparent disclosure
        setOtpSent(true);
        setInfoMessage(`Supabase provider is not yet configured in .env.local. [Sandbox Mode: Use demo OTP "123456" to proceed].`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send SMS OTP. Check phone provider configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (hasSupabase) {
        const res = await authService.verifyPhoneOtp(phone, otpCode);
        onSuccess({
          id: res.user?.id || `usr-phone-${Date.now()}`,
          name: name || `Traveler (${phone.slice(-4)})`,
          phone: phone,
          role: role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          authProvider: 'supabase_phone_otp',
        });
      } else {
        if (otpCode !== '123456') {
          throw new Error('Sandbox verification: Please enter code "123456" or configure your SMS provider in .env.local.');
        }
        onSuccess({
          id: `sandbox-phone-${Date.now()}`,
          name: name || (role === 'host' ? 'Verified Host' : `Traveler (${phone.slice(-4)})`),
          phone: phone,
          role: role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          authProvider: 'demo',
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF385C] to-[#E00B41] text-white flex items-center justify-center mx-auto shadow-md mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {mode === 'login' ? 'Sign into SmartStay' : 'Create SmartStay Account'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Role: <strong className="text-neutral-900 uppercase">{role}</strong> · India & Global Platform
          </p>
        </div>

        {/* Role Selector Tabs (Guest vs Host) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('guest')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              role === 'guest'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Guest Account
          </button>
          <button
            type="button"
            onClick={() => setRole('host')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              role === 'host'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Host Partner
          </button>
        </div>

        {/* Auth Method Selector (Email vs Phone OTP) */}
        <div className="flex border-b border-neutral-100 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2 border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2 border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone SMS OTP</span>
          </button>
        </div>

        {/* Error / Info Alerts */}
        {errorMessage && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* EMAIL & PASSWORD FORM */}
        {authMethod === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? `Sign In as ${role}` : `Create ${role} Account`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* PHONE OTP FORM */
          <div className="space-y-3">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Phone Number (with Country Code)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98201 44521"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Supports Indian numbers (+91) and international mobile carriers.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <span>Sending SMS...</span> : <span>Send 6-Digit OTP</span>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700">Enter 6-Digit SMS Code</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] font-semibold text-neutral-500 underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-black font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <span>Verifying...</span> : <span>Verify OTP & Log In</span>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Mode Toggle (Sign In vs Sign Up) */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>{mode === 'login' ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-bold text-neutral-900 underline hover:text-[#FF385C] cursor-pointer"
          >
            {mode === 'login' ? 'Register Now' : 'Sign in'}
          </button>
        </div>

        {/* Supabase Provider Notice / Sandbox Helper */}
        <div className="mt-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-500 space-y-1">
          <div className="flex items-center justify-between font-bold text-neutral-700">
            <span>Authentication Engine:</span>
            <span className={hasSupabase ? 'text-emerald-700' : 'text-amber-700'}>
              {hasSupabase ? '✓ Supabase Connected' : 'Sandbox Development Mode'}
            </span>
          </div>
          <p className="leading-snug">
            {hasSupabase
              ? 'Real Supabase SMS OTP & Email/Password session persistence is enabled.'
              : 'To enable live SMS OTP & real user accounts, configure NEXT_PUBLIC_SUPABASE_URL in .env.local.'}
          </p>
        </div>

      </div>
    </div>
  );
};
