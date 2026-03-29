'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography, Spin } from 'antd';
import {
  RobotOutlined,
  SmileOutlined,
  BookOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  AppstoreOutlined,
  EditOutlined,
  ArrowRightOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import MessageBubble from './message-bubble';

const { Title, Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

function WelcomeScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Feature cards for English learning
  const assistantCards = [
    {
      name: 'Ms. Quynh',
      tag: 'English Teacher',
      tagColor: '#3B5BFE',
      tagBg: '#EEF1FF',
      desc: 'Giúp bạn luyện tiếng Anh qua hội thoại, sửa lỗi ngữ pháp và mở rộng vốn từ vựng một cách vui vẻ.',
      bgGradient: 'linear-gradient(145deg, #1A1D2E 0%, #2D3148 100%)',
      textColor: '#FFFFFF',
    },
    {
      items: [
        { icon: <BookOutlined style={{ color: '#3B5BFE' }} />, text: 'Luyện hội thoại tiếng Anh' },
        { icon: <ExperimentOutlined style={{ color: '#8B5CF6' }} />, text: 'Kiểm tra ngữ pháp' },
        { icon: <EditOutlined style={{ color: '#10B981' }} />, text: 'Dịch và giải thích câu' },
      ],
      footer: 'Bài tập',
      footerLink: 'Xem thêm',
    },
    {
      question: 'Hãy giải thích sự khác nhau giữa "present perfect" và "past simple" cho mình nhé?',
      label: 'Gợi ý câu hỏi',
      icon: <BulbOutlined style={{ color: '#F59E0B' }} />,
    },
  ];

  // Quick action pills
  const quickActions = [
    { icon: <CalendarOutlined style={{ color: '#EF4444' }} />, label: 'Luyện phát âm', color: '#FEF2F2' },
    { icon: <ExperimentOutlined style={{ color: '#10B981' }} />, label: 'Học từ vựng', color: '#ECFDF5' },
    { icon: <AppstoreOutlined style={{ color: '#8B5CF6' }} />, label: 'Ngữ pháp', color: '#F3EEFF' },
    { icon: <EditOutlined style={{ color: '#F59E0B' }} />, label: 'Viết luận', color: '#FFFBEB' },
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circles */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 91, 254, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: mounted ? 'breathe 4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Floating Avatar Orb */}
      <div
        className="bounce-in"
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #6B8AFF 0%, #3B5BFE 50%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 16px 48px rgba(59, 91, 254, 0.3), 0 0 0 8px rgba(59, 91, 254, 0.06)',
          animation: mounted ? 'float 4s ease-in-out infinite, bounceIn 0.7s ease-out' : 'none',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: 40, lineHeight: 1 }}>👩‍💻</span>
        {/* Pulse ring */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid rgba(59, 91, 254, 0.3)',
            animation: 'pulseRing 2.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Greeting */}
      <Title
        level={2}
        className="fade-in-up fade-in-up-delay-1"
        style={{
          marginBottom: 8,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: '-0.5px',
          color: 'var(--text-primary)',
        }}
      >
        Chào bạn! 👋
      </Title>
      <Text
        className="fade-in-up fade-in-up-delay-2"
        style={{
          color: 'var(--text-secondary)',
          fontSize: 16,
          marginBottom: 44,
          textAlign: 'center',
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        Cùng Ms. Quynh luyện tiếng Anh mỗi ngày nhé!
      </Text>

      {/* Feature Cards Row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 36,
          maxWidth: 860,
        }}
      >
        {/* Card 1 - Dark assistant card */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{
            background: assistantCards[0].bgGradient,
            borderRadius: 18,
            padding: '24px 22px',
            width: 240,
            cursor: 'default',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 20px rgba(26, 29, 46, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(26, 29, 46, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 29, 46, 0.15)';
          }}
        >
          {/* Decorative gradient blob inside */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(59, 91, 254, 0.15)',
              filter: 'blur(20px)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SmileOutlined style={{ color: '#FFFFFF', fontSize: 16 }} />
            </div>
            <Text style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
              {assistantCards[0].name as string}
            </Text>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: assistantCards[0].tagColor as string,
                background: assistantCards[0].tagBg as string,
                padding: '3px 10px',
                borderRadius: 20,
                marginLeft: 'auto',
              }}
            >
              {assistantCards[0].tag as string}
            </span>
          </div>
          <Text
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13,
              lineHeight: 1.6,
              display: 'block',
              position: 'relative',
            }}
          >
            {assistantCards[0].desc as string}
          </Text>
        </div>

        {/* Card 2 - Tasks list */}
        <div
          className="fade-in-up fade-in-up-delay-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '22px 20px',
            width: 240,
            cursor: 'default',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(59, 91, 254, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          {(assistantCards[1] as { items: { icon: React.ReactNode; text: string }[], footer: string, footerLink: string }).items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <Text style={{ color: 'var(--text-primary)', fontSize: 13, flex: 1 }}>
                {item.text}
              </Text>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              paddingTop: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              {(assistantCards[1] as { footer: string }).footer}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {(assistantCards[1] as { footerLink: string }).footerLink} <ArrowRightOutlined style={{ fontSize: 10 }} />
            </Text>
          </div>
        </div>

        {/* Card 3 - Suggested prompt */}
        <div
          className="fade-in-up fade-in-up-delay-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '22px 20px',
            width: 240,
            cursor: 'pointer',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = '#F59E0B';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(245, 158, 11, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          {/* Three dots menu */}
          <div style={{ position: 'absolute', top: 14, right: 14, color: 'var(--text-muted)', fontSize: 16 }}>
            •••
          </div>
          <Text
            style={{
              color: 'var(--text-primary)',
              fontSize: 14,
              lineHeight: 1.65,
              fontWeight: 500,
              paddingRight: 24,
            }}
          >
            {(assistantCards[2] as { question: string }).question}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              fontWeight: 500,
              marginTop: 16,
            }}
          >
            {(assistantCards[2] as { label: string }).label}
          </Text>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div
        className="fade-in-up fade-in-up-delay-6"
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="action-pill"
            style={{
              animationDelay: `${0.6 + i * 0.08}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span
              className="pill-icon"
              style={{
                background: action.color,
                width: 24,
                height: 24,
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '28px 0',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        minHeight: 0,
      }}
    >
      {messages.map((msg, index) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} index={index} />
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '0 24px',
            marginBottom: 20,
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #6B8AFF, #3B5BFE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(59, 91, 254, 0.25)',
              animation: 'breathe 2s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>👩‍💻</span>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '20px 20px 20px 6px',
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: 'var(--shadow-sm)',
              animation: 'borderGlow 2s ease-in-out infinite',
            }}
          >
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
            <Text style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
              Ms. Quynh đang suy nghĩ...
            </Text>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
