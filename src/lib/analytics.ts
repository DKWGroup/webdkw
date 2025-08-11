export type AnalyticsPayload = {
  event: string;
  category?: string;
  label?: string;
  location?: string;
  page?: string;
  value?: number;
  [key: string]: any;
};

export const track = (payload: AnalyticsPayload) => {
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    const { event, category, label, location, page, value, ...rest } = payload;
    w.dataLayer.push({
      event,
      event_category: category,
      event_label: label,
      event_location: location,
      page_path: page || window.location.pathname,
      value,
      ...rest,
    });
  } catch {
    // no-op
  }
};
