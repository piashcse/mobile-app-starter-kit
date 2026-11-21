import { appConfig } from './config';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

export interface Analytics {
  track(event: AnalyticsEvent): void;
}

class DebugAnalytics implements Analytics {
  track(event: AnalyticsEvent): void {
    if (appConfig.analyticsEnabled && __DEV__) {
      console.debug('[analytics]', event);
    }
  }
}

export const analytics: Analytics = new DebugAnalytics();

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (__DEV__) console.debug(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => console.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => console.error(message, ...args),
};
