/// <reference types="vite/client" />

interface AppConfig {
  GOOGLE_MAPS_API_KEY: string;
}

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

export {};
