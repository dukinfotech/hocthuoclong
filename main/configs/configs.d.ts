import { IpcHandler } from "../main/preload";

declare global {
  interface MainConfigType {
    selectedDB: string;
    stickyWindow: {
      width: number;
      height: number;
    };
  }
}
