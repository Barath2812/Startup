// Configuration utilities
export const getBackendUrl = () => {
  // Always use the environment variable if available (for both dev and prod)
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // Fallback for development
  if (!import.meta.env.PROD) {
    return "http://localhost:5000";
  }
  // If no environment variable is set in production, this will cause an error
  // which is better than silently failing
  throw new Error("VITE_BACKEND_URL environment variable is required in production");
};
