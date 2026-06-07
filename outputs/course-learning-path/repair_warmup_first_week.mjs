import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const filePath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/黄叔课程学习路径规划.xlsx";
const previewPath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/warmup-final-preview.png";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
const main = workbook.worksheets.getItem("课程学习路径");
const values = main.getUsedRange(true).values;
const headers = values[0];
const rows = values.slice(1).filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
const col = Object.fromEntries(headers.map((header, index) => [header, index]));

for (const row of rows) {
  const video = String(row[col["视频名称"]] ?? "");
  const doc = String(row[col["教学文档"]] ?? "");
  if (
    video.includes("课前热身小活动")
    || doc.includes("网页入门AI编程 8.27")
    || doc.includes("入门AI编程 8.2")
  ) {
    row[col["第几周"]] = "第1周";
  }
}

const renumberedRows = rows.map((row, index) => {
  const next = [...row];
  next[col["序号"]] = index + 1;
  return next;
});

main.getRange(`A1:J${renumberedRows.length + 1}`).values = [headers, ...renumberedRows];
main.getRange(`A1:J${renumberedRows.length + 1}`).format.wrapText = true;
main.getRange(`A1:J${renumberedRows.length + 1}`).format.verticalAlignment = "top";
main.getRange(`A1:J${renumberedRows.length + 1}`).format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
main.getRange(`A2:J${renumberedRows.length + 1}`).format.rowHeightPx = 86;
main.getRange("A2:J2").format.rowHeightPx = 220;

const summary = workbook.worksheets.getItem("周计划汇总");
const summaryValues = summary.getUsedRange(true).values;
const summaryHeaders = summaryValues[0];
const summaryRows = summaryValues.slice(1);
const sCol = Object.fromEntries(summaryHeaders.map((header, index) => [header, index]));
const weekOneRows = renumberedRows.filter((row) => String(row[col["第几周"]] ?? "").includes("第1周"));
const summaryWeekOne = summaryRows.find((row) => row[sCol["第几周"]] === "第1周");
if (summaryWeekOne) {
  summaryWeekOne[sCol["课程数"]] = weekOneRows.length;
  summaryWeekOne[sCol["原表序号"]] = weekOneRows.map((row) => row[col["序号"]]).join("、");
  summaryWeekOne[sCol["对应课程"]] = weekOneRows
    .map((row) => `${row[col["序号"]]}. ${row[col["教学文档"]] || row[col["视频名称"]]}`)
    .join("\n");
}
summary.getRange(`A1:E${summaryRows.length + 1}`).values = [summaryHeaders, ...summaryRows];

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "final formula error scan",
  maxChars: 2000,
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "课程学习路径",
  range: "A1:J10",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(filePath);

console.log(JSON.stringify({
  filePath,
  totalRows: renumberedRows.length,
  firstWeekRows: weekOneRows.length,
  firstWeekSeqs: weekOneRows.map((row) => row[col["序号"]]),
}, null, 2));
