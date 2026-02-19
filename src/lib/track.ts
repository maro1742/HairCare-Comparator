import { useStore } from '../store/useStore';
import { pushToDataLayer } from '../utils/gtm';

export function track(eventName: string, payload?: Record<string, unknown>) {
  const event = {
    name: eventName,
    timestamp: Date.now(),
    payload
  };

  console.log('[Analytics]', eventName, payload);

  useStore.getState().addAnalyticsEvent(event);
  pushToDataLayer(eventName, payload);
}

export const trackEvents = {
  view_list: (page: string, count: number) => track('view_list', { page, count }),
  view_product: (productId: string) => track('view_product', { productId }),
  filter_change: (filters: Record<string, unknown>) => track('filter_change', { filters }),
  quiz_start: () => track('quiz_start'),
  quiz_complete: (profileSummary: Record<string, unknown>) => track('quiz_complete', profileSummary),
  outbound_click: (productId: string, merchant: string, placement: string, position: number, priceShown: number) =>
    track('outbound_click', { productId, merchant, placement, position, priceShown }),
};
