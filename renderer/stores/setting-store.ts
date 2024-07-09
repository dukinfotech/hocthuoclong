import { create } from "zustand";

type SettingStoreType = {
  selectedDB: string;
  changeSelectedDB: (db: string) => void;
};

export const useSettingStore = create<SettingStoreType>((set) => ({
  selectedDB: null,
  changeSelectedDB: (db) =>
    set((state) => {
      window.ipc.send("settings.selectedDB", db);
      return { selectedDB: db };
    }),
}));
