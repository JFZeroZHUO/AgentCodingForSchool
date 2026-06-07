import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import fs from "node:fs/promises";

const filePath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/黄叔课程学习路径规划.xlsx";
const sheetName = "课程学习路径";

const input = await FileBlob.load(filePath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem(sheetName);
const usedRange = sheet.getUsedRange(true);
const values = usedRange.values;

const headers = values[0];
const seqIndex = headers.indexOf("序号");
if (seqIndex === -1) {
  throw new Error("未找到“序号”列。");
}

const rows = values.slice(1).filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
const isGiftRow = (row) => row.some((cell) => String(cell ?? "").includes("赠送课"));
const normalRows = rows.filter((row) => !isGiftRow(row));
const giftRows = rows.filter(isGiftRow);

const reorderedRows = [...normalRows, ...giftRows].map((row, index) => {
  const next = [...row];
  next[seqIndex] = index + 1;
  return next;
});

usedRange.values = [headers, ...reorderedRows];

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "final formula error scan",
  maxChars: 2000,
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName,
  range: `A1:J${Math.min(reorderedRows.length + 1, 18)}`,
  scale: 1,
  format: "png",
});
await fs.writeFile(
  "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/reordered-preview.png",
  new Uint8Array(await preview.arrayBuffer()),
);

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(filePath);

console.log(JSON.stringify({
  filePath,
  totalRows: reorderedRows.length,
  normalRows: normalRows.length,
  giftRows: giftRows.length,
  firstGiftSeq: normalRows.length + 1,
  lastSeq: reorderedRows.length,
}, null, 2));
