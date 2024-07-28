import { DataSetType } from "../components/settings/CreateDBModal";
import * as Excel from "exceljs";
import { DATA_OBJECT_STORE_NAME, REMEMBER_FIELD } from "../const";

const loadDataToDB = (dataSet: DataSetType) => {
  return new Promise(async (resolve, reject) => {
    const request = window.indexedDB.open(dataSet.name);

    // Define field name
    const fields = [REMEMBER_FIELD];
    for (let i = dataSet.columnFrom; i <= dataSet.columnTo; i++) {
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
      try {
        // Get data from excel file
        const data = await readExcelFile(dataSet, fields);

        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(DATA_OBJECT_STORE_NAME, "readwrite");
        const objectStore = transaction.objectStore(DATA_OBJECT_STORE_NAME);

        data.forEach((dataObject) => {
          objectStore.add(dataObject);
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };

    request.onerror = function (event: any) {
      reject(event.target.error);
    };
  });
};

const readExcelFile = async (dataSet: DataSetType, fields: string[]) => {
  const buffer = await readFile(dataSet.file);
  const workbook = new Excel.Workbook();

  const file = await workbook.xlsx.load(buffer as Buffer);

  const worksheet = file.getWorksheet(dataSet.sheetNumber);
  const rows = worksheet.getRows(dataSet.rowFrom, dataSet.rowTo);

  const data = [];

  rows.forEach((row, i) => {
    try {
      // Skip error rows
      let dataObject = {};
      dataObject["id"] = i + 1;
      dataObject[REMEMBER_FIELD] = "false";
      for (let j = dataSet.columnFrom; j <= dataSet.columnTo; j++) {
        dataObject[`field${j}`] = row.getCell(j).value
          ? convertCellToHTML(row.getCell(j))
          : "";
      }
      data.push(dataObject);
    } catch (error) {
      console.error(error);
    }
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
  let html = "";
  const cellValue = cell.value;

  if (isCellRichTextValue(cellValue)) {
    const richText = cellValue.richText;

    richText.forEach((_text) => {
      let _html = "<span";
      if (_text.font) {
        const cssString = fontStylesToCSS(_text.font);
        if (cssString) {
          _html += ` style="${cssString.trim()}"`;
        }
      }
      _html += ">";
      _html += _text.text.replaceAll("\n", "<br/>");
      _html += "</span>";

      html += _html;
    });
  } else {
    let _html = "<span";
    if (cell.font) {
      const cssString = fontStylesToCSS(cell.font);
      if (cssString) {
        _html += ` style="${cssString.trim()}"`;
      }
    }
    _html += ">";
    _html += cell.text.replaceAll("\n", "<br/>");
    _html += "</span>";

    html += _html;
  }

  return html;
};

const fontStylesToCSS = (fontStyle: Partial<Excel.Font>) => {
  let cssString = "";

  if (fontStyle.bold) cssString += "font-weight: bold; ";
  if (fontStyle.italic) cssString += "font-style: italic; ";
  if (fontStyle.size) cssString += `font-size: ${fontStyle.size}pt; `;
  if (fontStyle.color && fontStyle.color.argb)
    cssString += `color: #${fontStyle.color.argb.slice(2)}; `;

  return cssString;
};

// Define type guard
const isCellRichTextValue = (
  value: Excel.CellValue
): value is Excel.CellRichTextValue => {
  return (value as Excel.CellRichTextValue).richText !== undefined;
};

export { loadDataToDB };
