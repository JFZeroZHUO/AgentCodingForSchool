'use client';

import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backUrl?: string;
  extra?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = 'Next.js基础项目模板', 
  showBack = false, 
  backUrl = '/',
  extra 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginRight: 16 }}
          >
            返回
          </Button>
        )}
        
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {title}
          </Title>
        </Link>
      </div>

      <Space>
        <Link href="/" passHref>
          <Button type="text" icon={<HomeOutlined />}>
            首页
          </Button>
        </Link>
        {extra}
      </Space>
    </AntHeader>
  );
};

export default AppHeader;
