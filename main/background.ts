import path from "path";
import { app, BrowserWindow, ipcMain, screen } from "electron";
import serve from "electron-serve";
import { createWindow, runInSystemTray } from "./helpers";
import { mainConfig } from "./configs";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow: BrowserWindow;
let stickyWindow: BrowserWindow;

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", app.quit);
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("mainConfig.mainWindow.isRunInSystemTray", async (event, arg) => {
  mainWindow.hide();
  runInSystemTray(() => {
    mainWindow.show();
  });
});

ipcMain.handle("mainConfig.stickyWindow.isShow", async (event, arg) => {
  if (arg) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const windowWith = mainConfig.get('stickyWindow.width') as number;
    const windowHeight = mainConfig.get('stickyWindow.height') as number;

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
