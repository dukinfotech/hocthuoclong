import { IpcHandler } from "../main/preload";

declare global {
  interface SettingType {
    selectedDB: string;
    stickyWindow: {
      width: number;
      height: number;
      interval: number;
      isRandom: boolean;
      splitedBy: string;
    };
  }
}
