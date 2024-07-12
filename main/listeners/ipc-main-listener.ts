import { BrowserWindow, ipcMain, screen } from "electron";
import { createWindow, runInSystemTray } from "../helpers";
import { settings } from "../stores/settings";
import path from "path";
import { isProd } from "../background";

export default function ipcMainListener(
  mainWindow: BrowserWindow,
  stickyWindow: BrowserWindow
) {
  ipcMain.handle("mainWindow.ready", async (event, arg) => {
    // Load user's settings from disk to global state
    mainWindow.webContents.send("setting.load", settings.store);
  });

  ipcMain.handle("stickyWindow.ready", (event, arg) => {
    console.log("stickyWindow.ready");

    // Load user's settings from disk to global state
    stickyWindow.webContents.send("setting.load", settings.store);
  });

  ipcMain.on("mainWindow.isRunInSystemTray", async () => {
    runInSystemTray(mainWindow);
  });

  ipcMain.on("stickyWindow.isShow", async (event, arg) => {
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
        resizable: true,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        },
      });

      if (isProd) {
        await stickyWindow.loadURL("app://./sticky");
      } else {
        const port = process.argv[2];
        await stickyWindow.loadURL(`http://localhost:${port}/sticky`);
        stickyWindow.webContents.openDevTools();
      }
    } else {
      stickyWindow.close();
    }

    return arg;
  });

  ipcMain.handle("stickyWindow.resize", (event, size) => {
    stickyWindow.setSize(size.width, size.height, true);
  });

  ipcMain.handle("settings.reset", () => {
    settings.clear();
    return settings.store;
  });

  ipcMain.on("settings.changed", (e, changedSettings) => {
    Object.keys(changedSettings).map((key) => {
      settings.set(key, changedSettings[key]);
    });
  });
}
