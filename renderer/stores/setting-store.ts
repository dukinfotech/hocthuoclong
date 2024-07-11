import { create } from "zustand";

// This type have to be same with "main"
interface SettingType {
  selectedDB: string;
  stickyWindow: {
    width: number;
    height: number;
    interval: number;
    isRandom: boolean;
  };
}

interface SettingStoreType extends SettingType {
  changeSelectedDB: (db: string) => void;
  loadSettings: (settings: unknown) => void;
  resetSettings: () => void;
  changeInterval: (seconds: number) => void;
  changeIsRandom: (isRandom: boolean) => void;
}

export const useSettingStore = create<SettingStoreType>((set) => ({
  selectedDB: "",
  stickyWindow: {
    width: null,
    height: null,
    interval: 0,
    isRandom: false,
  },
  loadSettings: (settings: SettingType) => set(() => ({ ...settings })),
  resetSettings: async () => {
    const settings = await window.ipc.invoke("settings.reset");
    return set(() => ({ ...settings }));
  },
  changeSelectedDB: (dbName: string) =>
    set((state) => {
      window.ipc.send("settings.changed", { selectedDB: dbName });
      return { selectedDB: dbName };
    }),
  changeInterval: (seconds: number) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: { ...state.stickyWindow, interval: seconds * 1000 },
      });
      return {
        stickyWindow: { ...state.stickyWindow, interval: seconds * 1000 },
      };
    }),
  changeIsRandom: (isRandom: boolean) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: { ...state.stickyWindow, isRandom: isRandom },
      });
      return {
        stickyWindow: { ...state.stickyWindow, isRandom: isRandom },
      };
    }),
}));
