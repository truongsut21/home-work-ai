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
import remarkGfm from 'remark-gfm';

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

/* ─── Collapsible JSON viewer ─── */
function JsonCollapsible({ label, data, borderColor }: { label: string; data: unknown; borderColor: string }) {
  const [open, setOpen] = useState(false);

  if (data == null) return null;

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: 8,
          background: `${borderColor}08`,
          border: `1px solid ${borderColor}30`,
          userSelect: 'none',
          transition: 'background 0.15s ease',
        }}
      >
        <span style={{ fontSize: 10, color: borderColor, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          ▶
        </span>
        <Text style={{ fontSize: 11.5, fontWeight: 600, color: borderColor }}>
          {label}
        </Text>
      </div>
      {open && (
        <pre
          style={{
            margin: '6px 0 0 0',
            padding: '10px 12px',
            background: '#1E293B',
            color: '#E2E8F0',
            borderRadius: 10,
            fontSize: 11,
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: 240,
            overflowY: 'auto',
            border: `1px solid ${borderColor}25`,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
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

      {/* Input & Output collapsible */}
      <JsonCollapsible label="📥 Input (tham số đầu vào)" data={part.input} borderColor="#3B5BFE" />
      <JsonCollapsible
        label={errored ? '❌ Output (lỗi)' : '📤 Output (kết quả)'}
        data={errored ? (part.errorText ?? part.output) : part.output}
        borderColor={errored ? '#EF4444' : '#16A34A'}
      />

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
          {isUser ? textParts : <ReactMarkdown remarkPlugins={[remarkGfm]}>{textParts}</ReactMarkdown>}
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
        .fuel-chat-markdown table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 13px; }
        .fuel-chat-markdown thead th {
          background: linear-gradient(135deg, #3B5BFE 0%, #7C3AED 100%);
          color: #fff; padding: 8px 12px; text-align: left; font-weight: 600; font-size: 12px;
        }
        .fuel-chat-markdown thead th:not(:first-child) { text-align: right; }
        .fuel-chat-markdown tbody td { padding: 8px 12px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
        .fuel-chat-markdown tbody td:not(:first-child) { text-align: right; font-weight: 600; }
        .fuel-chat-markdown tbody tr:hover { background: #F8FAFC; }
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
