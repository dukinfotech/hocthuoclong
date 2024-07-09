import { Button, Select, SelectItem, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import CreateDBButton from "./settings/CreateDBButton";
import { useConfirmPrompt } from "../providers/ConfirmPromptProvider";
import { useSettingStore } from "../stores/setting-store";

export const getListDB = async () => {
  const dbInfo = await window.indexedDB.databases();
  return dbInfo;
};

export default function SettingsTab() {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
  const selectedDB = useSettingStore((state) => state.selectedDB);
  const [selectedDBKey, setSelectedDBKey] = useState(new Set([selectedDB]));
  
  const changeSelectedDB = useSettingStore((state) => state.changeSelectedDB);

  const { show } = useConfirmPrompt();

  const updateListDBSelect = () => {
    getListDB().then((dbInfo) => {
      setDatabases(dbInfo);
    });
  };

  useEffect(() => {
    updateListDBSelect();
  }, []);

  useEffect(() => {
    const value = selectedDBKey.values();
    const dbName = value.next().value;
    
    // Prevent update state on first render
    if (dbName !== null) {
      changeSelectedDB(dbName);
    }

  }, [selectedDBKey]);

  const resetSettings = async () => {
    const isConfirmed = await show("Bạn có muốn khôi phục mặc định?");
    if (isConfirmed) {
      window.ipc.invoke("stickyWindow.reset");
    }
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
          selectedKeys={selectedDBKey}
          onSelectionChange={(e: any) => setSelectedDBKey(e)}
        >
          {databases.map((db, i) => (
            <SelectItem key={db.name} value={db.name}>
              {db.name}
            </SelectItem>
          ))}
        </Select>
        <Spacer x={1} />
        <CreateDBButton onClose={updateListDBSelect} />
      </div>
    </>
  );
}
