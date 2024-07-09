import { Button, Select, SelectItem, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import CreateDBButton from "./settings/CreateDBButton";

export const getListDB = async () => {
  const dbInfo = await window.indexedDB.databases();
  return dbInfo;
};

export default function SettingsTab() {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

  const updateListDBSelect = () => {
    getListDB().then((dbInfo) => {
      setDatabases(dbInfo);
    });
  };

  useEffect(() => {
    updateListDBSelect();
  }, []);

  const resetSettings = () => {
    window.ipc.invoke("mainConfig.stickyWindow.reset");
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          size="sm"
          color="danger"
          isIconOnly
          title="Khôi phục mặc định"
          onClick={resetSettings}
        >
          <MdSettingsSuggest />
        </Button>
      </div>

      <Spacer y={2} />
      <div className="flex justify-center">
        <Select
          size="sm"
          color="primary"
          label="Bộ dữ liệu"
          className="max-w-xs"
        >
          {databases.map((db, i) => (
            <SelectItem key={i}>{db.name}</SelectItem>
          ))}
        </Select>
        <Spacer x={1} />
        <CreateDBButton onClose={updateListDBSelect} />
      </div>
    </>
  );
}
