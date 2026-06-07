// 基础实体类型
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// 示例实体类型
export interface Example extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
}

// 文件上传类型
export interface FileUpload extends BaseEntity {
  filename: string;
  original_name: string;
  file_size: number;
  mime_type?: string;

  upload_time: string;
}

// 系统配置类型
export interface SystemConfig extends BaseEntity {
  config_key: string;
  config_value?: string;
  description?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 查询参数类型
export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'image' | 'checkbox' | 'radio';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// 表单类型
export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  created_at: string;
  updated_at: string;
}

// 用户类型（如果需要用户系统）
export interface User extends BaseEntity {
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'banned';
  last_login?: string;
}

// 日志类型
export interface Log extends BaseEntity {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}

// 权限类型
export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// 角色类型
export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: string[];
}

// 通知类型
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: number;
  read: boolean;
  read_at?: string;
}

// 统计数据类型
export interface Statistics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number; // 增长率
}

// 图表数据类型
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// 时间范围类型
export interface TimeRange {
  start: string;
  end: string;
}



// 上传文件类型
export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  thumbUrl?: string;
  size?: number;
  type?: string;
  response?: any;
  error?: any;
}

// 表格列类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: any) => boolean;
}

// 操作按钮类型
export interface ActionButton {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  disabled?: boolean;
  onClick: (record: any) => void;
  permission?: string;
}
