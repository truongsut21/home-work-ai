'use client';

import React from 'react';
import { useDictionary } from '../hooks/use-dictionary';
import DictionarySearch from './dictionary-search';
import DictionaryResultCard from './dictionary-result-card';
import DictionarySkeleton from './dictionary-skeleton';

export default function DictionaryClient() {
  const { result, isLoading, lookup } = useDictionary();

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left Panel — Search (1/3 width) */}
      <div
        style={{
          width: '33.333%',
          flexShrink: 0,
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px',
          overflowY: 'auto',
          background: '#F8FAFC',
        }}
      >
        {/* Branding */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 800,
            color: '#0F172A', lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Từ điển Cô Lành
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, marginBottom: 0 }}>
            Học từ vựng theo phong cách vui nhộn ✨
          </p>
        </div>

        <DictionarySearch onSearch={lookup} isLoading={isLoading} />
      </div>

      {/* Right Panel — Result (2/3 width) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 36px',
          display: 'flex',
          flexDirection: 'column',
          background: '#F1F5F9',
        }}
      >
        {isLoading ? (
          <DictionarySkeleton />
        ) : result ? (
          <DictionaryResultCard result={result} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="fade-in"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
        padding: '60px 20px',
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 4 }}>📖</div>

      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
        Chào mừng đến Từ điển Cô Lành!
      </h2>
      <p
        style={{
          fontSize: 14.5,
          color: '#64748B',
          maxWidth: 400,
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        Enter any English word in the search box on the left.
        Ms. Quynh will guide you with clear explanations, correct grammar, and engaging examples to help you understand effectively.
      </p>


    </div>
  );
}
