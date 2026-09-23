// =========================================================================
// ZUSTAND FILTER STORE: FACETED SEARCH STATE
// =========================================================================

import { create } from 'zustand';
import { FlowerCategory, OccasionType, FreshnessClassification } from '../shared/types';

interface FilterState {
  search: string;
  category: FlowerCategory | '';
  occasion: OccasionType | '';
  pinCode: string;
  minPrice?: number;
  maxPrice?: number;
  freshnessClass: FreshnessClassification | '';
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'freshness';

  // Actions
  setSearch: (search: string) => void;
  setCategory: (category: FlowerCategory | '') => void;
  setOccasion: (occasion: OccasionType | '') => void;
  setPinCode: (pinCode: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setFreshnessClass: (freshness: FreshnessClassification | '') => void;
  setSortBy: (sort: 'popular' | 'price_asc' | 'price_desc' | 'freshness') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  category: '',
  occasion: '',
  pinCode: '400001',
  minPrice: undefined,
  maxPrice: undefined,
  freshnessClass: '',
  sortBy: 'popular',

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setOccasion: (occasion) => set({ occasion }),
  setPinCode: (pinCode) => set({ pinCode }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setFreshnessClass: (freshnessClass) => set({ freshnessClass }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({
    search: '',
    category: '',
    occasion: '',
    minPrice: undefined,
    maxPrice: undefined,
    freshnessClass: '',
    sortBy: 'popular',
  }),
}));
