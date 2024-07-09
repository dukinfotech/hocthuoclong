import { Button } from "@nextui-org/react";
import { useState } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import CreateDBModal from "./CreateDBModal";

export default function CreateDBButton() {
  const [isShowCreateDBModal, setIsShowCreateDBModal] =
    useState<boolean>(false);

  return (
    <>
      <Button
        size="lg"
        color="success"
        variant="flat"
        isIconOnly
        title="Tạo bộ dữ liệu mới"
        onClick={() => setIsShowCreateDBModal(true)}
      >
        <BsDatabaseAdd />
      </Button>

      {isShowCreateDBModal && (
        <CreateDBModal onClose={() => setIsShowCreateDBModal(false)} />
      )}
    </>
  );
}
