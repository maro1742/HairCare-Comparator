import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Filters, AnalyticsEvent } from '../types';

interface StoreState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  filters: Filters;
  setFilters: (filters: Filters) => void;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;

  comparisonProductIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  analyticsQueue: AnalyticsEvent[];
  addAnalyticsEvent: (event: AnalyticsEvent) => void;
  clearAnalyticsQueue: () => void;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  hair_goals: [],
  hair_types: [],
  scalp_types: [],
  avoid_ingredients: [],
  vegan_only: false,
  price_min: 10,
  price_max: 500,
  brands: [],
  sort_by: 'match',
  hair_length: 'medium',
  hair_porosity: 'medium'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      filters: DEFAULT_FILTERS,
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value }
        })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS }),

      comparisonProductIds: [],
      addToComparison: (productId) =>
        set((state) => {
          if (state.comparisonProductIds.includes(productId)) return state;
          if (state.comparisonProductIds.length >= 4) return state;
          return { comparisonProductIds: [...state.comparisonProductIds, productId] };
        }),
      removeFromComparison: (productId) =>
        set((state) => ({
          comparisonProductIds: state.comparisonProductIds.filter(id => id !== productId)
        })),
      clearComparison: () => set({ comparisonProductIds: [] }),
      isInComparison: (productId: string): boolean => get().comparisonProductIds.includes(productId),

      analyticsQueue: [],
      addAnalyticsEvent: (event) =>
        set((state) => ({
          analyticsQueue: [...state.analyticsQueue, { ...event, timestamp: Date.now() }]
        })),
      clearAnalyticsQueue: () => set({ analyticsQueue: [] })
    }),
    {
      name: 'haircare-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        filters: state.filters,
        comparisonProductIds: state.comparisonProductIds
      })
    }
  )
);
