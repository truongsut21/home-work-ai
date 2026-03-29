'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Button, Typography, Popconfirm, Tooltip } from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  EllipsisOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Sider } = Layout;
const { Text } = Typography;

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  isMobile?: boolean;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  /** When false, hides conversation panel (New Chat + history). Icon strip only. */
  showPanel?: boolean;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isMobile = false,
  mobileMenuOpen = false,
  onCloseMobileMenu,
  showPanel = true,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState(0);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDeleteConversation?.(id);
  };

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, mobileMenuOpen]);

  const router = useRouter();
  const pathname = usePathname();

  // Navigation icons with routes
  const navIcons = [
    { icon: <MessageOutlined />, label: 'Chat', route: '/' },
    { icon: <BookOutlined />, label: 'Từ điển Cô Lành', route: '/tu-dien' },
  ];

  const getNavActive = (route: string | null) => {
    if (!route) return false;
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  };

  const renderConversationItem = (conv: Conversation, index: number) => {
    const isActive = activeConversationId === conv.id;
    const isHovered = hoveredId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv.id)}
        onMouseEnter={() => setHoveredId(conv.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="fade-in-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: isMobile ? '12px 14px' : '10px 12px',
          borderRadius: 12,
          cursor: 'pointer',
          background: isActive
            ? 'var(--accent-soft)'
            : isHovered
              ? 'var(--bg-sidebar-hover)'
              : 'transparent',
          transition: 'all 0.2s ease',
          animationDelay: `${index * 0.05}s`,
          position: 'relative',
        }}
      >
        {/* Colored letter icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: isActive
              ? 'var(--accent-gradient)'
              : `hsl(${(conv.title.charCodeAt(0) * 37) % 360}, 70%, 94%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            fontSize: isMobile ? 14 : 13,
            fontWeight: 700,
            color: isActive
              ? '#FFFFFF'
              : `hsl(${(conv.title.charCodeAt(0) * 37) % 360}, 60%, 45%)`,
          }}
        >
          {conv.title.charAt(0).toUpperCase()}
        </div>
        <>
          <Text
            ellipsis
            style={{
              flex: 1,
              fontSize: isMobile ? 14 : 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
              transition: 'color 0.2s ease',
            }}
          >
            {conv.title}
          </Text>
          {(isHovered || isActive) && (
            <div style={{ display: 'flex', gap: 2, animation: 'fadeIn 0.2s ease' }}>
              <Tooltip title="Tùy chọn">
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--border-light)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <EllipsisOutlined />
                </button>
              </Tooltip>
              <Popconfirm
                title="Xóa cuộc trò chuyện này?"
                onConfirm={(e) =>
                  handleDelete(conv.id, e as unknown as React.MouseEvent)
                }
                okText="Xóa"
                cancelText="Hủy"
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEF2F2';
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          )}
        </>
      </div>
    );
  };

  // ============ MOBILE MODAL RENDER ============
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          className={`mobile-sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`}
          onClick={onCloseMobileMenu}
        />

        {/* Modal sidebar */}
        <div className={`mobile-sidebar-modal ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Modal Header */}
          <div className="mobile-sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-accent)',
                }}
              >
                <span style={{ fontSize: 18 }}>👩‍💻</span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  Cô Minh English
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}
                >
                  Trợ lý AI tiếng Anh
                </div>
              </div>
            </div>
            <button
              id="mobile-menu-close"
              className="mobile-close-btn"
              onClick={onCloseMobileMenu}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Quick nav icons - horizontal on mobile */}
          <div className="mobile-nav-strip">
            {navIcons.map((nav, i) => (
              <button
                key={i}
                className={`mobile-nav-item ${getNavActive(nav.route) ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav(i);
                  if (nav.route) { router.push(nav.route); onCloseMobileMenu?.(); }
                }}
              >
                <span className="mobile-nav-icon">{nav.icon}</span>
                <span className="mobile-nav-label">{nav.label}</span>
              </button>
            ))}
          </div>

          {/* New Chat Button — chat page only */}
          {showPanel && (
            <div style={{ padding: '0 16px', marginBottom: 8 }}>
              <Button
                type="primary"
                onClick={onNewConversation}
                block
                icon={<PlusOutlined />}
                style={{
                  height: 48,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  boxShadow: 'var(--shadow-accent)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Cuộc trò chuyện mới
              </Button>
            </div>
          )}

          {/* Conversation history — chat page only */}
          {showPanel && (
            <>
              <div
                style={{
                  padding: '12px 20px 6px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Lịch sử trò chuyện
              </div>
              <div className="mobile-conversation-list">
                {conversations.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 20px',
                      color: 'var(--text-muted)',
                      gap: 8,
                    }}
                  >
                    <MessageOutlined style={{ fontSize: 32, opacity: 0.4 }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      Chưa có cuộc trò chuyện nào
                    </span>
                  </div>
                ) : (
                  conversations.map((conv, i) => renderConversationItem(conv, i))
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // ============ DESKTOP RENDER ============
  return (
    <Sider
      collapsible
      collapsed={collapsed || !showPanel}
      onCollapse={(c) => { if (showPanel) setCollapsed(c); }}
      width={280}
      collapsedWidth={60}
      trigger={null}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>

        {/* Left icon strip */}
        <div
          style={{
            width: 60,
            background: 'var(--bg-primary)',
            borderRight: showPanel ? '1px solid var(--border-light)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0',
            gap: 4,
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: 42, height: 42, borderRadius: 14,
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12, boxShadow: 'var(--shadow-accent)',
              cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08) rotate(5deg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
          >
            <span style={{ fontSize: 20 }}>👩‍💻</span>
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: 12, height: 12, borderRadius: '50%',
              background: '#10B981', border: '2px solid var(--bg-primary)',
            }} />
          </div>

          {/* Nav icons */}
          {navIcons.map((nav, i) => (
            <Tooltip key={i} title={nav.label} placement="right">
              <button
                className={`nav-icon-btn ${getNavActive(nav.route) ? 'active' : ''}`}
                onClick={() => { setActiveNav(i); if (nav.route) router.push(nav.route); }}
                style={{ animationDelay: `${i * 0.08}s`, position: 'relative' }}
              >
                {nav.icon}
                {nav.route === '/tu-dien' && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#10B981', border: '1.5px solid var(--bg-primary)',
                  }} />
                )}
              </button>
            </Tooltip>
          ))}

        </div>

        {/* Right conversation panel — only on chat page (showPanel=true) */}
        {showPanel && !collapsed && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            padding: '16px 8px', animation: 'slideInLeft 0.3s ease', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 8px', marginBottom: 6,
            }}>
              <Text style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Chat
              </Text>
              <Tooltip title="Tìm kiếm">
                <button
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: 'none',
                    background: 'transparent', color: 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <SearchOutlined style={{ fontSize: 14 }} />
                </button>
              </Tooltip>
            </div>

            {/* New Chat Button */}
            <Button
              type="primary"
              onClick={onNewConversation}
              block
              style={{
                margin: '6px 4px 16px', height: 42,
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-gradient)',
                border: 'none', fontWeight: 600, fontSize: 13.5,
                boxShadow: 'var(--shadow-accent)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 91, 254, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>New Chat</span>
            </Button>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 2 }}>
              {conversations.map((conv, i) => renderConversationItem(conv, i))}
            </div>
          </div>
        )}

      </div>
    </Sider>
  );
}
