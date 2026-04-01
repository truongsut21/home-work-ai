'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import Sidebar from '@/components/layout/sidebar';
import FuelChatWindow from '@/features/fuel/components/fuel-chat-window';
import FuelChatInput from '@/features/fuel/components/fuel-chat-input';

const { Content } = Layout;

export default function GiaXangPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    messages,
    status,
    sendMessage: chatSendMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/gia-xang',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const sendMessage = useCallback(
    (content: string) => {
      chatSendMessage({ text: content });
    },
    [chatSendMessage],
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const handleSelectConversation = (id: string) => {
    router.push(`/?c=${id}`);
    setMobileMenuOpen(false);
  };

  const handleNewConversation = () => {
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
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
          background: 'var(--bg-primary)',
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
              borderBottom: '1px solid var(--border-light)',
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isMobile && (
                <button
                  id="gas-mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    width: 38, height: 38, borderRadius: 12,
                    border: '1px solid var(--border-light)',
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
              <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                ⛽ Giá Xăng — Cô Kiều
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: '#FF6B6B', background: '#FEF2F2',
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
              }}>
                AI Tool
              </span>
            </div>
          </div>

          {/* Chat area */}
          <FuelChatWindow messages={messages as any} isLoading={isLoading} onSend={sendMessage} />
          <FuelChatInput onSend={sendMessage} isLoading={isLoading} />
        </Content>
      </Layout>
    </Layout>
  );
}
