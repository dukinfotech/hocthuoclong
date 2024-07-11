import {
  Button,
  Input,
  Select,
  SelectItem,
  Spacer,
  Switch,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import CreateDBButton from "./settings/CreateDBButton";
import { useConfirmPrompt } from "../providers/ConfirmPromptProvider";
import { useSettingStore } from "../stores/setting-store";
import { useGlobalStore } from "../stores/global-store";
import { PiClockCountdown } from "react-icons/pi";
import { BsDatabase } from "react-icons/bs";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

export const getListDB = async () => {
  const dbInfo = await window.indexedDB.databases();
  return dbInfo;
};

export default function SettingsTab() {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
  const {
    selectedDB,
    stickyWindow,
    changeIsRandom,
    changeInterval,
    changeSelectedDB,
    resetSettings,
  } = useSettingStore();
  const [selectedDBKey, setSelectedDBKey] = useState(new Set([selectedDB]));

  const { isShowSticky, toggleShowSticky } = useGlobalStore();
  const { show } = useConfirmPrompt();
  const renderCount = useRef<number>(1);

  const updateListDBSelect = () => {
    getListDB().then((dbInfo) => {
      setDatabases(dbInfo);
    });
  };

  useEffect(() => {
    updateListDBSelect();
  }, []);

  // useEffect(() => {
  //     console.log(selectedDB);
  //     if (selectedDB) {
  //       setSelectedDBKey(new Set([selectedDB]));
  //     }
  // }, [selectedDB]);

  useEffect(() => {
    const value = selectedDBKey.values();
    const dbName = value.next().value as string;

    // Prevent update state on first render
    if (dbName !== selectedDB) {
      changeSelectedDB(dbName || null);
      reloadSticky();
    }
  }, [selectedDBKey]);

  const handleChangeInterval = (value) => {
    changeInterval(parseInt(value) || 1);
    reloadSticky();
  };

  const handleChangeIsRandom = (isSelected: boolean) => {
    changeIsRandom(isSelected);
    reloadSticky();
  };

  const reloadSticky = () => {
    if (isShowSticky) {
      toggleShowSticky();
      toggleShowSticky();
    }
  };

  const handleRestoreFactory = async () => {
    const isConfirmed = await show("Bạn có muốn khôi phục mặc định?");
    if (isConfirmed) {
      resetSettings();
      setSelectedDBKey(new Set([]));
      reloadSticky();
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
          onClick={handleRestoreFactory}
        >
          <MdSettingsSuggest />
        </Button>
      </div>

      <Spacer y={2} />

      <div className="flex flex-col mx-auto max-w-[50%]">
        <div className="flex justify-center">
          <Select
            startContent={<BsDatabase />}
            size="sm"
            color="primary"
            label="Bộ dữ liệu"
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

        <Spacer y={2} />

        <Input
          isRequired
          color="primary"
          startContent={<PiClockCountdown />}
          label="Thời gian trễ mỗi từ (giây)"
          type="number"
          min={1}
          value={Math.floor(stickyWindow.interval / 1000).toString()}
          onValueChange={handleChangeInterval}
          variant="flat"
        />

        <Spacer y={2} />

        <Switch
          color="primary"
          size="md"
          value={String(stickyWindow.isRandom)}
          onValueChange={handleChangeIsRandom}
          thumbIcon={<GiPerspectiveDiceSixFacesRandom />}
        >
          Random các từ
        </Switch>
      </div>
    </>
  );
}
