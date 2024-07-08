import { Button } from "@nextui-org/react";
import { MdSettingsSuggest } from "react-icons/md";

export default function SettingsTab() {
  const resetSettings = () => {
    window.ipc.invoke("mainConfig.stickyWindow.reset");
  };

  return (
    <>
      <div className="float-right">
        <Button
          color="danger"
          variant="flat"
          isIconOnly
          title="Khôi phục mặc định"
          onClick={resetSettings}
        >
          <MdSettingsSuggest />
        </Button>
      </div>
    </>
  );
}
