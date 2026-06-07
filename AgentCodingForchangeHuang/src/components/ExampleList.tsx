'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Modal, 
  Form, 
  message, 
  Tag,
  Typography 
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Example, ApiResponse } from '@/types';
import { apiGet, apiPost } from '@/utils/api';

const { Title } = Typography;
const { Option } = Select;

interface ExampleListProps {
  title?: string;
}

const ExampleList: React.FC<ExampleListProps> = ({ title = '示例列表' }) => {
  const [data, setData] = useState<Example[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取数据
  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params: any = { page, pageSize };
      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;

      const response = await apiGet<ApiResponse<{
        data: Example[];
        pagination: {
          current: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
      }>>('/api/examples', params);

      if (response.success && response.data) {
        setData(response.data.data);
        setPagination({
          current: response.data.pagination.current,
          pageSize: response.data.pagination.pageSize,
          total: response.data.pagination.total,
        });
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建示例
  const handleCreate = async (values: any) => {
    try {
      const response = await apiPost<ApiResponse>('/api/examples', values);
      if (response.success) {
        message.success('创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchData();
      }
    } catch (error) {
      message.error('创建失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '活跃' },
          inactive: { color: 'orange', text: '非活跃' },
          deleted: { color: 'red', text: '已删除' },
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.inactive;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  // 搜索处理
  const handleSearch = () => {
    fetchData(1, pagination.pageSize);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    setStatusFilter('');
    fetchData(1, pagination.pageSize);
  };

  // 分页处理
  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card title={title}>
      {/* 搜索和操作区域 */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索名称或描述"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="选择状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="active">活跃</Option>
            <Option value="inactive">非活跃</Option>
            <Option value="deleted">已删除</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchData(pagination.current, pagination.pageSize)}
          >
            刷新
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新建
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />

      {/* 创建模态框 */}
      <Modal
        title="新建示例"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea 
              placeholder="请输入描述" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Select>
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ExampleList;
