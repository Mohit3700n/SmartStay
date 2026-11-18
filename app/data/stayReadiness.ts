import { Property } from '../types';

export interface StayReadinessItem {
  id: string;
  label: string;
  available: boolean;
  detail: string;
}

export interface StayReadiness {
  score: number;
  total: number;
  items: StayReadinessItem[];
}

export const getStayReadiness = (property: Property): StayReadiness => {
  const checkIn = property.smartCheckIn;
  const nearbyEssentials = checkIn?.nearbyEssentials ?? [];

  const items: StayReadinessItem[] = [
    {
      id: 'check-in',
      label: 'Check-in instructions',
      available: Boolean(checkIn?.checkInTime && checkIn?.checkOutTime && checkIn?.directions),
      detail: checkIn
        ? `${checkIn.checkInTime} check-in · ${checkIn.checkOutTime} checkout`
        : 'No check-in schedule listed',
    },
    {
      id: 'connectivity',
      label: 'Wi-Fi details',
      available: Boolean(checkIn?.wifiNetwork),
      detail: checkIn?.wifiNetwork ? `Network listed: ${checkIn.wifiNetwork}` : 'Wi-Fi details not listed',
    },
    {
      id: 'arrival',
      label: 'Arrival options',
      available: property.hasAirportPickup || property.hasLuggageAssistance,
      detail: property.hasAirportPickup
        ? 'Airport pickup listed'
        : property.hasLuggageAssistance
          ? 'Luggage assistance listed'
          : 'No arrival service listed',
    },
    {
      id: 'essentials',
      label: 'Nearby essentials',
      available: nearbyEssentials.length > 0,
      detail: nearbyEssentials.length
        ? `${nearbyEssentials.length} nearby service${nearbyEssentials.length === 1 ? '' : 's'} listed`
        : 'Nearby services not listed',
    },
    {
      id: 'house-rules',
      label: 'House rules',
      available: Boolean(checkIn?.houseRules.length),
      detail: checkIn?.houseRules.length
        ? `${checkIn.houseRules.length} house rule${checkIn.houseRules.length === 1 ? '' : 's'} listed`
        : 'House rules not listed',
    },
  ];

  return {
    score: items.filter((item) => item.available).length,
    total: items.length,
    items,
  };
};
