import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";
import { APP_NAME, APP_LOGO } from "../../renderer/const";

export const runInSystemTray = (mainWindow: BrowserWindow) => {
  mainWindow.hide();
  const icon = nativeImage.createFromPath(`resources/${APP_LOGO}`);
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Hiện", type: "normal", click: mainWindow.show },
    { label: "Thoát", type: "normal", click: handleQuit },
  ]);

  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    mainWindow.show();
    tray.destroy();
  });
};

function handleQuit() {
  if (process.platform !== "darwin") {
    app.quit();
  }
}
