import { create } from "zustand";

// This type have to be same with "main"
interface SettingType {
  selectedDB: string;
  stickyWindow: {
    width: number;
    height: number;
    interval: number;
  };
}

interface SettingStoreType extends SettingType {
  changeSelectedDB: (db: string) => void;
  loadSettings: (settings: unknown) => void;
}

export const useSettingStore = create<SettingStoreType>((set) => ({
  selectedDB: null,
  stickyWindow: {
    width: null,
    height: null,
    interval: 0,
  },
  loadSettings: (settings: SettingType) => set(() => ({ ...settings })),
  changeSelectedDB: (dbName: string) =>
    set((state) => {
      window.ipc.send("settings.changed", { selectedDB: dbName });
      return { selectedDB: dbName };
    }),
}));
