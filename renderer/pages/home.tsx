import React, { useEffect } from "react";
import Head from "next/head";
import { Code, Tab, Tabs } from "@nextui-org/react";
import HomeTab from "../components/HomeTab";
import SettingsTab from "../components/SettingsTab";
import { RiHome2Fill, RiSettings2Fill } from "react-icons/ri";
import { useSettingStore } from "../stores/setting-store";
import { APP_LOGO } from "../const";
import { useGlobalStore } from "../stores/global-store";

export default function HomePage() {
  const loadSettings = useSettingStore((state) => state.loadSettings);
  const { hideSticky } = useGlobalStore();

  useEffect(() => {
    window.ipc.invoke("mainWindow.ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });

    window.ipc.on("stickyWindow.hided", () => {
      hideSticky();
    });
  }, []);

  return (
    <div className="bg-gray-200 h-screen p-10 mx-auto">
      <Head>
        <title>Học Thuộc Lòng v1.0</title>
        <link rel="shortcut icon" href={APP_LOGO} type="image/x-icon" />
      </Head>
      <Tabs aria-label="Options" color="primary" variant="solid">
        <Tab
          key="home"
          title={
            <div className="flex items-center space-x-2">
              <RiHome2Fill />
              <span>Màn Hình Chính</span>
            </div>
          }
        >
          <HomeTab />
        </Tab>
        <Tab
          key="settings"
          title={
            <div className="flex items-center space-x-2">
              <RiSettings2Fill />
              <span>Cài Đặt</span>
            </div>
          }
        >
          <SettingsTab />
        </Tab>
      </Tabs>
      <Code
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        title="Bản quyền phần mềm thuộc về: dukinfotech@gmail.com"
      >
        Developed By Dukinfotech 🍠
      </Code>
    </div>
  );
}
