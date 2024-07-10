import React, { useEffect } from "react";
import Head from "next/head";
import { Code, Tab, Tabs } from "@nextui-org/react";
import HomeTab from "../components/HomeTab";
import SettingsTab from "../components/SettingsTab";
import { RiHome2Fill, RiSettings2Fill } from "react-icons/ri";
import { useSettingStore } from "../stores/setting-store";

export default function HomePage() {
  const loadSettings = useSettingStore((state) => state.loadSettings);

  useEffect(() => {
    window.ipc.invoke("mainWindow.ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });
  }, []);

  return (
    <div className="bg-gray-200 h-screen p-10 mx-auto">
      <Head>
        <title>Học Thuộc Lòng</title>
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
      <Code className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        Developed By Dukinfotech 🍠
      </Code>
    </div>
  );
}
