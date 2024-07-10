import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useDatabase from "../hooks/useDatabase";
import { useSettingStore } from "../stores/setting-store";
import { useMemo } from "react";

export default function DataTable() {
  const selectedDB = useSettingStore((state) => state.selectedDB);
  const data = useDatabase(selectedDB);

  const columnNames = useMemo(() => {
    if (data.length > 0) {
      return Object.keys(data[0]);
    } else {
      return ["default"];
    }
  }, [data]);

  return (
    <Table hideHeader={data.length === 0}>
      <TableHeader>
        {columnNames.map((columnName) => (
          <TableColumn>{columnName}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent="Không có dữ liệu">
        {data.map((dataObject, i) => (
          <TableRow key={i}>
            {columnNames.map((columnName) => (
              <TableCell>{dataObject[columnName]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
