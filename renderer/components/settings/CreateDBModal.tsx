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
import readDataFromExcel from "../../helpers/readDataFromExcel";
import { toast } from "react-toastify";
import useDataBase from "../../hooks/useDatabase";
import { DBType } from "../SettingsTab";

export type DataSetType = {
  name: string;
  file: File;
  rowFrom: number;
  rowTo: number;
  columnFrom: number;
  columnTo: number;
  sheetNumber: number;
};

const defaultDataSet: DataSetType = {
  name: "",
  file: null,
  rowFrom: 1,
  rowTo: 1,
  columnFrom: 1,
  columnTo: 1,
  sheetNumber: 1,
};

interface CreateDBModalProps {
  onClose: () => void;
}

export default function CreateDBModal({ onClose }: CreateDBModalProps) {
  const { insertDB, listDB } = useDataBase();
  const [databases, setDatabases] = useState<DBType[]>([]);
  const [dataSet, setDataSet] = useState<DataSetType>(defaultDataSet);

  const isNameExist = useMemo(() => {
    const matchedIndex = databases.findIndex(
      (database) => database.name === dataSet.name
    );
    return matchedIndex >= 0;
  }, [databases, dataSet.name]);

  const isFormValid = useMemo(() => {
    return (
      dataSet.name &&
      !isNameExist &&
      dataSet.file &&
      dataSet.columnFrom >= 1 &&
      dataSet.columnTo >= 1 &&
      dataSet.columnTo >= dataSet.columnFrom &&
      dataSet.rowFrom >= 1 &&
      dataSet.rowTo >= 1 &&
      dataSet.rowTo >= dataSet.rowFrom &&
      dataSet.sheetNumber >= 1
    );
  }, [dataSet]);

  const fetchListDB = async () => {
    const _databases = await listDB(false);
    setDatabases(_databases);
  };

  useEffect(() => {
    fetchListDB();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length > 0) {
      setDataSet({ ...dataSet, file: files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      const { columnNames, data } = await readDataFromExcel(dataSet);
      await insertDB(dataSet.name, columnNames, data);
      fetchListDB();
    } catch (error) {
      toast.error("Đọc file Excel thất bại. Vui lòng kiểm tra lại");
      console.error(error);
    }
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

          <Input
            isRequired
            label="Sheet"
            type="number"
            min={1}
            value={dataSet.sheetNumber.toString()}
            onValueChange={(value) =>
              setDataSet({ ...dataSet, sheetNumber: parseInt(value) })
            }
            variant="flat"
          />

          <div className="flex">
            <Input
              isRequired
              label="Từ Hàng ..."
              type="number"
              min={1}
              value={dataSet.rowFrom.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, rowFrom: parseInt(value) })
              }
              variant="flat"
            />
            <Spacer x={2} />
            <Input
              isRequired
              label="Đến Hàng ..."
              type="number"
              min={1}
              value={dataSet.rowTo.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, rowTo: parseInt(value) })
              }
              variant="flat"
            />
          </div>

          <div className="flex">
            <Input
              isRequired
              label="Từ Cột ..."
              type="number"
              min={1}
              value={dataSet.columnFrom.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, columnFrom: parseInt(value) })
              }
              variant="flat"
            />
            <Spacer x={2} />
            <Input
              isRequired
              label="Đến Cột ..."
              type="number"
              min={1}
              value={dataSet.columnTo.toString()}
              onValueChange={(value) =>
                setDataSet({ ...dataSet, columnTo: parseInt(value) })
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
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
