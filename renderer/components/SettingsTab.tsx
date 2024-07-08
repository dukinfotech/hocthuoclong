import { Button, Select, SelectItem, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import CreateDBButton from "./settings/CreateDBButton";

export default function SettingsTab() {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

  useEffect(() => {
    listDb();
  }, []);

  const listDb = async () => {
    const dbInfo = await window.indexedDB.databases();
    setDatabases(dbInfo);
  };

  const resetSettings = () => {
    window.ipc.invoke("mainConfig.stickyWindow.reset");
  };

  return (
    <>
      <div className="flex justify-end container">
        <CreateDBButton onSuccess={listDb} databases={databases}/>

        <Spacer y={0.5} />

        <Button
          size="sm"
          color="danger"
          variant="flat"
          isIconOnly
          title="Khôi phục mặc định"
          onClick={resetSettings}
        >
          <MdSettingsSuggest />
        </Button>
      </div>

      <Spacer y={2} />

      <Select size="sm" color="primary" label="Bộ dữ liệu" className="max-w-xs">
        {databases.map((db, i) => (
          <SelectItem key={i}>{db.name}</SelectItem>
        ))}
      </Select>
    </>
  );
}
