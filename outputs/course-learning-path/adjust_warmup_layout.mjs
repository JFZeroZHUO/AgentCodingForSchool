import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const filePath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/黄叔课程学习路径规划.xlsx";
const previewPath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/warmup-layout-preview.png";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
const main = workbook.worksheets.getItem("课程学习路径");
const used = main.getUsedRange(true);
const values = used.values;
const rowCount = values.length;

main.getRange(`A1:J${rowCount}`).format.wrapText = true;
main.getRange(`A1:J${rowCount}`).format.verticalAlignment = "top";
main.getRange("B:B").format.columnWidthPx = 410;
main.getRange("D:D").format.columnWidthPx = 320;
main.getRange("I:I").format.columnWidthPx = 560;
main.getRange("J:J").format.columnWidthPx = 460;
main.getRange(`A2:J${rowCount}`).format.rowHeightPx = 86;
main.getRange("A2:J2").format.rowHeightPx = 420;

const preview = await workbook.render({
  sheetName: "课程学习路径",
  range: "A1:J8",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(filePath);

console.log(JSON.stringify({ filePath, rowCount, previewPath }, null, 2));
