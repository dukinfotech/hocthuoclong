import { create } from "zustand";

// This type have to be same with "main"
interface SettingType {
  selectedDB: string;
  stickyWindow: {
    width: number;
    height: number;
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
  },
  loadSettings: (settings: SettingType) => set(() => ({ ...settings })),
  changeSelectedDB: (db) =>
    set(() => {
      window.ipc.send("settings.selectedDB", db);
      return { selectedDB: db };
    }),
}));
