'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useCallback, useRef } from 'react';
import { MAX_CONTEXT_MESSAGES } from '../constants/system-prompt';

interface UseChatMessagesOptions {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export function useChatMessages({ conversationId, onConversationCreated }: UseChatMessagesOptions) {
  const conversationIdRef = useRef(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const {
    messages,
    status,
    setMessages,
    sendMessage: chatSendMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: () => ({
        conversationId: conversationIdRef.current,
      }),
    }),
    onFinish: async ({ message }) => {
      // Save assistant message to DB
      const convId = conversationIdRef.current;
      if (convId) {
        // Extract text from message parts
        const textContent = message.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map((p) => p.text)
          .join('') || '';

        if (textContent) {
          try {
            await fetch('/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId: convId,
                role: 'assistant',
                content: textContent,
              }),
            });
          } catch (error) {
            console.error('Failed to save assistant message:', error);
          }
        }
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((msg: { id: string; role: string; content: string }) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            parts: [{ type: 'text' as const, text: msg.content }],
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      let convId = conversationIdRef.current;

      // Create conversation if needed
      if (!convId) {
        try {
          const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            }),
          });
          if (res.ok) {
            const conv = await res.json();
            convId = conv.id;
            conversationIdRef.current = convId;
            onConversationCreated(conv.id);
          }
        } catch (error) {
          console.error('Failed to create conversation:', error);
          return;
        }
      }

      // Save user message to DB
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: convId,
            role: 'user',
            content,
          }),
        });
      } catch (error) {
        console.error('Failed to save user message:', error);
      }

      // Send to AI
      chatSendMessage({ text: content });
    },
    [chatSendMessage, onConversationCreated]
  );

  // Extract text content from UIMessage parts
  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content:
      msg.parts
        ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('') || '',
  }));

  return {
    messages: formattedMessages,
    isLoading,
    sendMessage,
  };
}
