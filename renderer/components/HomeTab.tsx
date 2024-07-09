import { Button, Code, Spacer } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useSettingStore } from "../stores/setting-store";

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

  const runInSystemTray = () => {
    window.ipc.send("mainWindow.isRunInSystemTray", true);
  };

  return (
    <>
      <Code>Bộ dữ liệu đang chọn: {selectedDB}</Code>

      <Spacer y={1} />

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
