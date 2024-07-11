import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useData from "../hooks/useData";
import { useSettingStore } from "../stores/setting-store";
import { useMemo } from "react";

export default function DataTable() {
  const selectedDB = useSettingStore((state) => state.selectedDB);
  const data = useData(selectedDB);

  const columnNames = useMemo(() => {
    if (data.length > 0) {
      return Object.keys(data[0]);
    } else {
      return ["default"];
    }
  }, [data]);

  return (
    <Table
      hideHeader={data.length === 0}
      isHeaderSticky
      classNames={{
        base: "max-h-[50vh] overflow-auto",
      }}
    >
      <TableHeader>
        {columnNames.map((columnName, i) => (
          <TableColumn key={i}>{columnName}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent="Không có dữ liệu">
        {data.map((dataObject, i) => (
          <TableRow key={i}>
            {columnNames.map((columnName, j) => (
              <TableCell key={j}>{dataObject[columnName]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
