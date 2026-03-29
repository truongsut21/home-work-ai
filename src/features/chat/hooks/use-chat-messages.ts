'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useCallback, useRef } from 'react';

interface UseChatMessagesOptions {
  conversationId: string | null;
  onConversationCreated: (id: string, title?: string) => void;
}

export function useChatMessages({ conversationId, onConversationCreated }: UseChatMessagesOptions) {
  const conversationIdRef = useRef(conversationId);
  const isCreatingChatRef = useRef(false);
  const creationPromiseRef = useRef<Promise<string> | null>(null);

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
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      if (isCreatingChatRef.current) {
        // Just created this chat via input, skip fetching from DB
        // to avoid overwriting currently streaming messages
        isCreatingChatRef.current = false;
        return;
      }
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
        if (creationPromiseRef.current) {
          // Tránh gọi song song (Race condition) nếu đang tạo phòng chat
          convId = await creationPromiseRef.current;
        } else {
          try {
            isCreatingChatRef.current = true;
            creationPromiseRef.current = fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
              }),
            })
              .then((res) => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
              })
              .then((conv) => {
                const newId = conv.id;
                conversationIdRef.current = newId;
                onConversationCreated(newId, conv.title || content.substring(0, 50));
                return newId;
              });

            convId = await creationPromiseRef.current;
          } catch (error) {
            console.error('Failed to create conversation:', error);
            isCreatingChatRef.current = false;
            return;
          } finally {
            creationPromiseRef.current = null;
          }
        }
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
