import { Button, Code, Spacer } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import { RiSettings2Fill } from "react-icons/ri";
import DataTable from "./DataTable";
import { getListDB } from "./SettingsTab";
import { useGlobalStore } from "../stores/global-store";

export default function HomeTab() {
  const { isShowSticky, toggleShowSticky } = useGlobalStore();
  const selectedDB = useSettingStore((state) => state.selectedDB);

  useEffect(() => {
    if (selectedDB) {
      getListDB();
    }
  }, [selectedDB]);

  const runInSystemTray = () => {
    window.ipc.send("mainWindow.isRunInSystemTray", true);
  };

  return (
    <>
      <Code color="secondary">
        {selectedDB ? (
          `Bộ dữ liệu đang chọn: ${selectedDB}`
        ) : (
          <>
            Chưa chọn bộ dữ liệu. Bấm "<RiSettings2Fill className="inline" />{" "}
            Cài Đặt" để thiết lập
          </>
        )}
      </Code>

      <Spacer y={3} />

      {selectedDB && <DataTable />}

      <Spacer y={3} />

      <div className="flex justify-center">
        <Button color="success" onClick={runInSystemTray}>
          Chạy ẩn dưới khay hệ thống
        </Button>

        <Spacer x={1} />

        <Button color="primary" onClick={toggleShowSticky}>
          {isShowSticky ? "Ẩn Sticky" : "Hiện Sticky"}
        </Button>
      </div>
    </>
  );
}
