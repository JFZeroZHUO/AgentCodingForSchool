"use client";
import React from 'react';
import { Layout } from 'antd';
import AppHeader from '@/components/Header';
import ExampleList from '@/components/ExampleList';

const { Content } = Layout;

export default function ExamplesPage() {
  return (
    <>
      <AppHeader title="示例管理" />
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <ExampleList title="示例数据管理" />
      </Content>
    </>
  );
}
