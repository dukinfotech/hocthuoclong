import { DataSetType } from "../components/settings/CreateDBModal";
import * as Excel from "exceljs";

export default async function readDataFromExcel(dataSet: DataSetType) {
  try {
    const buffer = await readFile(dataSet.file);
    const workbook = new Excel.Workbook();

    const file = await workbook.xlsx.load(buffer as Buffer);

    const worksheet = file.getWorksheet(dataSet.sheetNumber);
    const rows = worksheet.getRows(
      dataSet.rowFrom,
      dataSet.rowTo - dataSet.rowFrom + 1
    );

    const columnNames = ["isRemember"];
    const data = [];

    for (let i = dataSet.columnFrom; i <= dataSet.columnTo; i++) {
      columnNames.push(`column${i}`);
    }

    rows.forEach((row) => {
      try {
        const rowData = {};
        rowData["isRemember"] = 0;

        for (let i = dataSet.columnFrom; i <= dataSet.columnTo; i++) {
          let cellData = row.getCell(i).value
            ? convertCellToHTML(row.getCell(i))
            : "";
          rowData[`column${i}`] = cellData;
        }
        data.push(rowData);
      } catch (error) {
        console.error(error);
      }
    });

    return { columnNames, data };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

const readFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

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
