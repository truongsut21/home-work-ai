'use client';

import React, { useState } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface FuelChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function FuelChatInput({ onSend, isLoading }: FuelChatInputProps) {
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
      style={{
        padding: '12px 24px 24px',
        background: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 5,
        flexShrink: 0,
      }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            background: '#FFFFFF',
            borderRadius: 20,
            border: `1.5px solid ${isFocused ? 'rgba(255, 107, 107, 0.4)' : 'var(--border)'}`,
            boxShadow: isFocused
              ? '0 8px 32px rgba(255, 107, 107, 0.1), 0 0 0 3px rgba(255, 107, 107, 0.06)'
              : '0 4px 20px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '12px 14px 12px 20px',
          }}
        >
          <TextArea
            id="fuel-chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="⛽ Hỏi Cô Kiều về giá xăng..."
            autoSize={{ minRows: 1, maxRows: 4 }}
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
          <Tooltip title="Gửi">
            <Button
              id="fuel-send-button"
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
                    ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
                    : '#E5E7EB',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  hasValue && !isLoading
                    ? '0 4px 14px rgba(255, 107, 107, 0.3)'
                    : 'none',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            />
          </Tooltip>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 8,
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          Dữ liệu giá xăng được lấy từ PVOIL ⛽
        </div>
      </div>
    </div>
  );
}
