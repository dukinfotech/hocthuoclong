import Store from 'electron-store';

const mainConfig = new Store<MainConfigType>({
  name: 'main',
  defaults: {
    mainWindow: {
      isRunInSystemTray: false
    },
    stickyWindow: {
      width: 300,
      height: 28,
      isShow: false
    }
  }
});

export { mainConfig }