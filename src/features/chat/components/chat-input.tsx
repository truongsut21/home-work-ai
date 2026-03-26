'use client';

import React, { useState } from 'react';
import { Input, Button, Tooltip } from 'antd';
import {
  SendOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  AudioOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <div
      className="fade-in-up fade-in-up-delay-7"
      style={{
        padding: '12px 24px 24px',
        background: 'linear-gradient(180deg, transparent 0%, var(--bg-primary) 30%)',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: '0 auto',
        }}
      >
        {/* Main input container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#FFFFFF',
            borderRadius: 24,
            border: `1.5px solid ${isFocused ? 'rgba(59, 91, 254, 0.3)' : 'var(--border)'}`,
            boxShadow: isFocused
              ? '0 8px 32px rgba(59, 91, 254, 0.1), 0 0 0 3px rgba(59, 91, 254, 0.06)'
              : '0 4px 20px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
          }}
        >
          {/* Text input area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              padding: '14px 16px 8px 20px',
            }}
          >
            <TextArea
              id="chat-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="✨ Ask me anything..."
              autoSize={{ minRows: 1, maxRows: 5 }}
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '4px 0',
                fontSize: 14.5,
                resize: 'none',
                boxShadow: 'none',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Bottom action bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px 10px 14px',
            }}
          >
            {/* Left actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Source selector */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--bg-primary)';
                }}
              >
                Select Source <DownOutlined style={{ fontSize: 9 }} />
              </button>

              {/* Attach */}
              <Tooltip title="Đính kèm file">
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <PaperClipOutlined />
                </button>
              </Tooltip>

              {/* Voice */}
              <Tooltip title="Ghi âm giọng nói">
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-sidebar-hover)';
                    e.currentTarget.style.color = 'var(--pink)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <AudioOutlined />
                </button>
              </Tooltip>
            </div>

            {/* Send button */}
            <Button
              id="send-button"
              type="primary"
              icon={isLoading ? <LoadingOutlined spin /> : <SendOutlined />}
              onClick={handleSend}
              disabled={!hasValue || isLoading}
              style={{
                height: 38,
                width: 38,
                minWidth: 38,
                borderRadius: 12,
                background:
                  hasValue && !isLoading
                    ? 'var(--accent-gradient)'
                    : '#E5E7EB',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  hasValue && !isLoading
                    ? 'var(--shadow-accent)'
                    : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
              }}
            />
          </div>
        </div>

        {/* Footer text */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 11,
            color: 'var(--text-muted)',
            letterSpacing: '0.2px',
          }}
        >
          Centra may display inaccurate info, so please double check the response.{' '}
          <span
            style={{
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
          >
            Your Privacy & Orbita GPT
          </span>
        </div>
      </div>
    </div>
  );
}
