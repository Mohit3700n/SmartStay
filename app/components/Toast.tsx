'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, Heart, X, Luggage, ShieldCheck } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'favorite' | 'booking' | 'airport' | 'auth';
  title: string;
  description: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-neutral-900 text-white rounded-2xl p-4 shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'favorite' && <Heart className="w-5 h-5 text-[#FF385C] fill-[#FF385C]" />}
            {toast.type === 'booking' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'airport' && <Luggage className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'auth' && <ShieldCheck className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white">{toast.title}</h4>
            <p className="text-xs text-neutral-300 mt-0.5 leading-snug">{toast.description}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
