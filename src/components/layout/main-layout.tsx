'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: (props: {
    activeConversationId: string | null;
    onConversationCreated: (id: string) => void;
  }) => React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const handleNewConversation = () => {
    setActiveConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      <Layout
        style={{
          marginLeft: 280,
          transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'var(--bg-primary)',
        }}
      >
        <Content
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background elements */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 91, 254, 0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top bar */}
          <div
            className="glass fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 24px',
              borderBottom: '1px solid var(--border-light)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Cô Minh English
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  background: 'var(--accent-soft)',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.3px',
                }}
              >
                Plus
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="action-pill"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  gap: 6,
                }}
              >
                ⚙️ Configuration
              </button>
              <button
                className="action-pill"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  gap: 6,
                }}
              >
                📤 Share
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'var(--accent-gradient)',
                  color: '#FFFFFF',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: 'var(--shadow-accent)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 91, 254, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                }}
              >
                New Chat ✨
              </button>
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
            {children({
              activeConversationId,
              onConversationCreated: handleConversationCreated,
            })}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
