import { NextRequest, NextResponse } from 'next/server';
import { query, count, insert } from '@/lib/database';
import { Example, ApiResponse } from '@/types';

// GET /api/examples - 获取示例列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // 构建过滤器
    const filters: Record<string, any> = {};
    if (status) {
      filters.status = status;
    }

    // 获取总数
    const total = await count('examples', filters);

    // 获取数据
    const offset = (page - 1) * pageSize;
    const data = await query('examples', {
      filters,
      orderBy: { column: 'created_at', ascending: false },
      limit: pageSize,
      offset
    });

    console.log(data);
    // 如果有搜索条件，需要手动过滤
    let filteredData = data as Example[];
    if (search) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const response: ApiResponse<{
      data: Example[];
      pagination: {
        current: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }> = {
      success: true,
      message: '获取示例列表成功',
      data: {
        data: filteredData,
        pagination: {
          current: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('获取示例列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取示例列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/examples - 创建示例
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, status = 'active' } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: '名称不能为空' },
        { status: 400 }
      );
    }

    const result = await insert('examples', {
      name,
      description,
      status
    });

    const response: ApiResponse<{ id: number }> = {
      success: true,
      message: '创建示例成功',
      data: { id: result.id },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('创建示例失败:', error);
    return NextResponse.json(
      { success: false, message: '创建示例失败' },
      { status: 500 }
    );
  }
}
