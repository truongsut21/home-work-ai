import { prisma } from '@/lib/prisma';

export async function getMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}
