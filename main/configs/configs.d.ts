import { IpcHandler } from '../main/preload'

declare global {
  interface MainConfigType {
    mainWindow: {
      isRunInSystemTray: boolean
    },
    stickyWindow: {
      width: number,
      height: number,
      isShow: boolean
    }
  }
}
