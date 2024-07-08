import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

export default function HomeTab() {
  const [showSticky, setShowSticky] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFirstRender = useRef<boolean>(true)

  useEffect(() => {
    window.ipc.on('mainConfig.stickyWindow.isRendering', (arg: boolean) => {
      setIsLoading(arg)
    })
  }, [])

  useEffect(() => {
    if (!isFirstRender.current) {
      window.ipc.send('mainConfig.stickyWindow.isShow', showSticky);
    } else {
      isFirstRender.current = false
    }
  }, [showSticky])

  const runInSystemTray = () => {
    window.ipc.send('mainConfig.mainWindow.isRunInSystemTray', true);
  }

  return (
    <>
      <div>
        <Button color="success" onClick={runInSystemTray}>Chạy ẩn dưới khay hệ thống</Button>
      </div>
      <div>
        <Button color="primary" onClick={() => setShowSticky(!showSticky)} isLoading={isLoading}>
          {showSticky && !isLoading ? 'Ẩn Sticky' : 'Hiện Sticky'}
        </Button>
      </div>
    </>
  );
}