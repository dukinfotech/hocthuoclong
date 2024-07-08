import Store from 'electron-store';

const mainConfig = new Store<MainConfigType>({
  defaults: {
    mainWindow: {
      isRunInSystemTray: false
    },
    stickyWindow: {
      isShow: false
    }
  }
});

export { mainConfig }