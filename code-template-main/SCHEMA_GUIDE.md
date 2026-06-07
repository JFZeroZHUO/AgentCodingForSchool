# Supabase Schema 管理指南

## 📍 表创建位置

在 Supabase 中，表会创建在以下位置：

1. **默认位置**: `public` schema
2. **项目范围**: 您当前连接的 Supabase 项目中
3. **数据库**: PostgreSQL 数据库

## 🗂️ Schema 配置

### 1. 环境变量配置

在 `.env.local` 文件中设置 schema：

```env
# 使用默认 public schema
NEXT_PUBLIC_SUPABASE_SCHEMA=public

# 使用自定义 schema
NEXT_PUBLIC_SUPABASE_SCHEMA=my_app
```

### 2. 创建自定义 Schema

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 创建自定义 schema
CREATE SCHEMA IF NOT EXISTS my_app;

-- 设置默认 schema
SET search_path TO my_app, public;
```

### 3. 在自定义 Schema 中创建表

```sql
-- 在 my_app schema 中创建表
CREATE TABLE my_app.examples (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 代码中的 Schema 使用

### 1. 使用默认 Schema

```typescript
import { query, insert, update } from '@/lib/database';

// 使用环境变量中配置的默认 schema
const examples = await query('examples');
const newExample = await insert('examples', { name: 'Test', description: 'Test desc' });
```

### 2. 指定特定 Schema

```typescript
import { query, insert, update } from '@/lib/database';

// 指定 schema
const examples = await query('examples', { schema: 'my_app' });
const newExample = await insert('examples', { name: 'Test' }, 'my_app');
const updated = await update('examples', { status: 'inactive' }, { id: 1 }, 'my_app');
```

### 3. 动态 Schema 选择

```typescript
import { query } from '@/lib/database';

// 根据环境选择 schema
const schema = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const examples = await query('examples', { schema });
```

## 📊 Schema 管理最佳实践

### 1. 多环境 Schema

```sql
-- 开发环境
CREATE SCHEMA IF NOT EXISTS dev;
CREATE TABLE dev.examples (...);

-- 测试环境
CREATE SCHEMA IF NOT EXISTS test;
CREATE TABLE test.examples (...);

-- 生产环境
CREATE SCHEMA IF NOT EXISTS prod;
CREATE TABLE prod.examples (...);
```

### 2. 功能模块 Schema

```sql
-- 用户模块
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE auth.users (...);

-- 业务模块
CREATE SCHEMA IF NOT EXISTS business;
CREATE TABLE business.orders (...);

-- 系统模块
CREATE SCHEMA IF NOT EXISTS system;
CREATE TABLE system.configs (...);
```

### 3. 权限管理

```sql
-- 为不同 schema 设置权限
GRANT USAGE ON SCHEMA my_app TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA my_app TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA my_app TO authenticated;
```

## 🔍 查看和管理 Schema

### 1. 在 Supabase Dashboard 中查看

1. 进入 Supabase Dashboard
2. 点击左侧菜单 "Table Editor"
3. 在顶部可以看到 schema 选择器
4. 选择不同的 schema 查看对应的表

### 2. 通过 SQL 查询

```sql
-- 查看所有 schema
SELECT schema_name FROM information_schema.schemata;

-- 查看特定 schema 中的表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'my_app';

-- 查看表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'my_app' AND table_name = 'examples';
```

## ⚠️ 注意事项

1. **RLS 策略**: 每个 schema 中的表都需要单独设置 RLS 策略
2. **权限**: 确保用户有访问自定义 schema 的权限
3. **命名冲突**: 避免在不同 schema 中使用相同的表名
4. **性能**: 跨 schema 查询可能影响性能
5. **备份**: 自定义 schema 会包含在数据库备份中

## 🚀 迁移现有数据

如果您想将现有表迁移到自定义 schema：

```sql
-- 1. 创建新 schema
CREATE SCHEMA IF NOT EXISTS my_app;

-- 2. 创建表结构
CREATE TABLE my_app.examples AS SELECT * FROM public.examples;

-- 3. 复制数据
INSERT INTO my_app.examples SELECT * FROM public.examples;

-- 4. 验证数据
SELECT COUNT(*) FROM my_app.examples;
SELECT COUNT(*) FROM public.examples;

-- 5. 删除旧表（谨慎操作）
-- DROP TABLE public.examples;
```

## 📝 示例配置

### 完整的 `.env.local` 配置

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SCHEMA=my_app

# 其他配置...
```

### 完整的表创建脚本

```sql
-- 创建 schema
CREATE SCHEMA IF NOT EXISTS my_app;

-- 设置默认 schema
SET search_path TO my_app, public;

-- 创建表
CREATE TABLE my_app.examples (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设置权限
GRANT USAGE ON SCHEMA my_app TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA my_app TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA my_app TO authenticated;

-- 启用 RLS
ALTER TABLE my_app.examples ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Allow all operations on examples" ON my_app.examples
  FOR ALL USING (true);
```
