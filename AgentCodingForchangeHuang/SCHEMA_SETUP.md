# Schema 设置指南

## 🎯 目标
在 Supabase 中创建 `next_template_demo` schema 和所需的表结构。

## 📋 步骤

### 1. 登录 Supabase Dashboard
1. 访问 https://supabase.com/dashboard
2. 登录您的账户
3. 选择您的项目

### 2. 执行 SQL 脚本
1. 在左侧菜单中点击 **"SQL Editor"**
2. 点击 **"New query"** 创建新查询
3. 复制 `create-schema.sql` 文件的内容
4. 粘贴到 SQL Editor 中
5. 点击 **"Run"** 执行脚本

### 3. 验证创建结果
执行完成后，您应该看到：
- `Schema created successfully` 消息
- 三个表名：`examples`, `file_uploads`, `system_configs`

### 4. 检查表结构
在左侧菜单中点击 **"Table Editor"**，您应该能看到：
- `next_template_demo` schema
- 三个表：`examples`, `file_uploads`, `system_configs`

## 🔧 手动创建（如果自动创建失败）

如果 SQL 脚本执行失败，您可以手动创建：

### 1. 创建 Schema
```sql
CREATE SCHEMA IF NOT EXISTS next_template_demo;
```

### 2. 创建表
```sql
-- 示例表
CREATE TABLE next_template_demo.examples (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文件上传表
CREATE TABLE next_template_demo.file_uploads (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100),

  upload_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE next_template_demo.system_configs (
  id BIGSERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. 设置权限
```sql
GRANT USAGE ON SCHEMA next_template_demo TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA next_template_demo TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA next_template_demo TO authenticated;
```

### 4. 启用 RLS
```sql
ALTER TABLE next_template_demo.examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_template_demo.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_template_demo.system_configs ENABLE ROW LEVEL SECURITY;
```

### 5. 创建策略
```sql
CREATE POLICY "Allow all operations on examples" ON next_template_demo.examples
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on file_uploads" ON next_template_demo.file_uploads
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on system_configs" ON next_template_demo.system_configs
  FOR ALL USING (true);
```

## ✅ 验证设置

创建完成后，运行以下命令验证：

```bash
npm run init-db
```

您应该看到：
- ✅ Supabase 连接测试成功
- ✅ 所有表验证成功
- ✅ 默认配置插入成功

## 🚨 常见问题

### 1. 权限错误
如果遇到权限错误，确保：
- 您有项目的管理员权限
- 使用的是正确的项目

### 2. Schema 已存在
如果 schema 已存在，脚本会跳过创建，这是正常的。

### 3. 表已存在
如果表已存在，脚本会跳过创建，这是正常的。

### 4. 策略已存在
如果策略已存在，会报错，可以忽略或手动删除后重新创建。

## 📞 需要帮助？

如果遇到问题，请检查：
1. Supabase 项目 URL 和密钥是否正确
2. 网络连接是否正常
3. 项目权限是否足够
