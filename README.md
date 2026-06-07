# AgentCodingForSchool

风变黄叔 AI 编程课程学习路径与教学网站项目。

## 项目内容

- `code-template-main/`：教学网站 Next.js 项目。
- `code-template-main/public/course-docs/`：每节课对应的独立教学 HTML 占位文档，后续可直接替换为正式教学文档。
- `outputs/course-learning-path/黄叔课程学习路径规划.xlsx`：课程学习路径排课表。
- `outputs/course-learning-path/教学学习路径规划文档.md`：可复制到飞书文档的教学学习路径说明文档。
- `outputs/course-learning-path/generate_site_assets.mjs`：根据 Excel 重新生成网站课程数据与教学 HTML 占位文件的脚本。

## 本地运行

```bash
cd code-template-main
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

## 生产构建

```bash
cd code-template-main
npm run build
```

## 课程数据更新

如果修改了 `outputs/course-learning-path/黄叔课程学习路径规划.xlsx`，可重新生成网站课程数据：

```bash
cd outputs/course-learning-path
node generate_site_assets.mjs
```

生成后会更新：

- `code-template-main/src/data/courses.ts`
- `code-template-main/public/course-docs/*.html`

