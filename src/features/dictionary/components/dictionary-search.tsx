'use client';

import React, { useState, useRef } from 'react';
import { Input, Typography } from 'antd';
import { SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Text } = Typography;


// ── Teal palette for dictionary ──────────────────────────────
const TEAL = '#0D9488';
const TEAL_LIGHT = '#CCFBF1';
const TEAL_MID = '#14B8A6';

interface DictionarySearchProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
}

export default function DictionarySearch({ onSearch, isLoading }: DictionarySearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<any>(null);

  const handleSearch = () => {
    if (inputValue.trim() && !isLoading) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSuggestion = (word: string) => {
    setInputValue(word);
    setCharCount(word.length);
    setTimeout(() => onSearch(word), 50);
  };

  const canSearch = !isLoading && inputValue.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Search Box */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '20px 20px',
          border: `1.5px solid ${focused ? TEAL : '#E2E8F0'}`,
          boxShadow: focused ? `0 0 0 3px ${TEAL_LIGHT}` : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
        }}
      >
        <Text
          style={{
            display: 'block',
            fontWeight: 700,
            fontSize: 14,
            color: '#1E293B',
            marginBottom: 4,
          }}
        >
          📖 Tra cứu từ vựng
        </Text>
        <Text
          style={{
            display: 'block',
            fontSize: 12,
            color: '#94A3B8',
            marginBottom: 14,
          }}
        >
          Nhập từ tiếng Anh để xem nghĩa và giải thích chi tiết
        </Text>

        {/* Input */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Input
            ref={inputRef}
            id="dictionary-search-input"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="VD: serendipity, ephemeral..."
            size="large"
            disabled={isLoading}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${focused ? TEAL : '#E2E8F0'}`,
              background: '#F8FAFC',
              fontSize: 15,
              color: '#1E293B',
              padding: '10px 52px 10px 16px',
              transition: 'all 0.2s ease',
              boxShadow: 'none',
            }}
          />
          {charCount > 0 && (
            <Text
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 11,
                color: '#CBD5E1',
                pointerEvents: 'none',
              }}
            >
              {charCount}
            </Text>
          )}
        </div>

        <Text style={{ display: 'block', fontSize: 11.5, color: '#94A3B8', marginBottom: 14 }}>
          Nhấn <kbd style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '1px 6px', borderRadius: 5, fontSize: 10, color: '#64748B' }}>Enter</kbd> để tra cứu
        </Text>

        {/* Search Button */}
        <button
          id="dictionary-search-btn"
          onClick={handleSearch}
          disabled={!canSearch}
          style={{
            width: '100%',
            height: 46,
            borderRadius: 12,
            border: 'none',
            background: canSearch
              ? `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_MID} 100%)`
              : '#F1F5F9',
            color: canSearch ? '#FFFFFF' : '#94A3B8',
            fontSize: 14,
            fontWeight: 600,
            cursor: canSearch ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.25s ease',
            boxShadow: canSearch ? '0 4px 14px rgba(13,148,136,0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (canSearch) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(13,148,136,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = canSearch ? '0 4px 14px rgba(13,148,136,0.3)' : 'none';
          }}
        >
          <SearchOutlined />
          {isLoading ? 'Cô Lành đang tra...' : 'Tra cứu'}
        </button>
      </div>
    </div>
  );
}
