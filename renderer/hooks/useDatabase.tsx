import { toast } from "react-toastify";

const useDataBase = () => {
  const insertDB = async (
    name: string,
    columnNames: Array<string>,
    data: Array<any>
  ) => {
    try {
      await window.ipc.invoke("database.insert-data", {
        name,
        columnNames,
        data,
      });
      toast.success("Tạo bộ dữ liệu thành công");
    } catch (error) {
      toast.error("Tạo bộ dữ liệu thất bại");
      console.error(error);
    }
  };

  const listDB = async (isWithFileSize: boolean) => {
    try {
      const databaseNames = await window.ipc.invoke("database.list", {
        isWithFileSize: isWithFileSize,
      });
      return databaseNames;
    } catch (error) {
      toast.error("Lấy danh sách bộ dữ liệu thất bại");
      console.error(error);
    }
  };

  const deleteDB = async (dbName: string) => {
    try {
      await window.ipc.invoke("database.delete", { name: dbName });
      toast.success("Xóa bộ dữ liệu thành công");
    } catch (error) {
      toast.error("Xóa bộ dữ liệu thất bại");
      console.error(error);
    }
  };

  const listData = async (dbName: string, keyword: string) => {
    try {
      const data = await window.ipc.invoke("database.list-data", {
        name: dbName,
        keyword,
      });
      toast.success("Load dữ liệu thành công");
      return data;
    } catch (error) {
      toast.error("Load dữ liệu thất bại");
      console.error(error);
    }
  };

  const updateData = async (dbName: string, id: number, field: object) => {
    try {
      await window.ipc.invoke("database.update-data", {
        name: dbName,
        id,
        field,
      });
      toast.success("Cập nhật dữ liệu thành công");
    } catch (error) {
      toast.error("Cập nhật dữ liệu thất bại");
      console.error(error);
    }
  };

  return { listDB, insertDB, deleteDB, listData, updateData };
};

export default useDataBase;
