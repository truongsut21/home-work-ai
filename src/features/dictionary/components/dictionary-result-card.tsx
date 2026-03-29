'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import {
  BookOutlined,
  BulbOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { DictionaryResult } from '../schemas/dictionary.schema';

const { Title, Text, Paragraph } = Typography;

const TEAL = '#0D9488';
const TEAL_LIGHT = '#CCFBF1';
const TEAL_MID = '#14B8A6';

const LEVEL_CONFIG = {
  'Easy': { color: '#059669', bg: '#ECFDF5', border: '#6EE7B7', label: 'Dễ' },
  'Intermediate': { color: '#D97706', bg: '#FFFBEB', border: '#FCD34D', label: 'Trung bình' },
  'Hard': { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', label: 'Khó' },
};

interface DictionaryResultCardProps {
  result: DictionaryResult;
}

export default function DictionaryResultCard({ result }: DictionaryResultCardProps) {
  const levelCfg = LEVEL_CONFIG[result.level] ?? LEVEL_CONFIG['Easy'];

  return (
    <div className="dictionary-result-card fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Word Header ─────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          padding: '24px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle teal orb */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1 }}>
            {/* Word + speak */}
            <div style={{ marginBottom: 6 }}>
              <Title
                level={1}
                style={{ margin: 0, fontSize: 38, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-1px' }}
              >
                {result.word}
              </Title>
            </div>

            {/* Phonetic */}
            <Text style={{ fontSize: 17, color: TEAL, fontStyle: 'italic', fontWeight: 500 }}>
              {result.phonetic}
            </Text>
          </div>

          {/* Level badge */}
          <div style={{
            padding: '6px 16px', borderRadius: 50,
            background: levelCfg.bg, border: `1.5px solid ${levelCfg.border}`,
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <Text style={{ fontSize: 13, fontWeight: 700, color: levelCfg.color }}>
              {levelCfg.label}
            </Text>
          </div>
        </div>
      </div>

      {/* ── Meaning ─────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', borderRadius: 14,
        border: '1px solid #E2E8F0', overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <BookOutlined style={{ color: TEAL, fontSize: 15 }} />
          <Text style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Nghĩa của từ (theo Cô Lành)</Text>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <Paragraph style={{
            margin: 0, fontSize: 14.5, color: '#374151',
            lineHeight: 1.8,
            background: '#F0FDFA',
            padding: '12px 16px', borderRadius: 10,
            borderLeft: `3px solid ${TEAL}`,
          }}>
            {result.meaning}
          </Paragraph>
        </div>
      </div>

      {/* ── Example ─────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', borderRadius: 14,
        border: '1px solid #E2E8F0', overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <MessageOutlined style={{ color: '#8B5CF6', fontSize: 15 }} />
          <Text style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Câu ví dụ nhây bựa của Cô Lành</Text>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            background: '#FAF5FF',
            border: '1px solid #EDE9FE',
            borderRadius: 10, padding: '12px 16px',
          }}>
            <Text style={{ fontSize: 14.5, color: '#3730A3', fontStyle: 'italic', lineHeight: 1.7, display: 'block' }}>
              "{result.example}"
            </Text>
          </div>
        </div>
      </div>

      {/* ── Grammar Notes ────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', borderRadius: 14,
        border: '1px solid #E2E8F0', overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <BulbOutlined style={{ color: '#F59E0B', fontSize: 15 }} />
          <Text style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Lưu ý ngữ pháp</Text>
        </div>
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {result.grammar_notes.map((note, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: '#FAFAFA', border: '1px solid #F1F5F9',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFBEB';
                e.currentTarget.style.borderColor = '#FCD34D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAFAFA';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <Text style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65 }}>{note}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
