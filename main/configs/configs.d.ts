import { IpcHandler } from '../main/preload'

declare global {
  interface MainConfigType {
    stickyWindow: {
      width: number,
      height: number
    }
  }
}
