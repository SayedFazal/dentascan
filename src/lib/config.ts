// API Configuration
// For web: uses relative paths (same origin as current page)
// For Android: must explicitly set the server address

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

export const getApiUrl = (endpoint: string): string => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint;
};
