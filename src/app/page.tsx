'use client';

import MainLayout from '@/components/layout/main-layout';
import ChatWindow from '@/features/chat/components/chat-window';
import ChatInput from '@/features/chat/components/chat-input';
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages';

function ChatPage({
  activeConversationId,
  onConversationCreated,
}: {
  activeConversationId: string | null;
  onConversationCreated: (id: string) => void;
}) {
  const { messages, isLoading, sendMessage } = useChatMessages({
    conversationId: activeConversationId,
    onConversationCreated,
  });

  return (
    <>
      <ChatWindow
        messages={messages.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))}
        isLoading={isLoading}
      />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </>
  );
}

export default function Home() {
  return (
    <MainLayout>
      {({ activeConversationId, onConversationCreated }) => (
        <ChatPage
          activeConversationId={activeConversationId}
          onConversationCreated={onConversationCreated}
        />
      )}
    </MainLayout>
  );
}
