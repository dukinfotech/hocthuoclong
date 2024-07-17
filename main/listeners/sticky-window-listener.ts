import { BrowserWindow } from "electron";

export default function stickyWindowListener(
  mainWindow: BrowserWindow,
  stickyWindow: BrowserWindow
) {
  stickyWindow.on("minimize", () => {
    mainWindow.webContents.send("stickyWindow.hided");
  });
  stickyWindow.on("close", () => {
    mainWindow.webContents.send("stickyWindow.hided");
  });
  mainWindow.on("close", () => {
    stickyWindow.close();
  });
}
