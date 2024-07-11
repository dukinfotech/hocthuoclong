import { DataSetType } from "../components/settings/CreateDBModal";
import * as Excel from "exceljs";
import { DATA_OBJECT_STORE_NAME, REMEMBER_FIELD } from "../const";

const loadDataToDB = (dataSet: DataSetType) => {
  return new Promise(async (resolve, reject) => {
    const request = window.indexedDB.open(dataSet.name);

    // Define field name
    const fields = [REMEMBER_FIELD];
    for (let i = 1; i <= dataSet.column; i++) {
      const field = `field${i}`;
      fields.push(field);
    }

    // Invoked when database version (database schema) is changed
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log("onupgradeneeded");
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      // Create an objectStore for this database
      const objectStore = db.createObjectStore(DATA_OBJECT_STORE_NAME, {
        keyPath: "id",
      });

      // Index fields
      fields.forEach((field) => {
        objectStore.createIndex(field, field, { unique: false });
      });
    };

    request.onsuccess = async function (event: any) {
      console.log("onsuccess");
      // Get data from excel file
      const data = await readExcelFile(dataSet, fields);

      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(DATA_OBJECT_STORE_NAME, "readwrite");
      const objectStore = transaction.objectStore(DATA_OBJECT_STORE_NAME);

      data.forEach((dataObject) => {
        objectStore.add(dataObject);
      });

      resolve(true);
    };

    request.onerror = function (event: any) {
      console.log("onerror");
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
      if (j === 0) {
        dataObject[field] = "false"; // Default isRemembered = false
      } else {
        dataObject[field] = convertCellToHTML(row.getCell(j));
      }
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

const convertCellToHTML = (cell: Excel.Cell) => {
  let html = "<span";
  if (cell.style) {
    const styleString = styleToCSS(cell.style);
    if (styleString) {
      html += ` style="${styleString.trim()}"`;
    }
  }

  html += ">";
  html += cell.text;
  html += "</span>";

  return html;
};

const styleToCSS = (cellStyle: Partial<Excel.Style>) => {
  let styleString = "";

  if (cellStyle.font) {
    if (cellStyle.font.bold) styleString += "font-weight: bold; ";
    if (cellStyle.font.italic) styleString += "font-style: italic; ";
    if (cellStyle.font.size)
      styleString += `font-size: ${cellStyle.font.size}pt; `;
    if (cellStyle.font.color && cellStyle.font.color.argb)
      styleString += `color: #${cellStyle.font.color.argb.slice(2)}; `;
  }

  return styleString;
};

export { loadDataToDB };
