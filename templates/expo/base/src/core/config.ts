const apiMode = process.env.EXPO_PUBLIC_API_MODE === 'remote' ? 'remote' : 'mock';

export const appConfig = {
  apiMode,
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.example.com',
  analyticsEnabled: process.env.EXPO_PUBLIC_ANALYTICS !== 'false',
  mockDelayMs: Number(process.env.EXPO_PUBLIC_MOCK_DELAY_MS ?? 800),
} as const;
