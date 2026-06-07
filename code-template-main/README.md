# 基础项目模板

这是一个基于 Next.js 14 的基础项目模板，提供了完整的项目架构和通用功能，可以快速开始新业务开发。

## 功能特性

- 🏗️ **完整项目架构**: Next.js 14 + React 18 + TypeScript
- 🎨 **现代化UI**: 基于 Ant Design 的响应式界面
- 💾 **数据库集成**: Supabase 数据库配置和初始化
- 🔐 **环境配置**: 支持多环境部署的配置管理
- 📱 **响应式设计**: 支持移动端和桌面端
- 🚀 **开发工具**: ESLint, TypeScript, Tailwind CSS

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **UI组件**: Ant Design
- **样式**: Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase
- **开发工具**: ESLint, TypeScript

## 快速开始

### 1. 环境配置

复制环境配置文件：
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，配置必要信息：
```env
# 服务器端 Supabase 配置（用于 Node.js 脚本）
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SCHEMA=public

# 需要改为实际的 url
NEXT_PUBLIC_API_URL=http://localhost:3000/aigcfun/code-template

# 只有本地需要配置以下三个字段，测试和生产会在build过程注入
CI_PROJECT_NAMESPACE=aigcfun
CI_APP_NAME=code-template
ENV=local
```

### 2. 安装依赖

```bash
npm install
```

### 3. 设置 Supabase

1. 按照 [Supabase 设置指南](./SUPABASE_SETUP.md) 创建项目和配置
2. 在 Supabase Dashboard 中执行 `supabase-schema.sql` 创建表结构
3. 运行初始化脚本：
```bash
npm run init-db
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── examples/      # 示例API
│   │   └── healthy/       # 健康检查API
│   ├── examples/          # 示例页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/             # React组件
│   ├── ExampleList.tsx    # 示例列表组件
│   └── Header.tsx         # 通用头部组件
├── lib/                    # 工具库
│   └── database.ts        # 数据库配置
├── types/                  # TypeScript类型定义
│   └── index.ts           # 类型定义
└── utils/                  # 工具函数
    └── api.ts             # API工具函数
```

## 开发指南

### 1. 添加新的API路由

在 `src/app/api/` 目录下创建新的路由文件：

```typescript
// src/app/api/your-api/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 你的业务逻辑
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 你的业务逻辑
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
  }
}
```

### 2. 添加新的页面

在 `src/app/` 目录下创建新的页面：

```typescript
// src/app/your-page/page.tsx
'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import Header from '@/components/Header';

const { Title } = Typography;

export default function YourPage() {
  return (
    <>
      <Header title="你的页面标题" />
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>你的页面内容</Title>
        </Card>
      </div>
    </>
  );
}
```

### 3. 使用API工具函数

使用 `src/utils/api.ts` 中的工具函数：

```typescript
import { apiGet, apiPost } from '@/utils/api';

// GET请求
const data = await apiGet('/your-api', { param: 'value' });

// POST请求
const result = await apiPost('/your-api', { name: 'test' });
```

### 4. 数据库操作

使用 `src/lib/database.ts` 中的数据库连接：

```typescript
import { query } from '@/lib/database';

// 查询数据
const results = await query('SELECT * FROM your_table WHERE id = ?', [id]);

// 插入数据
const result = await query(
  'INSERT INTO your_table (name, description) VALUES (?, ?)',
  [name, description]
);
```

## 环境配置

### 本地开发环境

在 `.env.local` 文件中配置：
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/demo/template
ENV=local
CI_PROJECT_NAMESPACE=demo
CI_APP_NAME=template
```

### CI/CD 环境

在 CI/CD 构建过程中，系统会根据以下环境变量自动生成 API URL：

- `ENV`: 环境标识（TEST/PROD/local）
- `CI_PROJECT_NAMESPACE`: 项目命名空间
- `CI_APP_NAME`: 应用名称

系统会自动根据这些变量生成正确的 API URL，无需在代码中硬编码。

## 部署至生产环境

### 部署前
1. 检查本地build是否成功，npm run build
2. 检查涉及到的中间件是否可用

### 使用 CICD 部署代码至生产环境

1. 将代码推送至 gitlab 中；
2. 打个新 tag
3. 若不知道如何操作请联系技术人员操作 [修改应用配置](https://cicd.apps.manage.oc4.forchange.cn/#/Projects?projectName=pms&currentCluster=test&currentNamespace=aigcfun) 
  1. 配置路由：运维特征 》 route 
    1. 勾选 disableDefaultRoute；
    2. 新增 routes 配置 路由路径Path=/demo/template, 去掉 strip_path 的勾选
  2. 配置健康检查：运维特征 》 health-probe 
    1. healthProbe /demo/template/api/healthy
  3. 配置配置映射：运维特征 》env-from


## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个模板。
