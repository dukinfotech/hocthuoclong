import { BrowserWindow, dialog } from "electron";

export default function mainWindowListener(mainWindow: BrowserWindow) {
  mainWindow.on("close", (e) => {
    const choice = dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["OK", "Cancel"],
      title: "Xác nhận đóng ứng dụng",
      message: "Đừng bỏ cuộc. Hãy nhớ tới lý do khiến bạn bắt đầu!",
    });
    if (choice > 0) {
      e.preventDefault();
    }
  });
}
