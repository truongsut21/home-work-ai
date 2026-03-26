'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const customTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#3B5BFE',
    colorBgBase: '#FAFBFE',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBorder: '#E8ECF4',
    colorText: '#1A1D2E',
    colorTextSecondary: '#64748B',
    borderRadius: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    colorLink: '#3B5BFE',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      bodyBg: '#FAFBFE',
      headerBg: '#FFFFFF',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#EEF1FF',
      itemSelectedColor: '#3B5BFE',
      itemHoverBg: '#F5F6FA',
      itemColor: '#64748B',
    },
    Button: {
      primaryShadow: '0 4px 16px rgba(59, 91, 254, 0.25)',
      borderRadius: 14,
    },
    Input: {
      activeBorderColor: '#3B5BFE',
      hoverBorderColor: '#6B8AFF',
      colorBgContainer: '#FFFFFF',
    },
    Tooltip: {
      colorBgSpotlight: '#1A1D2E',
      borderRadius: 10,
    },
  },
};

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={customTheme}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
