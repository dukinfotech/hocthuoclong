import { BrowserWindow, app } from "electron";

export default function mainWindowListener(mainWindow: BrowserWindow) {
  mainWindow.on("close", app.quit);
}
