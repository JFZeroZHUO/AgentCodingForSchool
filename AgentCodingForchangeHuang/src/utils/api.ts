// API基础路径
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// 获取完整的API路径
export function getApiPath(path: string): string {
  console.log("getApiPath", API_BASE);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

// 通用API请求函数
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// GET请求
export async function apiGet<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const apiUrl = getApiPath(url);
  const queryString = params ? new URLSearchParams(params).toString() : '';
  const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
  
  return apiRequest<T>(fullUrl, { method: 'GET' });
}

// POST请求
export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  const apiUrl = getApiPath(url);
  
  return apiRequest<T>(apiUrl, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT请求
export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  const apiUrl = getApiPath(url);
  
  return apiRequest<T>(apiUrl, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE请求
export async function apiDelete<T = any>(url: string): Promise<T> {
  const apiUrl = getApiPath(url);
  
  return apiRequest<T>(apiUrl, { method: 'DELETE' });
}

// 文件上传请求
export async function apiUpload<T = any>(
  url: string, 
  file: File, 
  onProgress?: (percent: number) => void
): Promise<T> {
  const apiUrl = getApiPath(url);
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', apiUrl);
    xhr.send(formData);
  });
}

// 批量请求
export async function apiBatch<T = any>(
  requests: Array<{ url: string; method?: string; data?: any }>
): Promise<T[]> {
  const promises = requests.map(({ url, method = 'GET', data }) => {
    const apiUrl = getApiPath(url);
    return apiRequest<T>(apiUrl, {
      method,
      body: data ? JSON.stringify(data) : undefined,
    });
  });

  return Promise.all(promises);
}

// 带重试的API请求
export async function apiRequestWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiRequest<T>(url, options);
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError!;
}

// 缓存API请求
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export async function apiRequestWithCache<T = any>(
  url: string,
  options: RequestInit = {},
  ttl: number = 5 * 60 * 1000 // 5分钟
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }

  const data = await apiRequest<T>(url, options);
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl,
  });

  return data;
}

// 清除缓存
export function clearApiCache(pattern?: string): void {
  if (pattern) {
    const keysToDelete: string[] = [];
    cache.forEach((value, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cache.delete(key));
  } else {
    cache.clear();
  }
}

// 错误处理工具
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 响应拦截器
export function createApiClient(baseURL: string = '') {
  return {
    get: <T = any>(url: string, params?: Record<string, any>) => 
      apiGet<T>(`${baseURL}${url}`, params),
    
    post: <T = any>(url: string, data?: any) => 
      apiPost<T>(`${baseURL}${url}`, data),
    
    put: <T = any>(url: string, data?: any) => 
      apiPut<T>(`${baseURL}${url}`, data),
    
    delete: <T = any>(url: string) => 
      apiDelete<T>(`${baseURL}${url}`),
    
    upload: <T = any>(url: string, file: File, onProgress?: (percent: number) => void) => 
      apiUpload<T>(`${baseURL}${url}`, file, onProgress),
  };
}
