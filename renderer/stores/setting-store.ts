import { create } from "zustand";

// This type have to be same with "main"
interface SettingType {
  selectedDB: string;
  stickyWindow: {
    width: number;
    height: number;
    fontSize: number;
    interval: number;
    isRandom: boolean;
    isBreakLine: boolean;
    splitedBy: string;
  };
}

interface SettingStoreType extends SettingType {
  changeSelectedDB: (db: string) => void;
  loadSettings: (settings: unknown) => void;
  resetSettings: () => void;
  changeFontSize: (size: number) => void;
  changeInterval: (seconds: number) => void;
  changeIsRandom: (isRandom: boolean) => void;
  changeIsBreakLine: (isBreakLine: boolean) => void;
  changeSplitedBy: (str: string) => void;
}

export const useSettingStore = create<SettingStoreType>((set) => ({
  selectedDB: "",
  stickyWindow: {
    width: null,
    height: null,
    fontSize: 0,
    interval: 0,
    isRandom: false,
    isBreakLine: false,
    splitedBy: "🍠",
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
  changeFontSize: (size: number) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: {
          ...state.stickyWindow,
          fontSize: size,
        },
      });
      return {
        stickyWindow: {
          ...state.stickyWindow,
          fontSize: size,
        },
      };
    }),
  changeInterval: (seconds: number) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: {
          ...state.stickyWindow,
          interval: (seconds || 1) * 1000,
        },
      });
      return {
        stickyWindow: {
          ...state.stickyWindow,
          interval: (seconds || 1) * 1000,
        },
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
  changeIsBreakLine: (isBreakLine: boolean) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: { ...state.stickyWindow, isBreakLine: isBreakLine },
      });
      return {
        stickyWindow: { ...state.stickyWindow, isBreakLine: isBreakLine },
      };
    }),
  changeSplitedBy: (str: string) =>
    set((state) => {
      window.ipc.send("settings.changed", {
        stickyWindow: { ...state.stickyWindow, splitedBy: str },
      });
      return {
        stickyWindow: { ...state.stickyWindow, splitedBy: str },
      };
    }),
}));
