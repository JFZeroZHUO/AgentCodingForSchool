# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册/登录
2. 点击 "New Project" 创建新项目
3. 选择组织，输入项目名称和数据库密码
4. 选择区域（建议选择离您最近的区域）
5. 等待项目创建完成

## 2. 获取项目配置

1. 在项目 Dashboard 中，点击左侧菜单的 "Settings" -> "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: 以 `eyJ...` 开头的长字符串

## 3. 配置环境变量

1. 复制 `env.example` 为 `.env.local`：
   ```bash
   cp env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入您的 Supabase 配置：
   ```env
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 4. 创建数据库表

1. 在 Supabase Dashboard 中，点击左侧菜单的 "SQL Editor"
2. 复制 `supabase-schema.sql` 文件中的内容
3. 粘贴到 SQL Editor 中并点击 "Run" 执行

或者您可以手动创建表：

### examples 表
```sql
CREATE TABLE examples (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### file_uploads 表
```sql
CREATE TABLE file_uploads (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100),

  upload_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### system_configs 表
```sql
CREATE TABLE system_configs (
  id BIGSERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. 设置 Row Level Security (RLS)

Supabase 默认启用 RLS，您需要创建策略来允许数据访问：

```sql
-- 允许所有操作（开发环境）
CREATE POLICY "Allow all operations on examples" ON examples
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on file_uploads" ON file_uploads
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on system_configs" ON system_configs
  FOR ALL USING (true);
```

## 6. 测试连接

运行初始化脚本测试连接：

```bash
npm run init-db
```

## 7. 启动开发服务器

```bash
npm run dev
```

## 注意事项

1. **安全性**: 在生产环境中，请根据您的需求调整 RLS 策略
2. **API 密钥**: `anon key` 是公开的，可以安全地在前端使用
3. **服务端**: 如果需要服务端操作，请使用 `service_role key`（仅在服务端使用）
4. **实时功能**: Supabase 支持实时订阅，您可以启用实时功能
5. **存储**: Supabase 提供文件存储功能，用于文件上传和管理

## 故障排除

### 连接错误
- 检查环境变量是否正确设置
- 确认项目 URL 和 API 密钥是否正确
- 检查网络连接

### 表不存在错误
- 确保已在 SQL Editor 中执行了表创建语句
- 检查表名是否正确
- 确认 RLS 策略已创建

### 权限错误
- 检查 RLS 策略是否正确设置
- 确认 API 密钥有效
- 检查表权限设置
