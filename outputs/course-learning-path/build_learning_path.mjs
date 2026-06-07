import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const spreadsheetToken = "ZjaksQgwvhrs5QtR7HRcDEKknZg";
const readRange = "0lHbyx!A1:H60";
const outputDir = path.resolve("outputs", "course-learning-path");
const outputPath = path.join(outputDir, "黄叔课程学习路径规划.xlsx");
const larkCli = "C:\\Users\\92860\\AppData\\Roaming\\npm\\lark-cli.ps1";

const weekThemes = new Map([
  ["第1周", "工具安装、基础网页 AI、普通/复杂网页认知"],
  ["第2周", "开发网页、项目运行、普通网页与项目区别"],
  ["第3周", "Vercel 部署上线、域名绑定"],
  ["第4周", "网页接入 AI 大模型、API 与模型能力认知"],
  ["第5周", "网页接入飞书多维表格数据库"],
  ["第6周", "网页接入 Supabase 数据库、登录注册、支付"],
  ["第7周", "微信小程序/小游戏开发"],
  ["第8周", "浏览器插件开发"],
  ["第9周", "Claude Code 安装使用、Agent Skill 概念"],
  ["第10周", "自建 Agent Skills、微博热搜分析 Skill"],
  ["第11周", "Agent Skills 部署到 GitHub、自动运行与使用他人 Skills"],
  ["第12周", "群聊/社群内容分析 Agent Skills"],
  ["第13周", "自媒体平台内容抓取、改写、发布 Agent Skills"],
  ["第14周", "视频口播稿、视频创作与其他 Agent Skills"],
  ["第15周", "龙虾 OpenClaw 部署和使用"],
  ["无需学习", "与当前学习路径无关，或已有更完整课程可替代"],
]);

const plan = new Map([
  [1, { weeks: ["第9周"], reason: "AI Agent 入门主题，适合作为 Agent Skill 概念补充。" }],
  [2, { weeks: ["第4周"], reason: "MiniMax Agent 接入微信/飞书，可作为不同 AI 大模型和接入方式的补充认识。" }],
  [3, { weeks: ["第14周"], reason: "YouMind + Skill 高效内容创作，归入其他 Agent Skills 实践。" }],
  [4, { weeks: ["第9周"], reason: "Claude Agent Skills 蓝皮书，适合解释 Agent Skill 是什么。" }],
  [5, { weeks: ["第14周"], reason: "基于口播稿完成视频创作，匹配视频口播稿和视频内容生产路径。" }],
  [6, { weeks: ["第14周"], reason: "从抓取内容到口播稿，匹配视频口播稿生成路径。" }],
  [7, { weeks: ["第13周", "第15周"], reason: "OpenClaw + Skill 直出公众号文章，既是龙虾使用，也服务自媒体内容生产。" }],
  [8, { weeks: ["第13周"], reason: "抓取微信公众号文章用于内容选题，匹配自媒体内容生产前置流程。" }],
  [9, { weeks: ["第10周"], reason: "内容 Agent 第一课，适合作为自建 Agent Skills 的前置课程。" }],
  [10, { weeks: ["第9周"], reason: "Claude Skill 阶段性总结，适合补充理解为什么学习 Skills。" }],
  [11, { weeks: ["第9周", "第15周"], reason: "同时包含 OpenClaw 云服务器配置 Claude Code 和龙虾部署接入飞书。" }],
  [12, { weeks: ["第11周"], reason: "本地全自动定时运行 Skills，匹配 Skills 自动运行和部署后的使用。" }],
  [13, { weeks: ["第11周"], reason: "GitHub Actions 云端定时运行 Skills，匹配部署和自动化运行路径。" }],
  [14, { weeks: ["无需学习"], reason: "YouMind 单独入门，不是当前 15 周路径的核心内容；可跳过。" }],
  [15, { weeks: ["第13周", "第14周"], reason: "一篇文风短文生成属于其他 Skills，发布到公众号草稿箱属于自媒体发布 Skills。" }],
  [16, { weeks: ["第11周"], reason: "一个 Skill 做自动更新网站，匹配 Skills 部署、运行和复用。" }],
  [17, { weeks: ["第10周"], reason: "一个提示词生成专属 Skill，匹配自建 Agent Skills。" }],
  [18, { weeks: ["第12周"], reason: "Claude Code 分析微信聊天记录，匹配群聊分析 Agent Skills。" }],
  [19, { weeks: ["第10周"], reason: "微博热搜提取产品创意，直接匹配微博热搜分析 Skill。" }],
  [20, { weeks: ["第2周", "第9周"], reason: "同时包含 Claude Code 入门和用 Claude Code 开发个人网站。" }],
  [21, { weeks: ["第2周"], reason: "百度秒哒产品开发，归入网页/产品开发实践。" }],
  [22, { weeks: ["第2周"], reason: "Vibe Coding 提示词覆盖开发场景，适合作为开发网页的方法课。" }],
  [23, { weeks: ["无需学习"], reason: "与序号 22 同一教学文档，且视频时长仅 57 秒，优先学习序号 22 完整课。" }],
  [24, { weeks: ["无需学习"], reason: "与序号 25 同一教学文档，且为 7 分钟片段，优先学习序号 25 完整课。" }],
  [25, { weeks: ["第12周", "第13周"], reason: "社群周报匹配群聊/社群分析，爆款博主文案提取改写匹配自媒体内容生产。" }],
  [26, { weeks: ["第13周"], reason: "自动化改写并发布内容，虽是 n8n，但功能上匹配自媒体发布链路。" }],
  [27, { weeks: ["第13周"], reason: "自动化抓取公众号内容，匹配自媒体内容抓取和选题链路。" }],
  [28, { weeks: ["第6周"], reason: "接入 Supabase + 国内支付，直接匹配第 6 周。" }],
  [29, { weeks: ["第6周"], reason: "Supabase 数据库、登录注册、积分，直接匹配第 6 周。" }],
  [30, { weeks: ["第4周"], reason: "Seedream 4.0 生图大模型，匹配不同 AI 大模型功能认识。" }],
  [31, { weeks: ["第4周", "第13周"], reason: "NanoBanana API/MCP 属于大模型 API 认识，也可服务小红书自媒体内容生成。" }],
  [32, { weeks: ["无需学习"], reason: "与序号 31 同一教学文档，且视频时长仅 33 秒，优先学习序号 31 完整课。" }],
  [33, { weeks: ["第7周"], reason: "微信小游戏开发，作为微信小程序开发周的补充实践。" }],
  [34, { weeks: ["无需学习"], reason: "黑客松创意分享且无教学文档，不属于当前学习路径的必学课程。" }],
  [35, { weeks: ["第1周"], reason: "网页入门 AI 编程，匹配基础网页 AI 认知。" }],
  [36, { weeks: ["第2周"], reason: "基于 Web 技术的手势识别应用，适合补充复杂项目网页和开发实践。" }],
  [37, { weeks: ["第7周"], reason: "注册、开发并上线微信小程序，直接匹配第 7 周。" }],
  [38, { weeks: ["第3周"], reason: "国内域名获取和网站绑定域名，直接匹配第 3 周。" }],
  [39, { weeks: ["第7周"], reason: "微信小游戏开发，作为微信开发周补充实践。" }],
  [40, { weeks: ["第8周"], reason: "浏览器插件《今日清单》，直接匹配第 8 周。" }],
  [41, { weeks: ["第1周"], reason: "入门 AI 编程，适合作为第一周基础课程。" }],
  [42, { weeks: ["第2周", "第4周"], reason: "豆包大模型匹配模型能力认识，Trickle.so 匹配网页开发工具认知。" }],
  [43, { weeks: ["第11周"], reason: "Github 快速实现开源软件，作为 Skills 上 GitHub 的前置 GitHub 实操课。" }],
  [44, { weeks: ["第5周"], reason: "飞书多维表格作为数据库，直接匹配第 5 周。" }],
  [45, { weeks: ["无需学习"], reason: "与序号 44 同一教学文档，且视频时长仅 1 分 19 秒，优先学习序号 44 完整课。" }],
  [46, { weeks: ["无需学习"], reason: "与序号 44 同一教学文档，为较短分段回放，优先学习序号 44 完整课。" }],
  [47, { weeks: ["第1周", "第3周"], reason: "五件套入门匹配第一周工具安装，上线第一个网站匹配第三周部署。" }],
]);

function columnName(index) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    name = String.fromCharCode(65 + r) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function flattenCell(cell, { includeLinks = true } = {}) {
  if (cell === null || cell === undefined) return "";
  if (Array.isArray(cell)) {
    const parts = [];
    for (const segment of cell) {
      const text = segment?.text ?? "";
      const link = segment?.link ?? "";
      if (text && link && includeLinks) {
        parts.push(`${text.trim()} <${link}>`);
      } else if (text) {
        parts.push(text);
      } else if (link) {
        parts.push(link);
      }
    }
    return parts.join("").replace(/\n{3,}/g, "\n\n").trim();
  }
  return String(cell).trim();
}

function primarySortKey(weeks) {
  const week = weeks.find((w) => w !== "无需学习");
  if (!week) return 99;
  const match = week.match(/\d+/);
  return match ? Number(match[0]) : 98;
}

function fetchRows() {
  const raw = execFileSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    larkCli,
    "sheets",
    "+read",
    "--spreadsheet-token",
    spreadsheetToken,
    "--range",
    readRange,
  ], { encoding: "utf8", maxBuffer: 30 * 1024 * 1024 });

  const parsed = JSON.parse(raw);
  if (!parsed.ok) {
    throw new Error(`读取飞书表格失败: ${raw}`);
  }
  const values = parsed.data.valueRange.values;
  const headerRow = values[0].map((cell) => flattenCell(cell, { includeLinks: false }));
  const headerIndexes = headerRow
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => header);

  const rows = values.slice(1)
    .filter((row) => row?.[0] !== null && row?.[0] !== undefined)
    .map((row) => {
      const seq = Number(flattenCell(row[0], { includeLinks: false }));
      const item = plan.get(seq) ?? { weeks: ["无需学习"], reason: "未匹配到当前学习路径。" };
      const original = headerIndexes.map(({ index }) => {
        const header = headerRow[index];
        const value = flattenCell(row[index]);
        if (header === "视频ID") return value ? `\u200B${value}` : "";
        return value;
      });
      return {
        seq,
        weeks: item.weeks,
        weekText: item.weeks.join("、"),
        reason: item.reason,
        original,
        sortKey: primarySortKey(item.weeks),
      };
    });

  rows.sort((a, b) => a.sortKey - b.sortKey || a.seq - b.seq);
  return { headers: headerIndexes.map(({ header }) => header), rows };
}

function buildSummary(rows) {
  const summaryRows = [];
  for (const [week, theme] of weekThemes) {
    const matched = rows.filter((row) => row.weeks.includes(week));
    summaryRows.push([
      week,
      theme,
      matched.length,
      matched.map((row) => row.seq).join("、"),
      matched.map((row) => {
        const doc = row.original[7] || row.original[1] || "";
        const cleanDoc = String(doc).replace(/<https?:\/\/[^>]+>/g, "").replace(/\s+/g, " ").trim();
        return cleanDoc ? `${row.seq}. ${cleanDoc}` : `${row.seq}. ${row.original[1]}`;
      }).join("\n"),
    ]);
  }
  return summaryRows;
}

await fs.mkdir(outputDir, { recursive: true });

const { headers, rows } = fetchRows();
const workbook = Workbook.create();
const main = workbook.worksheets.add("课程学习路径");
const summary = workbook.worksheets.add("周计划汇总");

const mainHeaders = ["第几周", ...headers, "划分依据"];
const mainValues = [
  mainHeaders,
  ...rows.map((row) => [row.weekText, ...row.original, row.reason]),
];
const mainColCount = mainHeaders.length;
const mainLastCol = columnName(mainColCount - 1);
const mainRange = main.getRange(`A1:${mainLastCol}${mainValues.length}`);
mainRange.values = mainValues;
main.freezePanes.freezeRows(1);
main.getRange(`A1:${mainLastCol}1`).format = {
  fill: "#1F4E78",
  font: { color: "#FFFFFF", bold: true },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
mainRange.format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
mainRange.format.wrapText = true;
main.getRange(`A2:A${mainValues.length}`).format = {
  fill: "#EAF3F8",
  font: { bold: true, color: "#0F3B57" },
  horizontalAlignment: "center",
  verticalAlignment: "top",
  wrapText: true,
};
main.getRange(`J2:J${mainValues.length}`).format = {
  fill: "#FFF7E6",
  verticalAlignment: "top",
  wrapText: true,
};
main.getRange(`A1:${mainLastCol}${mainValues.length}`).format.verticalAlignment = "top";
main.getRange("A:A").format.columnWidthPx = 130;
main.getRange("B:B").format.columnWidthPx = 58;
main.getRange("C:C").format.columnWidthPx = 410;
main.getRange("D:D").format.columnWidthPx = 150;
main.getRange("E:E").format.columnWidthPx = 90;
main.getRange("F:F").format.columnWidthPx = 150;
main.getRange("F:F").setNumberFormat("@");
main.getRange("G:G").format.columnWidthPx = 360;
main.getRange("H:H").format.columnWidthPx = 310;
main.getRange("I:I").format.columnWidthPx = 470;
main.getRange("J:J").format.columnWidthPx = 390;
main.getRange(`A2:${mainLastCol}${mainValues.length}`).format.rowHeightPx = 72;

const summaryHeaders = ["第几周", "学习主题", "课程数", "原表序号", "对应课程"];
const summaryValues = [summaryHeaders, ...buildSummary(rows)];
const summaryLastCol = columnName(summaryHeaders.length - 1);
const summaryRange = summary.getRange(`A1:${summaryLastCol}${summaryValues.length}`);
summaryRange.values = summaryValues;
summary.freezePanes.freezeRows(1);
summary.getRange(`A1:${summaryLastCol}1`).format = {
  fill: "#365F91",
  font: { color: "#FFFFFF", bold: true },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
summaryRange.format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
summaryRange.format.wrapText = true;
summaryRange.format.verticalAlignment = "top";
summary.getRange("A:A").format.columnWidthPx = 95;
summary.getRange("B:B").format.columnWidthPx = 300;
summary.getRange("C:C").format.columnWidthPx = 75;
summary.getRange("D:D").format.columnWidthPx = 210;
summary.getRange("E:E").format.columnWidthPx = 720;
summary.getRange(`A2:${summaryLastCol}${summaryValues.length}`).format.rowHeightPx = 92;

const noStudyRows = rows.filter((row) => row.weekText === "无需学习").length;
const relevantRows = rows.length - noStudyRows;

const inspection = await workbook.inspect({
  kind: "table",
  range: "课程学习路径!A1:J12",
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 10,
  maxChars: 6000,
});
console.log(inspection.ndjson);

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
  range: "A1:J16",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "preview.png"), new Uint8Array(await preview.arrayBuffer()));

const summaryPreview = await workbook.render({
  sheetName: "周计划汇总",
  range: "A1:E17",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "summary-preview.png"), new Uint8Array(await summaryPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  totalRows: rows.length,
  relevantRows,
  noStudyRows,
}, null, 2));
