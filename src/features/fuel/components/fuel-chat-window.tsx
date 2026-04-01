'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography, Spin } from 'antd';
import {
  DashboardOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SendOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;

interface FuelPrice {
  index: number;
  name: string;
  price: string;
  change: string;
}

/**
 * AI SDK v6 tool part:
 * - type: `tool-${toolName}` (e.g., 'tool-get_fuel_prices')
 * - state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error'
 * - input: tool args
 * - output: tool result
 */
interface ToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: Record<string, unknown>;
  output?: unknown;
  errorText?: string;
}

interface TextPart {
  type: 'text';
  text: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessagePart = any;

interface UIMessageRaw {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
}

interface FuelChatWindowProps {
  messages: UIMessageRaw[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

/* ─── helpers ─── */
function isToolPart(part: MessagePart): part is ToolPart {
  return typeof part?.type === 'string' && part.type.startsWith('tool-');
}

function getToolName(part: ToolPart): string {
  // type = 'tool-get_fuel_prices' → 'get_fuel_prices'
  return part.type.replace(/^tool-/, '');
}

function isToolRunning(state: string): boolean {
  return state === 'input-streaming' || state === 'input-available';
}

function isToolDone(state: string): boolean {
  return state === 'output-available';
}

function isToolError(state: string): boolean {
  return state === 'output-error';
}

/* ─── Tool label mapping ─── */
const TOOL_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  get_fuel_prices: {
    label: '🔍 Tra cứu giá xăng từ PVOIL',
    icon: <DashboardOutlined />,
    color: '#3B5BFE',
  },
  send_discord_report: {
    label: '📢 Gửi báo cáo lên Discord',
    icon: <SendOutlined />,
    color: '#7289DA',
  },
};

/* ─────────────────────────── TOOL CALL CARD ─────────────────────────── */
function ToolCallCard({ part }: { part: ToolPart }) {
  const toolName = getToolName(part);
  const meta = TOOL_LABELS[toolName] ?? {
    label: toolName,
    icon: <ThunderboltOutlined />,
    color: '#8B5CF6',
  };

  const running = isToolRunning(part.state);
  const done = isToolDone(part.state);
  const errored = isToolError(part.state);
  const output = part.output as Record<string, unknown> | undefined;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        border: `1px solid ${errored ? '#FCA5A5' : 'rgba(59, 91, 254, 0.15)'}`,
        borderRadius: 16,
        padding: '14px 18px',
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: (done && output) || errored ? 10 : 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: errored ? '#FEF2F2' : `${meta.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: errored ? '#EF4444' : meta.color,
            fontSize: 14,
          }}
        >
          {running ? <LoadingOutlined spin /> : errored ? <WarningOutlined /> : <CheckCircleOutlined />}
        </div>
        <div style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
            {meta.label}
          </Text>
          <br />
          <Text style={{ fontSize: 11, color: '#94A3B8' }}>
            {running ? 'Đang xử lý...' : errored ? 'Đã xảy ra lỗi' : 'Hoàn thành'}
          </Text>
          <br />
          <Text style={{ fontSize: 11, color: '#232323ff', fontFamily: 'monospace' }}>
            {`tool-${toolName}`}
          </Text>
        </div>
      </div>

      {/* Fuel prices table */}
      {done && output && 'prices' in output && (
        <FuelPriceTable
          prices={(output as { prices: FuelPrice[] }).prices}
          updatedAt={(output as { updatedAt?: string }).updatedAt}
        />
      )}

      {/* Discord send result */}
      {done && output && 'sentContent' in output && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', display: 'block', marginBottom: 6 }}>
            ✅ Đã gửi lên Discord:
          </Text>
          <Text style={{ fontSize: 12, color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {(output as { sentContent: string }).sentContent}
          </Text>
        </div>
      )}

      {/* Error */}
      {errored && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '10px 14px',
          }}
        >
          <Text style={{ fontSize: 12, color: '#DC2626' }}>
            ❌ {part.errorText ?? 'Đã xảy ra lỗi'}
          </Text>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── FUEL PRICE TABLE ─────────────────────────── */
function FuelPriceTable({ prices, updatedAt }: { prices: FuelPrice[]; updatedAt?: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
      }}
    >
      {updatedAt && (
        <div
          style={{
            padding: '8px 14px',
            background: 'linear-gradient(135deg, #3B5BFE 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          ⛽ Cập nhật: {updatedAt}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #E2E8F0' }}>
              Mặt hàng
            </th>
            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #E2E8F0' }}>
              Giá (đ/lít)
            </th>
            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #E2E8F0' }}>
              Tăng/Giảm
            </th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item) => {
            const changeNum = parseInt(item.change.replace(/[^\d-]/g, ''), 10);
            const isDown = changeNum < 0;
            const isUp = changeNum > 0;
            return (
              <tr key={item.index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: '#1E293B' }}>
                  {item.name}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                  {item.price}
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: isDown ? '#16A34A' : isUp ? '#DC2626' : '#64748B',
                  }}
                >
                  {isDown ? '▼' : isUp ? '▲' : ''} {item.change}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────── WELCOME SCREEN ─────────────────────────── */
function FuelWelcomeScreen({ onSend }: { onSend: (message: string) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const suggestions = [
    { text: 'Giá xăng hôm nay bao nhiêu?', emoji: '⛽' },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #FF6B6B 0%, #FF8E53 50%, #FFC928 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 16px 48px rgba(255, 107, 107, 0.3)',
        }}
      >
        <span style={{ fontSize: 40 }}>⛽</span>
      </div>

      <Title
        level={3}
        style={{
          marginBottom: 8,
          fontWeight: 800,
          color: 'var(--text-primary)',
        }}
      >
        Cô Kiều — Chuyên gia giá xăng 🔥
      </Title>
      <Text
        style={{
          color: 'var(--text-secondary)',
          fontSize: 15,
          marginBottom: 36,
          textAlign: 'center',
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        Hỏi cô về giá xăng, cô sẽ tra cứu và có thể gửi báo cáo lên Discord cho cả lớp! 📢
      </Text>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {suggestions.map((s, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => onSend(s.text)}
            onKeyDown={(e) => e.key === 'Enter' && onSend(s.text)}
            style={{
              padding: '12px 20px',
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 16,
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 500,
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
            }}
          >
            {s.emoji} {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── MESSAGE BUBBLE ─────────────────────────── */
function FuelMessageBubble({ message }: { message: UIMessageRaw }) {
  const isUser = message.role === 'user';

  const textParts = message.parts
    .filter((p: MessagePart) => p.type === 'text')
    .map((p: TextPart) => p.text)
    .join('');

  const toolParts = message.parts.filter(isToolPart);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '0 24px',
        marginBottom: 20,
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Tool call cards */}
      {toolParts.length > 0 && (
        <div style={{ width: '100%', maxWidth: 500, marginBottom: 4 }}>
          {toolParts.map((tp, i) => (
            <ToolCallCard key={tp.toolCallId ?? i} part={tp} />
          ))}
        </div>
      )}

      {/* Text content with markdown */}
      {textParts.length > 0 && (
        <div
          style={{
            maxWidth: isUser ? '70%' : '85%',
            padding: '14px 18px',
            borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
            background: isUser
              ? 'linear-gradient(135deg, #3B5BFE 0%, #6B8AFF 100%)'
              : '#FFFFFF',
            color: isUser ? '#FFFFFF' : 'var(--text-primary)',
            border: isUser ? 'none' : '1px solid var(--border)',
            boxShadow: isUser
              ? '0 4px 14px rgba(59, 91, 254, 0.25)'
              : 'var(--shadow-sm)',
            fontSize: 14,
            lineHeight: 1.7,
            wordBreak: 'break-word',
          }}
          className="fuel-chat-markdown"
        >
          {isUser ? textParts : <ReactMarkdown>{textParts}</ReactMarkdown>}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── MAIN CHAT WINDOW ─────────────────────────── */
export default function FuelChatWindow({ messages, isLoading, onSend }: FuelChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <FuelWelcomeScreen onSend={onSend} />;
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '28px 0',
        maxWidth: 800,
        margin: '0 auto',
        width: '100%',
        minHeight: 0,
      }}
    >
      <style>{`
        .fuel-chat-markdown p { margin: 0 0 8px 0; }
        .fuel-chat-markdown p:last-child { margin: 0; }
        .fuel-chat-markdown ul, .fuel-chat-markdown ol { margin: 4px 0; padding-left: 20px; }
        .fuel-chat-markdown li { margin: 2px 0; }
        .fuel-chat-markdown strong { font-weight: 700; }
        .fuel-chat-markdown em { font-style: italic; }
      `}</style>
      {messages.map((msg) => (
        <FuelMessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '0 24px',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: '#FFF',
              border: '1px solid var(--border)',
              borderRadius: '20px 20px 20px 6px',
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Spin size="small" />
            <Text style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
              Cô Kiều đang tra cứu... ⛽
            </Text>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
