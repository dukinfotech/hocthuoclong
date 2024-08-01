import {
  Button,
  Checkbox,
  Input,
  Spacer,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useSettingStore } from "../stores/setting-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { SHOWN_COLUMNS } from "../const";
import { useGlobalStore } from "../stores/global-store";
import useDataBase from "../hooks/useDatabase";
import { BsSearch } from "react-icons/bs";

type ColumnNameType = {
  key: string;
  name: string | null;
};

export default function DataTable() {
  const { selectedDB } = useSettingStore();
  const { isShowSticky, toggleShowSticky } = useGlobalStore();
  const [data, setData] = useState<Array<any>>([]);
  const { listData, updateData } = useDataBase();
  const [keyword, setKeyword] = useState<string>("");
  const keywordRef = useRef<HTMLInputElement>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columnNames = useMemo(() => {
    if (data.length > 0) {
      let _columnNames: ColumnNameType[] = [];
      const firstRow = data[0];

      Object.keys(firstRow).map((key) => {
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
            _columnName.name = "Đã Thuộc";
            break;
          case _columnNames.length - 1:
            _columnName.name = "Ngày Tạo";
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const _data = await listData(selectedDB, keyword);
      console.log(_data);
      setData(_data);
      setIsLoading(false);
    })();
  }, [keyword]);

  const toggleRemember = (id: number, e: any) => {
    const isRemember = e.target.checked ? 1 : 0;
    updateData(selectedDB, id, { isRemember });
  };

  const handleToggleShowInSticky = (i: number, isShow: boolean) => {
    let shownColumns: number[] =
      JSON.parse(localStorage.getItem(SHOWN_COLUMNS)) || [];
    if (isShow) {
      if (!shownColumns.includes(i)) {
        shownColumns.push(i);
      }
    } else {
      if (shownColumns.includes(i)) {
        shownColumns = shownColumns.filter((shownColumn) => shownColumn !== i);
      }
    }
    localStorage.setItem(SHOWN_COLUMNS, JSON.stringify(shownColumns));
    reloadSticky();
  };

  const reloadSticky = () => {
    if (isShowSticky) {
      toggleShowSticky();
      toggleShowSticky();
    }
  };

  const handleChangeKeyword = () => {
    const _keyword = keywordRef.current.value;
    setKeyword(_keyword);
  };

  return (
    <>
      <div className="flex">
        <Input
          ref={keywordRef}
          color="primary"
          placeholder="Nhập từ khóa"
          className="max-w-[220px]"
          isClearable
        />
        <Spacer y={2} />
        <Button isIconOnly color="primary" onPress={handleChangeKeyword}>
          <BsSearch />
        </Button>
      </div>
      <Spacer y={2} />
      <Table
        hideHeader={data.length === 0}
        isHeaderSticky
        classNames={{
          base: "max-h-[50vh] overflow-auto",
        }}
      >
        <TableHeader>
          {columnNames.map((columnName, i) => (
            <TableColumn key={columnName.key}>
              <>
                {columnName.name}
                {i > 1 && i < columnNames.length - 1 && (
                  <Checkbox
                    key={i}
                    className="ml-1"
                    title="Hiển thị trên sticky"
                    defaultSelected
                    onChange={(e) =>
                      handleToggleShowInSticky(i - 1, e.target.checked)
                    }
                  />
                )}
              </>
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent="Không có dữ liệu"
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {data.map((dataObject, i) => (
            <TableRow key={i}>
              {columnNames.map((columnName) => (
                <TableCell key={columnName.key}>
                  {columnName.key !== "isRemember" ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: dataObject[columnName.key],
                      }}
                    ></span>
                  ) : (
                    <Checkbox
                      defaultSelected={dataObject[columnName.key] === 1}
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
