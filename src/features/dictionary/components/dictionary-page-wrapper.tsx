'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import DictionaryClient from './dictionary-client';

const { Content } = Layout;

export default function DictionaryPageWrapper() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  // When user clicks a conversation → navigate back to chat
  const handleSelectConversation = (id: string) => {
    router.push(`/?c=${id}`);
    setMobileMenuOpen(false);
  };

  const handleNewConversation = () => {
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      <Sidebar
        conversations={[]}
        activeConversationId={null}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        showPanel={false}
      />

      <Layout
        style={{
          marginLeft: isMobile ? 0 : 60,
          transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#F1F5F9',
        }}
      >
        <Content
          className="page-fade-in"
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top bar */}
          <div
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '10px 12px' : '10px 24px',
              borderBottom: '1px solid #E2E8F0',
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isMobile && (
                <button
                  id="dict-mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    width: 38, height: 38, borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, transition: 'all 0.2s ease', flexShrink: 0,
                  }}
                >
                  <MenuOutlined />
                </button>
              )}
              <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: '#0F172A' }}>
                Từ điển Cô Lành
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: 'var(--accent)', background: 'var(--accent-soft)',
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
              }}>
                AI-Powered
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 500 }}>
              <span style={{ fontSize: 9, color: '#10B981' }}>●</span>
              Cô Lành đang online
            </div>
          </div>

          {/* Dictionary Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DictionaryClient />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
