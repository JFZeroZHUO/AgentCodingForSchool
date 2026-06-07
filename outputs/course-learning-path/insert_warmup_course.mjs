import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const filePath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/黄叔课程学习路径规划.xlsx";
const previewPath = "C:/Users/92860/Desktop/AI编程项目-个人合集/校方黄叔-课程学习路径/outputs/course-learning-path/warmup-insert-preview.png";

const announcement = `【📢课前热身小活动来啦】

小伙伴们，大家好呀！！！ 🎉

在正式开课前，想带大家玩一个有趣的【热身挑战】：用AI生成一个专属的计算器！

你完全不需要懂代码，只要会“复制”和“粘贴”，就能亲手做出一个能用的计算器，特别神奇哦~

📚 操作指南：
所有步骤都已整理在教程文档中，请大家参照文档一步步来，轻松搞定！
👉文档链接：【5分钟小白友好】和AI一起，制作计算器网页
https://forchangesz.feishu.cn/wiki/K7SlwqKY2i0uuSk5E27coQQxnfb
—————————————
✨【 秀出你的成果】

完成后，欢迎截图或者是html文件发到群里，并带上标签 #我的第一个AI项目！让大家一起为你点赞！👍

——————————————
💡 【温馨小贴士】：
如果第一次不成功，很简单！把AI给的代码和你的要求（比如“计算器按钮不工作”）再发给它，AI就会帮你修复！这也是重要的学习过程哦！

这个5分钟的小挑战，能让你提前感受用AI编程的魔力。期待在群里看到大家的创意作品！`;

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
const main = workbook.worksheets.getItem("课程学习路径");
const mainValues = main.getUsedRange(true).values;
const headers = mainValues[0];
const dataRows = mainValues.slice(1).filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

const col = Object.fromEntries(headers.map((header, index) => [header, index]));
for (const required of ["第几周", "划分依据", "序号", "视频名称", "飞书口播原文", "教学文档"]) {
  if (!(required in col)) throw new Error(`未找到列：${required}`);
}

const warmupTitle = "课前热身小活动：用AI生成一个专属计算器网页";
const warmupDoc = "【5分钟小白友好】和AI一起，制作计算器网页 <https://forchangesz.feishu.cn/wiki/K7SlwqKY2i0uuSk5E27coQQxnfb>";
const alreadyExists = dataRows.some((row) =>
  String(row[col["视频名称"]] ?? "").includes("专属计算器")
  || String(row[col["教学文档"]] ?? "").includes("K7SlwqKY2i0uuSk5E27coQQxnfb")
);

let nextRows = dataRows;
if (!alreadyExists) {
  const warmupRow = headers.map(() => "");
  warmupRow[col["第几周"]] = "第1周";
  warmupRow[col["划分依据"]] = "课前热身挑战：用 AI 制作计算器网页，适合作为第一周正式学习前的入门实操。";
  warmupRow[col["视频名称"]] = warmupTitle;
  warmupRow[col["飞书口播原文"]] = announcement;
  warmupRow[col["教学文档"]] = warmupDoc;

  const insertIndex = dataRows.findIndex((row) => String(row[col["第几周"]] ?? "").includes("第1周"));
  const safeInsertIndex = insertIndex === -1 ? 0 : insertIndex;
  nextRows = [
    ...dataRows.slice(0, safeInsertIndex),
    warmupRow,
    ...dataRows.slice(safeInsertIndex),
  ];
}

nextRows = nextRows.map((row, index) => {
  const next = [...row];
  next[col["序号"]] = index + 1;
  return next;
});

const nextMainValues = [headers, ...nextRows];
main.getRange(`A1:J${nextMainValues.length}`).values = nextMainValues;
main.getRange(`A1:J${nextMainValues.length}`).format.wrapText = true;
main.getRange(`A1:J${nextMainValues.length}`).format.verticalAlignment = "top";
main.getRange(`A1:J${nextMainValues.length}`).format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
main.getRange("A:A").format.columnWidthPx = 130;
main.getRange("B:B").format.columnWidthPx = 390;
main.getRange("C:C").format.columnWidthPx = 60;
main.getRange("D:D").format.columnWidthPx = 310;
main.getRange("E:E").format.columnWidthPx = 140;
main.getRange("F:F").format.columnWidthPx = 90;
main.getRange("G:G").format.columnWidthPx = 150;
main.getRange("H:H").format.columnWidthPx = 250;
main.getRange("I:I").format.columnWidthPx = 310;
main.getRange("J:J").format.columnWidthPx = 430;
main.getRange("A1:J1").format = {
  fill: "#1F4E78",
  font: { color: "#FFFFFF", bold: true },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
main.getRange(`A2:A${nextMainValues.length}`).format = {
  fill: "#EAF3F8",
  font: { bold: true, color: "#0F3B57" },
  horizontalAlignment: "center",
  verticalAlignment: "top",
  wrapText: true,
};
main.getRange(`B2:B${nextMainValues.length}`).format = {
  fill: "#FFF7E6",
  verticalAlignment: "top",
  wrapText: true,
};
main.getRange(`A2:J${nextMainValues.length}`).format.rowHeightPx = 86;
main.getRange("A2:J2").format.rowHeightPx = 220;

const summary = workbook.worksheets.getItem("周计划汇总");
const summaryValues = summary.getUsedRange(true).values;
const summaryHeaders = summaryValues[0];
const summaryRows = summaryValues.slice(1);
const sCol = Object.fromEntries(summaryHeaders.map((header, index) => [header, index]));
const weekOneRows = nextRows.filter((row) => String(row[col["第几周"]] ?? "").includes("第1周"));
const summaryWeekOne = summaryRows.find((row) => row[sCol["第几周"]] === "第1周");
if (summaryWeekOne) {
  summaryWeekOne[sCol["课程数"]] = weekOneRows.length;
  summaryWeekOne[sCol["原表序号"]] = weekOneRows.map((row) => row[col["序号"]]).join("、");
  summaryWeekOne[sCol["对应课程"]] = weekOneRows
    .map((row) => `${row[col["序号"]]}. ${row[col["教学文档"]] || row[col["视频名称"]]}`)
    .join("\n");
}
summary.getRange(`A1:E${summaryValues.length}`).values = [summaryHeaders, ...summaryRows];
summary.getRange(`A1:E${summaryValues.length}`).format.wrapText = true;
summary.getRange(`A1:E${summaryValues.length}`).format.verticalAlignment = "top";

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
  inserted: !alreadyExists,
  totalRows: nextRows.length,
  firstWeekRows: weekOneRows.length,
  firstRowTitle: nextRows[0][col["视频名称"]],
}, null, 2));
