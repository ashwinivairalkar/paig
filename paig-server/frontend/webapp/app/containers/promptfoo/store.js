//import { get, set, del } from 'idb-keyval';
//import { create } from 'zustand'; // Ensure you're importing `create` from zustand


//import { persist, createJSONStorage } from 'zustand/middleware';
//import create from 'zustand';
//import { persist, createJSONStorage } from 'zustand/middleware';
//import { get, set, del } from 'idb-keyval';

// Custom storage implementation
const storage = {
  getItem: async (name) => {
    return (await get(name)) || null;
  },
  setItem: async (name, value) => {
    await set(name, value);
  },
  removeItem: async (name) => {
    await del(name);
  },
};

// Create the Zustand store using `create` function from `zustand`
export const useReportStore = create(
  persist(
    (set) => ({
      showPercentagesOnRiskCards: false,
      setShowPercentagesOnRiskCards: (show) =>
        set(() => ({ showPercentagesOnRiskCards: show })),
      pluginPassRateThreshold: 1.0,
      setPluginPassRateThreshold: (threshold) =>
        set(() => ({ pluginPassRateThreshold: threshold })),
      showComplianceSection: false,
      setShowComplianceSection: (show) =>
        set(() => ({ showComplianceSection: show })),
    }),
    {
      name: 'ReportViewStorage', // Storage name for persistence
      storage: createJSONStorage(() => storage), // Use the custom storage object
    }
  )
);
