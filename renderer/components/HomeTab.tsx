import { Button, Code, Spacer } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";
import { RiSettings2Fill } from "react-icons/ri";
import DataTable from "./DataTable";
import { getListDB } from "./SettingsTab";

export default function HomeTab() {
  const [showSticky, setShowSticky] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedDB = useSettingStore((state) => state.selectedDB);

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      setIsLoading(true);
      window.ipc
        .invoke("stickyWindow.isShow", showSticky)
        .then(() => setIsLoading(false));
    } else {
      isFirstRender.current = false;
    }
  }, [showSticky]);

  useEffect(() => {
    if (selectedDB) {
      getListDB();
    }
  }, [selectedDB])

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

      <DataTable />

      <Spacer y={3} />

      <div className="flex justify-center">
        <Button color="success" onClick={runInSystemTray}>
          Chạy ẩn dưới khay hệ thống
        </Button>

        <Spacer x={1} />

        <Button
          color="primary"
          onClick={() => setShowSticky(!showSticky)}
          isLoading={isLoading}
        >
          {showSticky && !isLoading ? "Ẩn Sticky" : "Hiện Sticky"}
        </Button>
      </div>
    </>
  );
}
