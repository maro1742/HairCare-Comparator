import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, UserProfile, Filters, AnalyticsEvent } from '../types';

const MAX_COMPARE = 4;

interface StoreState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  filters: Filters;
  setFilters: (filters: Filters) => void;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;

  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

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
  sort_by: 'match'
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      filters: DEFAULT_FILTERS,
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value }
        })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS }),

      compareList: [],
      addToCompare: (product) =>
        set((state) => {
          if (state.compareList.length >= MAX_COMPARE) return state;
          if (state.compareList.some((p) => p.id === product.id)) return state;
          return { compareList: [...state.compareList, product] };
        }),
      removeFromCompare: (productId) =>
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== productId)
        })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (productId) => {
        return useStore.getState().compareList.some((p) => p.id === productId);
      },

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
        compareList: state.compareList
      })
    }
  )
);
