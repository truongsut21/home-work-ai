'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: (props: {
    activeConversationId: string | null;
    onConversationCreated: (id: string, title?: string) => void;
  }) => React.ReactNode;
  initialConversationId?: string | null;
}

export default function MainLayout({ children, initialConversationId }: MainLayoutProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId ?? null);
  const [conversations, setConversations] = useState<{ id: string; title: string; createdAt: string; updatedAt: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hasFetched = useRef(false);

  // Fetch conversations once on mount (useRef prevents StrictMode double-fetch)
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch('/api/conversations')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setConversations(data))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth <= 768); };
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const handleDeleteConversation = async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) setActiveConversationId(null);
    } catch { }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMobileMenuOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileMenuOpen(false);
  };

  const handleConversationCreated = (id: string, title?: string) => {
    setActiveConversationId(id);
    const newEntry = {
      id,
      title: title ?? 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.find((c) => c.id === id) ? prev : [newEntry, ...prev]
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <Layout
        style={{
          marginLeft: mounted ? (isMobile ? 0 : 280) : 280,
          transition: mounted ? 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          background: 'var(--bg-primary)',
        }}
      >
        <Content
          className="page-fade-in"
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
