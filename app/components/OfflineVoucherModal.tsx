'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Printer, 
  Download, 
  Phone, 
  MessageSquare, 
  Wifi, 
  Signal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Car, 
  QrCode,
  FileCheck
} from 'lucide-react';
import { OfflineAirportVoucher } from '../types';

interface OfflineVoucherModalProps {
  voucher: OfflineAirportVoucher | null;
  onClose: () => void;
}

export const OfflineVoucherModal: React.FC<OfflineVoucherModalProps> = ({ voucher, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!voucher) return null;

  const handleSaveOffline = () => {
    // Persist to local storage for offline viewing
    try {
      localStorage.setItem(`smartstay_voucher_${voucher.bookingId}`, JSON.stringify({
        ...voucher,
        savedOfflineAt: new Date().toLocaleString(),
      }));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }

    setIsSaved(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col border border-neutral-100">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Offline Arrival Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOffline}
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save & Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Voucher Body */}
        <div className="overflow-y-auto flex-1 space-y-5 py-4 pr-1">
          
          {/* Voucher Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">SmartStay Concierge</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-rose-500 text-white">
                  VERIFIED CHAUFFEUR
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Airport Pickup & White-Glove Baggage Escort Pass
              </p>
              <div className="mt-2 font-mono text-xs font-bold text-amber-300">
                Booking Ref: {voucher.bookingId} · Code: {voucher.voucherCode}
              </div>
            </div>

            <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-neutral-900" />
            </div>
          </div>

          {/* Passenger & Flight Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Passenger Name</span>
              <span className="font-bold text-neutral-900 block mt-0.5 truncate">{voucher.passengerName}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Arrival Airport</span>
              <span className="font-bold text-neutral-900 block mt-0.5 truncate">{voucher.airportName.split('(')[0]}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Flight Number</span>
              <span className="font-bold text-neutral-900 font-mono block mt-0.5">{voucher.flightNumber}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-neutral-400 block font-medium">Luggage Pieces</span>
              <span className="font-bold text-neutral-900 block mt-0.5">{voucher.baggageCount} Bags Escorted</span>
            </div>
          </div>

          {/* Driver & Vehicle Card */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Assigned Chauffeur & Vehicle
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Police Background Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 font-medium">Driver Name</span>
                <div className="text-base font-extrabold text-neutral-900 mt-0.5">{voucher.driverName}</div>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${voucher.driverPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white font-bold flex items-center gap-1.5 shadow-xs hover:bg-black transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {voucher.driverPhone}</span>
                  </a>
                  <a
                    href={`sms:${voucher.driverPhone}`}
                    className="p-1.5 border border-neutral-300 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors"
                    title="Send SMS"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 font-medium">Vehicle & License Plate</span>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">{voucher.vehicleModel}</div>
                <div className="text-lg font-black font-mono tracking-wider text-neutral-900 bg-white px-3 py-1 rounded-xl border border-neutral-300 mt-1 inline-block">
                  {voucher.vehicleNumber}
                </div>
              </div>
            </div>

            {/* Meeting Point Instructions */}
            <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-1">
              <strong className="text-neutral-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                Terminal Meeting Point:
              </strong>
              <p className="text-neutral-600 leading-relaxed">
                {voucher.terminalMeetingPoint}
              </p>
            </div>
          </div>

          {/* Airport Offline Guidance Section (Wi-Fi, Roaming, SMS Backup) */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-neutral-600" />
              Offline Connectivity & Terminal Guidance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-neutral-600">
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <strong className="text-neutral-900 block mb-1">📶 Free Airport Wi-Fi</strong>
                <p className="leading-snug text-[11px] text-neutral-500">{voucher.offlineTips.airportWifi}</p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <strong className="text-neutral-900 block mb-1">📱 Roaming / eSIM</strong>
                <p className="leading-snug text-[11px] text-neutral-500">{voucher.offlineTips.roamingEsim}</p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                <strong className="text-neutral-900 block mb-1">📞 SMS & Call Backup</strong>
                <p className="leading-snug text-[11px] text-neutral-500">{voucher.offlineTips.smsCallBackup}</p>
              </div>
            </div>

            {/* Crucial Offline Disclaimer (Requirement 8) */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Important Notice:</strong> Live GPS satellite tracking requires an active mobile data connection. If arriving without internet access or international roaming, please save or screenshot this offline voucher beforehand. You can meet your driver directly at the designated meeting point or reach them via regular phone call/SMS.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
