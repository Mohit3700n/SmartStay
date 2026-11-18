export interface EmergencyContact {
  country: string;
  nationalEmergency: string;
  police: string;
  ambulance: string;
  womenHelpline?: string;
  touristHelpline?: string;
}

export const EMERGENCY_DIRECTORY: Record<string, EmergencyContact> = {
  India: {
    country: 'India',
    nationalEmergency: '112',
    police: '100',
    ambulance: '102 / 108',
    womenHelpline: '1091',
    touristHelpline: '1363 (24/7 Multi-language Tourist Helpline)',
  },
  International: {
    country: 'Global Default',
    nationalEmergency: '911 (US/CA) / 112 (EU/UK/IN)',
    police: '112 / 999',
    ambulance: '112 / 999',
    touristHelpline: '+1 (800) 555-SAFE (SmartStay Global SOS)',
  },
};

export interface SafeGuaranteePoint {
  icon: string;
  title: string;
  desc: string;
}

export const SAFE_GUARANTEE_POINTS: SafeGuaranteePoint[] = [
  { icon: 'ShieldCheck', title: '100% Verified Identities', desc: 'Government photo ID & biometric verification for every host, chauffeur, and tour guide.' },
  { icon: 'MapPin', title: 'Live Trip Sharing', desc: 'Share your live stay location and cab GPS tracking link with family in one click via WhatsApp or SMS.' },
  { icon: 'PhoneCall', title: 'One-Tap SOS Dispatch', desc: 'Instant connection to local emergency services (112 in India) with automated address broadcast.' },
  { icon: 'Luggage', title: 'Luggage Protection Guarantee', desc: 'Up to ₹50,000 / $600 baggage coverage against transit loss or damage.' },
];
