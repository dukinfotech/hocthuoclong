import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spacer,
} from "@nextui-org/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { getListDB } from "../SettingsTab";
import { loadDataToDB } from "../../helpers/handleData";
import { toast } from "react-toastify";

export type DataSetType = {
  name: string;
  file: File;
  column: number;
  row: number;
};

interface CreateDBModalProps {
  onClose: () => void;
}

export default function CreateDBModal({ onClose }: CreateDBModalProps) {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
  const [dataSet, setDataSet] = useState<DataSetType>({
    name: "",
    file: null,
    column: 1,
    row: 1,
  });

  const isNameExist = useMemo(() => {
    const matchedIndex = databases.findIndex((db) => db.name === dataSet.name);
    return matchedIndex >= 0;
  }, [databases, dataSet.name]);

  const isFormValid = useMemo(() => {
    return (
      dataSet.name &&
      !isNameExist &&
      dataSet.file &&
      dataSet.column >= 1 &&
      dataSet.row >= 1
    );
  }, [dataSet]);

  useEffect(() => {
    getListDB().then((dbInfo) => setDatabases(dbInfo));
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length > 0) {
      setDataSet({ ...dataSet, file: files[0] });
    }
  };

  const handleSubmit = async () => {
    await loadDataToDB(dataSet);
    toast.success("Tạo dữ liệu thành công");
    onClose();
  };

  return (
    <Modal
      size="md"
      placement="center"
      isDismissable={false}
      isOpen
      onClose={onClose}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className="pt-5 pb-5">
          <Input
            label="Tên bộ dữ liệu"
            isInvalid={isNameExist}
            errorMessage="Tên bộ dữ liệu đã tồn tại"
            isRequired
            isClearable
            variant="flat"
            value={dataSet.name}
            onValueChange={(value) => setDataSet({ ...dataSet, name: value })}
          />

          <Input
            label="File excel dữ liệu"
            isRequired
            type="file"
            accept=".xlsx,.xls"
            variant="flat"
            onChange={(e) => handleFileChange(e)}
          />

          <div className="flex">
            <Input
              isRequired
              label="Số cột dữ liệu"
              type="number"
              min={1}
              value={dataSet.column.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, column: parseInt(value) })
              }
              variant="flat"
            />
            <Spacer x={2} />
            <Input
              isRequired
              label="Số hàng dữ liệu"
              type="number"
              min={1}
              value={dataSet.row.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, row: parseInt(value) })
              }
              variant="flat"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid}
          >
            Tạo bộ dữ liệu
          </Button>
          <Button size="sm" color="danger" onPress={onClose}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
