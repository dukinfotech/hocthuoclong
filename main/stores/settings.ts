import Store from "electron-store";

let isProd = process.env.NODE_ENV === "production";

const settings = new Store<SettingType>({
  name: "settings",
  defaults: {
    selectedDB: "",
    stickyWindow: {
      width: isProd ? 300 : 800,
      height: isProd ? 28 : 600,
      interval: 5000,
      isRandom: false,
      splitedBy: "🍠",
    },
  },
  watch: true,
});

export { settings };
