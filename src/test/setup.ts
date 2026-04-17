import '@testing-library/jest-dom/vitest';

if (!import.meta.env.VITE_API_URL) {
  (import.meta.env as Record<string, string>).VITE_API_URL =
    'https://script.google.com/macros/s/TEST_DEPLOYMENT_ID_FOR_TESTS/exec';
}
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  (import.meta.env as Record<string, string>).VITE_GOOGLE_CLIENT_ID =
    'test-client-id.apps.googleusercontent.com';
}
