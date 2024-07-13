import Store from "electron-store";
import {
  STICKY_WINDOW_DEFAULT_FONTSIZE,
  STICKY_WINDOW_DEFAULT_HEIGHT,
  STICKY_WINDOW_DEFAULT_WIDTH,
  WINDOW_DEFAULT_HEIGHT,
  WINDOW_DEFAULT_WIDTH,
} from "../../renderer/const";

let isProd = process.env.NODE_ENV === "production";

const settings = new Store<SettingType>({
  name: "settings",
  defaults: {
    selectedDB: "",
    stickyWindow: {
      width: isProd ? STICKY_WINDOW_DEFAULT_WIDTH : WINDOW_DEFAULT_WIDTH,
      height: isProd ? STICKY_WINDOW_DEFAULT_HEIGHT : WINDOW_DEFAULT_HEIGHT,
      fontSize: STICKY_WINDOW_DEFAULT_FONTSIZE,
      interval: 5000,
      isRandom: false,
      isBreakLine: false,
      splitedBy: "🍠",
    },
  },
  watch: true,
});

export { settings };
