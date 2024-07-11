import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";
import { APP_NAME, APP_LOGO } from "../../renderer/const";

export const runInSystemTray = (mainWindow: BrowserWindow) => {
  mainWindow.hide();
  const icon = nativeImage.createFromPath(`resources/${APP_LOGO}`);
  const tray = new Tray(icon);

  const showMainWindow = () => {
    mainWindow.show();
    tray.destroy();
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: "Hiện", type: "normal", click: showMainWindow },
    { label: "Thoát", type: "normal", click: handleQuit },
  ]);

  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    showMainWindow();
  });
};

function handleQuit() {
  if (process.platform !== "darwin") {
    app.quit();
  }
}
