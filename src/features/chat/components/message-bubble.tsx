'use client';

import React, { useState } from 'react';
import { Typography, Avatar, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined, CheckOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  index?: number;
}

export default function MessageBubble({ role, content, index = 0 }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 24,
        padding: '0 24px',
        animation: `fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1) ${Math.min(index * 0.06, 0.3)}s both`,
      }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div style={{ position: 'relative' }}>
          <Avatar
            size={40}
            icon={<RobotOutlined />}
            style={{
              background: 'linear-gradient(145deg, #6B8AFF, #3B5BFE)',
              flexShrink: 0,
              marginTop: 4,
              boxShadow: '0 4px 14px rgba(59, 91, 254, 0.25)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          {/* Online indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 2,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #FFFFFF',
            }}
          />
        </div>
      )}

      {/* Message content */}
      <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            padding: '16px 22px',
            borderRadius: isUser ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
            background: isUser
              ? 'linear-gradient(135deg, #3B5BFE 0%, #6B8AFF 100%)'
              : '#FFFFFF',
            color: isUser ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: isUser
              ? '0 4px 18px rgba(59, 91, 254, 0.25)'
              : 'var(--shadow-md)',
            border: isUser ? 'none' : '1px solid var(--border-light)',
            wordBreak: 'break-word',
            lineHeight: 1.75,
            fontSize: 14,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
            position: 'relative',
          }}
        >
          {/* Shimmer effect on hover for assistant messages */}
          {!isUser && isHovered && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                background: 'linear-gradient(90deg, transparent 30%, rgba(59, 91, 254, 0.02) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          )}
          <Text
            style={{
              color: isUser ? '#FFFFFF' : 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {content}
          </Text>
        </div>

        {/* Action buttons (visible on hover) */}
        {isHovered && (
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.2s ease-out',
              paddingLeft: isUser ? 0 : 4,
              paddingRight: isUser ? 4 : 0,
            }}
          >
            <Tooltip title={copied ? 'Đã copy!' : 'Copy'}>
              <button
                onClick={handleCopy}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: 'none',
                  background: copied ? 'var(--green-soft)' : 'var(--bg-sidebar-hover)',
                  color: copied ? 'var(--green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  transition: 'all 0.2s ease',
                }}
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </Tooltip>
            {!isUser && (
              <>
                <Tooltip title="Thích">
                  <button
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: 'none',
                      background: 'var(--bg-sidebar-hover)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-soft)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <LikeOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Không thích">
                  <button
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: 'none',
                      background: 'var(--bg-sidebar-hover)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FEF2F2';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <DislikeOutlined />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <Avatar
          size={40}
          icon={<UserOutlined />}
          style={{
            background: 'linear-gradient(145deg, #10B981, #34D399)',
            flexShrink: 0,
            marginTop: 4,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      )}
    </div>
  );
}
