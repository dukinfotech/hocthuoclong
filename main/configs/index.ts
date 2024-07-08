import Store from 'electron-store';

const mainConfig = new Store<MainConfigType>({
  name: 'main',
  defaults: {
    stickyWindow: {
      width: 300,
      height: 28
    }
  },
  watch: true
});

export { mainConfig }