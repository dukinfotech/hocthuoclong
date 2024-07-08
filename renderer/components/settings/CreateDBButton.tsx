import { Button } from "@nextui-org/react";
import { useState } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import Prompt from "../Prompt";

interface CreateDBButtonProps {
  databases: IDBDatabaseInfo[];
  onSuccess: () => void;
}

export default function CreateDBButton({
  databases,
  onSuccess,
}: CreateDBButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isShowPrompt, setIsShowPrompt] = useState<boolean>(false);

  const handleCreateDb = (dbName: string) => {
    const matchedIndex = databases.findIndex((db) => db.name === dbName);
    if (matchedIndex >= 0) {
      setErrorMessage("Tên bộ dữ liệu đã tồn tại");
      return;
    }

    setIsShowPrompt(false);
    const request = window.indexedDB.open(dbName);

    request.onsuccess = (e) => {
      onSuccess();
    };
  };

  const handleClose = () => {
    setErrorMessage(undefined);
    setIsShowPrompt(false);
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        isIconOnly
        title="Tạo bộ dữ liệu mới"
        onClick={() => setIsShowPrompt(true)}
      >
        <BsDatabaseAdd />
      </Button>

      {isShowPrompt && (
        <Prompt
          label="Nhập tên bộ dữ liệu"
          isInvalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          onPressOK={handleCreateDb}
          onClose={handleClose}
        />
      )}
    </>
  );
}
