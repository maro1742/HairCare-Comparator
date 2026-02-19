export const pushToDataLayer = (event: string, params: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
            event,
            ...params,
        });
    }
};

export const trackPageView = (path: string) => {
    pushToDataLayer('page_view', {
        page_path: path,
    });
};
