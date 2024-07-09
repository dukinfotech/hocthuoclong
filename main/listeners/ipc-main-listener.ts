import { BrowserWindow, ipcMain, screen } from "electron";
import { createWindow, runInSystemTray } from "../helpers";
import { settings } from "../stores/settings";
import path from "path";
import { isProd } from "../background";

export default function ipcMainListener(
  mainWindow: BrowserWindow,
  stickyWindow: BrowserWindow
) {
  ipcMain.on("settings.mainWindow.isRunInSystemTray", async () => {
    runInSystemTray(mainWindow);
  });

  ipcMain.handle("settings.stickyWindow.isShow", async (event, arg) => {
    if (arg) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      const windowWith = settings.get("stickyWindow.width") as number;
      const windowHeight = settings.get("stickyWindow.height") as number;

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

  ipcMain.handle("settings.stickyWindow.reset", () => {
    settings.clear();
    if (stickyWindow) {
      stickyWindow.reload();
    }
  });

  ipcMain.on("settings.selectedDB", (e, selectedDB) => {
    settings.set("selectedDB", selectedDB)
  });
}
