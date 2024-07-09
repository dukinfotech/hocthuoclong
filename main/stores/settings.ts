import Store from "electron-store";

const settings = new Store<SettingType>({
  name: "settings",
  defaults: {
    selectedDB: null,
    stickyWindow: {
      width: 300,
      height: 28,
    },
  },
  watch: true,
});

export { settings };
