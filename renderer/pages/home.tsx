import React from "react";
import Head from "next/head";
import { Tab, Tabs } from "@nextui-org/react";
import HomeTab from "../components/HomeTab";
import SettingsTab from "../components/SettingsTab";
import { RiHome2Fill, RiSettings2Fill } from "react-icons/ri";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Học thuộc lòng</title>
      </Head>
      <Tabs aria-label="Options" color="primary" variant="solid">
        <Tab
          key="home"
          title={
            <div className="flex items-center space-x-2">
              <RiHome2Fill />
              <span>Màn hình chính</span>
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
              <span>Cài đặt</span>
            </div>
          }
        >
          <SettingsTab />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
}
