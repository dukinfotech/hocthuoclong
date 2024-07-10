import React from "react";
import Head from "next/head";
import { Code, Tab, Tabs } from "@nextui-org/react";
import HomeTab from "../components/HomeTab";
import SettingsTab from "../components/SettingsTab";
import { RiHome2Fill, RiSettings2Fill } from "react-icons/ri";

export default function HomePage() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
