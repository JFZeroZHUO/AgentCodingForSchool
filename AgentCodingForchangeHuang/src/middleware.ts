import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 中间件配置
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 添加安全头
  const response = NextResponse.next();
  
  // 安全头设置
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 如果是生产环境，添加更多安全头
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // API路由的CORS处理
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // 处理OPTIONS请求（预检请求）
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  // 日志记录（可选）
  if (process.env.NODE_ENV === 'development') {
    console.log(`${request.method} ${pathname} - ${new Date().toISOString()}`);
  }

  // 维护模式检查（可选）
  if (process.env.MAINTENANCE_MODE === 'true' && !pathname.startsWith('/api/health')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return response;
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了以下路径：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
