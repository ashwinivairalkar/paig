import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const useApiConfig = create<ApiConfig>(any)(
  persist(
    (set) => ({
      apiBaseUrl: import.meta.env.VITE_PUBLIC_PROMPTFOO_REMOTE_API_BASE_URL || '',
      setApiBaseUrl: (apiBaseUrl) => set({ apiBaseUrl }),
      persistApiBaseUrl: false,
      enablePersistApiBaseUrl: () => set({ persistApiBaseUrl: true }),
      fetchingPromise: null,
      setFetchingPromise: (fetchingPromise) => set({ fetchingPromise }),
    }),
    {
      name: 'api-config-storage',
      partialize: (state) => {
        return state.persistApiBaseUrl ? { apiBaseUrl: state.apiBaseUrl } : {};
      },
    },
  ),
);

export default useApiConfig;