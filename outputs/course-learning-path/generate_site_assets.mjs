import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(scriptDir, "../..");
const excelPath = path.join(scriptDir, "黄叔课程学习路径规划.xlsx");
const projectRoot = path.join(workspace, "code-template-main");
const dataPath = path.join(projectRoot, "src/data/courses.ts");
const docsDir = path.join(projectRoot, "public/course-docs");

const weekThemes = {
  "第1周": "工具安装与基础网页 AI",
  "第2周": "开发网页与项目运行",
  "第3周": "部署上线、Vercel 与域名",
  "第4周": "网页接入 AI 大模型",
  "第5周": "飞书多维表格数据库",
  "第6周": "Supabase 数据库与支付",
  "第7周": "微信小程序开发",
  "第8周": "浏览器插件开发",
  "第9周": "Claude Code 与 Agent Skill",
  "第10周": "自建 Agent Skills",
  "第11周": "Skills 部署与复用",
  "第12周": "群聊分析 Agent Skills",
  "第13周": "自媒体发布 Agent Skills",
  "第14周": "口播稿、视频创作与龙虾部署",
  "第15周": "龙虾部署和使用",
  "赠送课": "赠送拓展课",
};

function clean(value) {
  return String(value ?? "").replace(/\u200B/g, "").trim();
}

function htmlEscape(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extractFirstUrl(text) {
  const match = clean(text).match(/https?:\/\/[^\s<>]+/);
  return match ? match[0] : "";
}

function stripUrls(text) {
  return clean(text)
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/https?:\/\/[^\s<>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeVideoTitle(title) {
  return clean(title)
    .replace(/_\d+_\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}_点播视频回放/g, "")
    .replace(/_点播视频回放$/g, "")
    .replace(/^风变xAI产品黄叔[:：]?/g, "")
    .replace(/^黄叔AI编程公开课\d*(?:\.\d+)?[:：]?/g, "")
    .replace(/^黄叔AI编程[:：]?/g, "")
    .trim();
}

function normalizeDocTitle(title) {
  const firstTitle = clean(title).split(/\s+教学文档/)[0];
  return clean(firstTitle)
    .replace(/^教学文档(?:---|-)?\d{0,8}\s*-?\s*/g, "")
    .replace(/^\d{4,8}教学文档(?:---|-)?\s*/g, "")
    .replace(/^教学文档\d{4,8}(?:---|-)?\s*/g, "")
    .replace(/^\d{4,8}(?:---|-)\s*/g, "")
    .replace(/^[-—\s]+/g, "")
    .trim();
}

function weekNumber(week) {
  const match = clean(week).match(/\d+/);
  return match ? Number(match[0]) : 99;
}

function categoryForWeek(week) {
  if (clean(week).includes("赠送")) return "bonus";
  const n = weekNumber(week);
  if (n <= 4) return "web";
  if (n <= 6) return "data";
  if (n <= 8) return "apps";
  if (n <= 15) return "agent";
  return "all";
}

function homeworkFor(course) {
  if (course.sequence === 1) {
    return [
      "按照教学文档完成一个可以本地打开的计算器网页。",
      "把完成后的页面截图或 HTML 文件发到群里，并带上标签 #我的第一个AI项目。",
      "如果按钮不工作或样式不满意，把代码和问题重新发给 AI，让它协助修复。",
    ];
  }

  if (course.isBonus) {
    return [
      "完成本节赠送课的核心演示或案例复现。",
      "记录一个你认为可以迁移到自己项目里的做法。",
      "如有成果文件，可截图或整理为简短说明留档。",
    ];
  }

  return [
    `围绕「${course.title}」完成本节课的关键实操。`,
    "整理本课最终产物、截图或关键链接。",
    "写下一个卡点和一个解决办法，作为复盘记录。",
  ];
}

function docHtml(course) {
  const homeworkItems = course.homework.map((item) => `<li>${htmlEscape(item)}</li>`).join("\n");
  const sourceDoc = course.sourceDocUrl
    ? `<p>原教学文档线索：<a href="${htmlEscape(course.sourceDocUrl)}" target="_blank" rel="noreferrer">${htmlEscape(
        course.sourceDocTitle || course.sourceDocUrl,
      )}</a></p>`
    : "";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(course.title)} - 教学文档占位</title>
  <style>
    :root {
      --paper: #fffaf2;
      --ink: #241f1a;
      --muted: #766d63;
      --line: #eadfce;
      --accent: #c85f42;
      --soft: #fbefe6;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background:
        linear-gradient(rgba(203, 95, 66, .055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(203, 95, 66, .055) 1px, transparent 1px),
        linear-gradient(180deg, #fffaf2 0%, #f8f1e7 100%);
      background-size: 28px 28px, 28px 28px, 100% 100%;
      color: var(--ink);
      font-family: "Noto Serif SC", "Songti SC", "Microsoft YaHei", serif;
      line-height: 1.75;
    }
    main { max-width: 860px; margin: 0 auto; padding: 40px 34px 64px; }
    .eyebrow { color: var(--accent); font-weight: 800; letter-spacing: .08em; font-size: 13px; }
    h1 { font-size: 30px; line-height: 1.25; margin: 12px 0; letter-spacing: 0; }
    .meta { color: var(--muted); font-size: 14px; border-bottom: 1px solid var(--line); padding-bottom: 20px; }
    section { background: rgba(255,255,255,.72); border: 1px solid var(--line); border-radius: 8px; padding: 22px; margin-top: 22px; }
    h2 { font-size: 18px; margin: 0 0 12px; }
    p { margin: 0 0 12px; }
    ul { margin: 0; padding-left: 20px; }
    li + li { margin-top: 8px; }
    .replace-note { background: var(--soft); border-left: 4px solid var(--accent); }
    a { color: #9d4f35; word-break: break-all; }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">${htmlEscape(course.week)} · ${htmlEscape(course.theme)}</div>
    <h1>${htmlEscape(course.title)}</h1>
    <div class="meta">课程序号 ${course.sequence} · 视频时长 ${htmlEscape(course.duration || "待补充")} · 可替换教学 HTML 文件</div>

    <section class="replace-note">
      <h2>后续替换说明</h2>
      <p>这个页面是占位教学文档。你后续只需要用正式教学 HTML 覆盖当前文件，就能在课程详情页右侧自动显示新内容。</p>
      <p>当前文件路径：<strong>/course-docs/${course.slug}.html</strong></p>
    </section>

    <section>
      <h2>课程导学</h2>
      <p>${htmlEscape(course.description || course.reason || "本课将围绕当前学习路径中的核心任务展开。")}</p>
      ${sourceDoc}
    </section>

    <section>
      <h2>本课作业要求</h2>
      <ul>
        ${homeworkItems}
      </ul>
    </section>
  </main>
</body>
</html>
`;
}

function getValue(row, col, ...names) {
  for (const name of names) {
    if (col.has(name)) {
      return clean(row[col.get(name)]);
    }
  }
  return "";
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(excelPath));
const sheet = workbook.worksheets.items.find((item) => item.name === "课程学习路径") ?? workbook.worksheets.items[0];
const values = sheet.getUsedRange(true).values;
const headers = values[0].map(clean);
const col = new Map(headers.map((header, index) => [header, index]));
const rows = values.slice(1).filter((row) => row.some((cell) => clean(cell)));

const courses = rows.map((row, index) => {
  const sequence = Number(getValue(row, col, "序号")) || index + 1;
  const week = getValue(row, col, "第几周") || "未分组";
  const courseName = getValue(row, col, "课程名称");
  const description = getValue(row, col, "课程说明", "课程说明2");
  const videoTitle = getValue(row, col, "视频名称");
  const sourceDoc = getValue(row, col, "教学文档");
  const reason = getValue(row, col, "划分依据");
  const title = courseName || normalizeDocTitle(stripUrls(sourceDoc)) || normalizeVideoTitle(videoTitle) || `课程 ${sequence}`;
  const isBonus = week.includes("赠送") || [week, reason, sourceDoc, videoTitle].some((value) => clean(value).includes("赠送课"));

  const course = {
    sequence,
    slug: `course-${String(sequence).padStart(3, "0")}`,
    week,
    weekOrder: weekNumber(week),
    theme: weekThemes[week] || week,
    category: categoryForWeek(week),
    title,
    description: description || reason,
    videoTitle,
    uploadTime: getValue(row, col, "上传时间"),
    duration: getValue(row, col, "视频时长"),
    videoId: getValue(row, col, "视频ID"),
    videoUrl: getValue(row, col, "视频地址"),
    reason,
    sourceScript: getValue(row, col, "飞书口播原文"),
    sourceDocTitle: stripUrls(sourceDoc),
    sourceDocUrl: extractFirstUrl(sourceDoc),
    docPath: `/course-docs/course-${String(sequence).padStart(3, "0")}.html`,
    isBonus,
  };

  return { ...course, homework: homeworkFor(course) };
});

const weeks = [];
const weeksByLabel = new Map();
for (const course of courses) {
  if (!weeksByLabel.has(course.week)) {
    const week = {
      label: course.week,
      order: course.weekOrder,
      theme: course.theme,
      category: course.category,
      isBonus: course.isBonus,
      courseCount: 0,
      firstSequence: course.sequence,
    };
    weeksByLabel.set(course.week, week);
    weeks.push(week);
  }
  weeksByLabel.get(course.week).courseCount += 1;
}

const exportedWeeks = weeks.map(({ firstSequence, ...week }) => week);

await fs.mkdir(path.dirname(dataPath), { recursive: true });
await fs.mkdir(docsDir, { recursive: true });

const dataFile = `export type CourseCategory = "web" | "data" | "apps" | "agent" | "bonus" | "all";

export interface Course {
  sequence: number;
  slug: string;
  week: string;
  weekOrder: number;
  theme: string;
  category: CourseCategory;
  title: string;
  description: string;
  videoTitle: string;
  uploadTime: string;
  duration: string;
  videoId: string;
  videoUrl: string;
  reason: string;
  sourceScript: string;
  sourceDocTitle: string;
  sourceDocUrl: string;
  docPath: string;
  isBonus: boolean;
  homework: string[];
}

export interface CourseWeek {
  label: string;
  order: number;
  theme: string;
  category: CourseCategory;
  isBonus: boolean;
  courseCount: number;
}

export const courses = ${JSON.stringify(courses, null, 2)} satisfies Course[];

export const courseWeeks = ${JSON.stringify(exportedWeeks, null, 2)} satisfies CourseWeek[];
`;

await fs.writeFile(dataPath, dataFile, "utf8");

const expectedDocFiles = new Set(courses.map((course) => `${course.slug}.html`));
const existingDocs = await fs.readdir(docsDir).catch(() => []);
for (const file of existingDocs) {
  if (/^course-\d{3}\.html$/.test(file) && !expectedDocFiles.has(file)) {
    await fs.rm(path.join(docsDir, file));
  }
}

for (const course of courses) {
  await fs.writeFile(path.join(docsDir, `${course.slug}.html`), docHtml(course), "utf8");
}

console.log(JSON.stringify({
  courses: courses.length,
  weeks: exportedWeeks.map((week) => `${week.label}:${week.courseCount}`),
  dataPath,
  docsDir,
  firstCourse: courses[0]?.title,
  lastCourse: courses.at(-1)?.title,
}, null, 2));
