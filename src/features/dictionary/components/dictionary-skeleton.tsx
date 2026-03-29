'use client';

import React from 'react';
import { Skeleton, Card } from 'antd';

export default function DictionarySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header Skeleton */}
      <Card
        style={{ borderRadius: 20, border: '1px solid var(--border-light)' }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Skeleton.Input
              active
              style={{ width: 220, height: 48, borderRadius: 10, marginBottom: 12 }}
            />
            <br />
            <Skeleton.Input
              active
              style={{ width: 100, height: 22, borderRadius: 6 }}
            />
          </div>
          <Skeleton.Button
            active
            style={{ width: 100, height: 38, borderRadius: 50 }}
          />
        </div>
      </Card>

      {/* Meaning Skeleton */}
      <Card
        style={{ borderRadius: 16, border: '1px solid var(--border-light)' }}
        styles={{ body: { padding: '18px 20px' } }}
      >
        <Skeleton active paragraph={{ rows: 2 }} title={{ width: 160 }} />
      </Card>

      {/* Example Skeleton */}
      <Card
        style={{ borderRadius: 16, border: '1px solid var(--border-light)' }}
        styles={{ body: { padding: '18px 20px' } }}
      >
        <Skeleton active paragraph={{ rows: 2 }} title={{ width: 200 }} />
      </Card>

      {/* Grammar Notes Skeleton */}
      <Card
        style={{ borderRadius: 16, border: '1px solid var(--border-light)' }}
        styles={{ body: { padding: '18px 20px' } }}
      >
        <Skeleton active paragraph={{ rows: 3 }} title={{ width: 140 }} />
      </Card>

      {/* Loading hint */}
      <div
        className="dict-loading-hint"
        style={{
          textAlign: 'center',
          padding: '8px 0',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}
      >
        🧠 Cô Lành đang suy nghĩ...
      </div>
    </div>
  );
}
