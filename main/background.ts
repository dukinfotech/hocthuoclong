import path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import mainWindowListener from "./listeners/main-window-listener";
import ipcMainListener from "./listeners/ipc-main-listener";
import { WINDOW_DEFAULT_HEIGHT, WINDOW_DEFAULT_WIDTH } from "../renderer/const";

export const isProd = process.env.NODE_ENV === "production";

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
    minWidth: WINDOW_DEFAULT_WIDTH,
    minHeight: WINDOW_DEFAULT_HEIGHT,
    autoHideMenuBar: true,
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

  ipcMainListener(mainWindow, stickyWindow);
  mainWindowListener(mainWindow);
})();

app.on("window-all-closed", () => {
  app.quit();
});

app.setLoginItemSettings({
  openAtLogin: true    
})
