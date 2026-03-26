'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMobileMenuOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileMenuOpen(false);
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
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <Layout
        style={{
          marginLeft: isMobile ? 0 : 280,
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
              padding: isMobile ? '10px 12px' : '10px 24px',
              borderBottom: '1px solid var(--border-light)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Mobile hamburger button */}
              {isMobile && (
                <button
                  id="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(true)}
                  className="mobile-menu-btn"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <MenuOutlined />
                </button>
              )}
              <span
                style={{
                  fontSize: isMobile ? 14 : 16,
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
              {/* Hide action pills on mobile, only show New Chat */}
              {!isMobile && (
                <>
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
                </>
              )}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: isMobile ? '8px 14px' : '8px 18px',
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
