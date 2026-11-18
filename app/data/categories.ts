import { CategoryId } from '../types';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  iconName: 'all' | 'beach' | 'mountains' | 'villas' | 'apartments' | 'countryside' | 'unique';
  count: number;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Stays', iconName: 'all', count: 12 },
  { id: 'beach', label: 'Beach', iconName: 'beach', count: 3 },
  { id: 'mountains', label: 'Mountains', iconName: 'mountains', count: 2 },
  { id: 'villas', label: 'Villas', iconName: 'villas', count: 3 },
  { id: 'apartments', label: 'Apartments', iconName: 'apartments', count: 2 },
  { id: 'countryside', label: 'Countryside', iconName: 'countryside', count: 2 },
  { id: 'unique', label: 'Unique Stays', iconName: 'unique', count: 2 },
];
