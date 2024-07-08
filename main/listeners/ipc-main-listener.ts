import { BrowserWindow, ipcMain, screen } from "electron";
import { createWindow, runInSystemTray } from "../helpers";
import { mainConfig } from "../configs";
import path from "path";
import { isProd } from "../background";

export default function ipcMainListener(
  mainWindow: BrowserWindow,
  stickyWindow: BrowserWindow
) {
  ipcMain.on("mainConfig.mainWindow.isRunInSystemTray", async () => {
    runInSystemTray(mainWindow);
  });

  ipcMain.handle("mainConfig.stickyWindow.isShow", async (event, arg) => {
    if (arg) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      const windowWith = mainConfig.get("stickyWindow.width") as number;
      const windowHeight = mainConfig.get("stickyWindow.height") as number;

      stickyWindow = createWindow("sticky", {
        width: windowWith,
        height: windowHeight,
        x: width - windowWith,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        focusable: false, //THIS IS THE KEY
        closable: true,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        },
      });

      if (isProd) {
        await stickyWindow.loadURL("app://./sticky");
      } else {
        const port = process.argv[2];
        await stickyWindow.loadURL(`http://localhost:${port}/sticky`);
      }
    } else {
      stickyWindow.close();
    }

    return arg;
  });
}
