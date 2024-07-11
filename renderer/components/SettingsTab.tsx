import {
  Button,
  Input,
  Select,
  SelectItem,
  Spacer,
  Switch,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import CreateDBButton from "./settings/CreateDBButton";
import { useConfirmPrompt } from "../providers/ConfirmPromptProvider";
import { useSettingStore } from "../stores/setting-store";
import { useGlobalStore } from "../stores/global-store";
import { PiClockCountdown, PiSplitHorizontal } from "react-icons/pi";
import { BsDatabase, BsTrash3 } from "react-icons/bs";
import { toast } from "react-toastify";
import useDatabase from "../hooks/useDatabase";

export default function SettingsTab() {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
  const {
    selectedDB,
    stickyWindow,
    changeIsBreakLine,
    changeIsRandom,
    changeInterval,
    changeSelectedDB,
    changeSplitedBy,
    resetSettings,
  } = useSettingStore();
  const [selectedDBKey, setSelectedDBKey] = useState(new Set([selectedDB]));
  const { listDB, deleteDB } = useDatabase();

  const { isShowSticky, toggleShowSticky } = useGlobalStore();
  const { show } = useConfirmPrompt();

  const updateListDB = async () => {
    const _listDB = await listDB();
    setDatabases(_listDB);
  };

  useEffect(() => {
    updateListDB();
  }, []);

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

  const handleChangeIsBreakLine = (isBreakLine: boolean) => {
    changeIsBreakLine(isBreakLine);
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
      toast.success("Đã khôi phục cài đặt mặc định");
    }
  };

  const handleChangeSplitedBy = (str: string) => {
    changeSplitedBy(str);
    reloadSticky();
  };

  const handleDeleteDB = async (dbName: string) => {
    const isConfirmed = await show(`Xoá bộ dữ liệu: ${dbName}?`);
    if (isConfirmed) {
      deleteDB(dbName);
      setSelectedDBKey(new Set([]));
      reloadSticky();
      updateListDB();
      toast.success(`Đã xoá bộ dữ liệu: ${dbName}`);
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
              <SelectItem
                key={db.name}
                value={db.name}
                endContent={
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    onPress={() => handleDeleteDB(db.name)}
                  >
                    <BsTrash3 />
                  </Button>
                }
              >
                {db.name}
              </SelectItem>
            ))}
          </Select>
          <Spacer x={1} />
          <CreateDBButton onClose={updateListDB} />
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
          isSelected={stickyWindow.isRandom}
          onValueChange={handleChangeIsRandom}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Xáo trộn các từ</p>
          </div>
        </Switch>

        <Spacer y={2} />

        <Switch
          color="primary"
          size="md"
          isSelected={stickyWindow.isBreakLine}
          onValueChange={handleChangeIsBreakLine}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Xuống dòng mỗi mục</p>
          </div>
        </Switch>

        <Spacer y={2} />

        {!stickyWindow.isBreakLine && (
          <Input
            color="primary"
            startContent={<PiSplitHorizontal />}
            label="Ký tự ngăn cách"
            value={stickyWindow.splitedBy}
            onValueChange={handleChangeSplitedBy}
            variant="flat"
          />
        )}
      </div>
    </>
  );
}
