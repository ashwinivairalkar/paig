import { get, set, del } from 'idb-keyval';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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


export const useReportStore = create<ReportState>(any)(
  persist(
    (set) => ({
      showPercentagesOnRiskCards: false,
      setShowPercentagesOnRiskCards: (show) =>
        set(() => ({ showPercentagesOnRiskCards: show })),
      pluginPassRateThreshold: 1.0,
      setPluginPassRateThreshold: (threshold) =>
        set(() => ({ pluginPassRateThreshold: threshold })),
      showComplianceSection: false,
      setShowComplianceSection: (show) => set(() => ({ showComplianceSection: show })),
    }),
    {
      name: 'ReportViewStorage',
      storage: createJSONStorage(() => storage),
    },
  ),
);