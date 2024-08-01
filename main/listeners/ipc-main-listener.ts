import { BrowserWindow, ipcMain } from "electron";
import { createWindow, runInSystemTray } from "../helpers";
import { settings } from "../stores/settings";
import path from "path";
import { isProd } from "../background";
import stickyWindowListener from "./sticky-window-listener";
import {
  deleteDB,
  insertDB,
  listDB,
  listData,
  updateData,
  selectData,
} from "../helpers/database";

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
      const windowWith = settings.get("stickyWindow.width") as number;
      const windowHeight = settings.get("stickyWindow.height") as number;

      stickyWindow = createWindow("sticky", {
        width: windowWith,
        height: windowHeight,
        x: 0,
        y: 0,
        frame: false,
        alwaysOnTop: true,
        fullscreenable: false,
        maximizable: false,
        minimizable: false,
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

      stickyWindowListener(mainWindow, stickyWindow);
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

  ipcMain.handle("database.insert-data", (event, arg) => {
    insertDB(arg.name, arg.columnNames, arg.data);
  });

  ipcMain.handle("database.list", (event, arg) => {
    return listDB(arg.isWithFileSize);
  });

  ipcMain.handle("database.delete", (event, arg) => {
    deleteDB(arg.name);
  });

  ipcMain.handle("database.list-data", (event, arg) => {
    const data = listData(arg.name, arg.keyword);
    return data;
  });

  ipcMain.handle("database.update-data", (event, arg) => {
    updateData(arg.name, arg.id, arg.field);
  });

  ipcMain.handle("database.select-data", (event, arg) => {
    const data = selectData(arg.name);
    return data;
  });
}
