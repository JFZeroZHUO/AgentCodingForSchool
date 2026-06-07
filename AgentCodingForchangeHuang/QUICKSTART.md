# 快速开始指南

这个基础项目模板已经包含了完整的项目架构，让您可以快速开始新业务开发。

## 🚀 立即开始

### 1. 克隆模板
```bash
# 复制模板到新项目目录
cp -r task-distribute-template your-new-project
cd your-new-project
```

### 2. 环境配置
```bash
# 复制环境配置文件
cp env.example .env.local

# 编辑配置文件
vim .env.local
```

### 3. 安装依赖
```bash
npm install
```

### 4. 初始化数据库
```bash
npm run init-db
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构说明

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── health/        # 健康检查API
│   │   └── examples/      # 示例API
│   ├── examples/          # 示例页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/             # React组件
│   ├── Header.tsx         # 通用头部组件
│   └── ExampleList.tsx    # 示例列表组件
├── lib/                    # 工具库
│   ├── database.ts        # 数据库配置

│   └── init-db.ts         # 数据库初始化
├── types/                  # TypeScript类型定义
│   └── index.ts           # 类型定义
└── utils/                  # 工具函数
    └── api.ts             # API工具函数
```

## 🛠️ 开发指南

### 添加新的API路由

1. 在 `src/app/api/` 目录下创建新的路由文件
2. 使用 `src/lib/database.ts` 中的数据库连接
3. 返回标准的API响应格式

```typescript
// src/app/api/your-api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const data = await query('SELECT * FROM your_table');
    return NextResponse.json({
      success: true,
      message: '获取成功',
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '获取失败'
    }, { status: 500 });
  }
}
```

### 添加新的页面

1. 在 `src/app/` 目录下创建新的页面目录
2. 创建 `page.tsx` 文件
3. 使用 `AppHeader` 组件保持一致的页面头部

```typescript
// src/app/your-page/page.tsx
import React from 'react';
import { Layout, Card } from 'antd';
import AppHeader from '@/components/Header';

const { Content } = Layout;

export default function YourPage() {
  return (
    <>
      <AppHeader title="你的页面" />
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Card>
          <h1>你的页面内容</h1>
        </Card>
      </Content>
    </>
  );
}
```

### 添加新的组件

1. 在 `src/components/` 目录下创建新的组件文件
2. 使用TypeScript定义组件接口
3. 使用Ant Design组件库

```typescript
// src/components/YourComponent.tsx
'use client';

import React from 'react';
import { Card, Button } from 'antd';

interface YourComponentProps {
  title: string;
  onAction?: () => void;
}

const YourComponent: React.FC<YourComponentProps> = ({ title, onAction }) => {
  return (
    <Card title={title}>
      <Button onClick={onAction}>操作按钮</Button>
    </Card>
  );
};

export default YourComponent;
```

### 数据库操作

使用 `src/lib/database.ts` 中的工具函数：

```typescript
import { query, transaction } from '@/lib/database';

// 简单查询
const results = await query('SELECT * FROM your_table WHERE id = ?', [id]);

// 事务操作
await transaction(async (connection) => {
  await connection.execute('INSERT INTO table1 VALUES (?)', [value1]);
  await connection.execute('UPDATE table2 SET field = ? WHERE id = ?', [value2, id]);
});
```

### 文件上传

使用 Supabase Storage 进行文件上传：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 上传文件到Supabase Storage
const { data, error } = await supabase.storage
  .from('your-bucket')
  .upload('your-folder/file-name.jpg', file);
```

### API调用

使用 `src/utils/api.ts` 中的API工具函数：

```typescript
import { apiGet, apiPost } from '@/utils/api';

// GET请求
const data = await apiGet('/api/your-endpoint', { param: 'value' });

// POST请求
const result = await apiPost('/api/your-endpoint', { field: 'value' });
```

## 🎨 UI组件使用

### 表格组件
参考 `ExampleList.tsx` 中的表格实现，包含：
- 分页
- 搜索
- 筛选
- 排序

### 表单组件
使用Ant Design的Form组件：
- 表单验证
- 动态表单
- 文件上传

### 模态框组件
使用Modal组件创建弹窗：
- 创建/编辑表单
- 确认对话框
- 详情展示

## 🔧 配置说明

### 环境变量
- `DB_*`: 数据库配置
- `SUPABASE_*`: Supabase配置
- `NODE_ENV`: 环境模式

### 数据库表
模板已创建以下基础表：
- `examples`: 示例数据表
- `file_uploads`: 文件上传记录表
- `system_configs`: 系统配置表

### 中间件配置
`src/middleware.ts` 包含：
- 安全头设置
- CORS配置
- 请求日志
- 维护模式

## 📦 部署

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm run build
npm start
```

### Docker部署
```bash
docker build -t your-app .
docker run -p 3000:3000 your-app
```

## 🔍 调试

### 健康检查
访问 `/api/health` 检查系统状态

### 数据库连接
```bash
npm run init-db
```

### 日志查看
开发环境下，请求日志会输出到控制台

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 文档](https://ant.design/components/overview/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [MySQL 文档](https://dev.mysql.com/doc/)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个模板。

## 📄 许可证

MIT License
