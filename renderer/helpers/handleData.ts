import { DataSetType } from "../components/settings/CreateDBModal";
import * as Excel from "exceljs";

const loadDataToDB = (dataSet: DataSetType) => {
  return new Promise(async (resolve, reject) => {
    const request = window.indexedDB.open(dataSet.name, 1);

    // Define field name
    const fields = [];
    for (let i = 1; i <= dataSet.column; i++) {
      const field = `field${i}`;
      fields.push(field);
    }

    // Get data from excel file
    const data = await readExcelFile(dataSet, fields);

    // Invoked when database version (database schema) is changed
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log("onupgradeneeded")
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      // Create an objectStore for this database
      const objectStore = db.createObjectStore("data", { keyPath: "id" });

      // Index fields
      fields.forEach(field => {
        objectStore.createIndex(field, field, { unique: false });
      });
    };

    request.onsuccess = function (event: any) {
      console.log("onsuccess")
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = function (event: any) {
      console.log("onerror")
      reject(event.target.error);
    };
  });
};

const readExcelFile = async (dataSet: DataSetType, fields: string[]) => {
  const buffer = await readFile(dataSet.file);
  const workbook = new Excel.Workbook();

  const file = await workbook.xlsx.load(buffer as Buffer);

  const worksheet = file.getWorksheet(1);
  const rows = worksheet.getRows(1, dataSet.row);

  const data = [];

  rows.forEach((row, i) => {
    let dataObject = {};
    dataObject["id"] = i + 1;

    fields.forEach((field, j) => {
      dataObject[field] = row.getCell(j + 1).text;
    });

    data.push(dataObject);
  });

  return data;
};

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

export { loadDataToDB };
