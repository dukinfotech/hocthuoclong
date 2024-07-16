import {
  Checkbox,
  Input,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useData from "../hooks/useData";
import { useSettingStore } from "../stores/setting-store";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { REMEMBER_FIELD } from "../const";
import { textContentFromHTML } from "../helpers/utils";

type ColumnNameType = {
  key: string;
  name: string | null;
};

export default function DataTable() {
  const selectedDB = useSettingStore((state) => state.selectedDB);
  const { data, update } = useData(selectedDB);
  const [keyword, setKeyword] = useState<string>("");

  const columnNames = useMemo(() => {
    if (data.length > 0) {
      let _columnNames: ColumnNameType[] = [];
      const firstDataObject = data[0];

      Object.keys(firstDataObject).map((key) => {
        let columnName: ColumnNameType = {
          key,
          name: null,
        };
        _columnNames.push(columnName);
      });

      // Convert to Vietnamese names
      _columnNames.map((_columnName, i) => {
        switch (i) {
          case 0:
            _columnName.name = "ID";
            break;
          case 1:
            _columnName.name = "Đã thuộc";
            break;
          default:
            _columnName.name = `Cột ${i - 1}`;
            break;
        }
        return _columnName;
      });
      return _columnNames;
    } else {
      return [{ key: "default", name: null }];
    }
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((dataObject) => {
      let isMatched = true;
      if (keyword) {
        const values = Object.values(dataObject);
        for (let i = 0; i < values.length; i++) {
          if (i > 1) {
            const value = values[i];
            const plainText = textContentFromHTML(value.toString());
            isMatched = plainText.includes(keyword);
          }
        }
      }
      return isMatched;
    });
  }, [data, keyword]);

  const toggleRemember = (key: string, e: any) => {
    console.log(key);
    update(key, REMEMBER_FIELD, e.target.checked.toString());
  };

  return (
    <>
      <Input
        onChange={(e) => setKeyword(e.target.value)}
        onClear={() => setKeyword("")}
        color="primary"
        placeholder="Tìm kiếm"
        className="max-w-[220px]"
        isClearable
      />
      <Spacer y={2} />
      <Table
        hideHeader={data.length === 0}
        isHeaderSticky
        classNames={{
          base: "max-h-[50vh] overflow-auto",
        }}
      >
        <TableHeader>
          {columnNames.map((columnName) => (
            <TableColumn key={columnName.key}>{columnName.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu">
          {filteredData.map((dataObject, i) => (
            <TableRow key={i}>
              {columnNames.map((columnName) => (
                <TableCell key={columnName.key}>
                  {columnName.key !== REMEMBER_FIELD ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: dataObject[columnName.key],
                      }}
                    ></span>
                  ) : (
                    <Checkbox
                      defaultSelected={dataObject[columnName.key] === "true"}
                      onChange={(e) => toggleRemember(dataObject["id"], e)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
