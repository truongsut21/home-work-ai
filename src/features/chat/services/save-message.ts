import { prisma } from '@/lib/prisma';

export async function saveMessage(
  conversationId: string,
  role: string,
  content: string,
) {
  return prisma.message.create({
    data: {
      role,
      content,
      conversationId,
    },
  });
}

export async function createConversation(title?: string) {
  return prisma.conversation.create({
    data: {
      title: title || 'New Chat',
    },
  });
}

export async function updateConversationTitle(id: string, title: string) {
  return prisma.conversation.update({
    where: { id },
    data: { title },
  });
}

export async function deleteConversation(id: string) {
  return prisma.conversation.delete({
    where: { id },
  });
}
