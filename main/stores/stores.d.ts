import { IpcHandler } from "../main/preload";

declare global {
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
}
