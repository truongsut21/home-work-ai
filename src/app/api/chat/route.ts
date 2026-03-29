import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { chatModel } from '@/lib/ai';
import { SYSTEM_PROMPT, MAX_CONTEXT_MESSAGES } from '@/features/chat/constants/system-prompt';
import { saveMessage } from '@/features/chat/services/save-message';

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json() as { messages: UIMessage[], conversationId: string };

  // Save the incoming user message to the database
  const lastMessage = messages[messages.length - 1];
  if (conversationId && lastMessage && lastMessage.role === 'user') {
    const rawMsg = lastMessage as any;
    const textContent = Array.isArray(rawMsg.parts)
      ? rawMsg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      : typeof rawMsg.content === 'string'
        ? rawMsg.content
        : '';

    if (textContent) {
      await saveMessage(conversationId, 'user', textContent).catch((err) =>
        console.error('Failed to save user message:', err)
      );
    }
  }

  // Keep only the last N messages for context window
  const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  // Convert UI messages to model messages for streamText
  const modelMessages = await convertToModelMessages(contextMessages);

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    onFinish: async ({ text }) => {
      // Save assistant message to DB after it has finished streaming
      if (conversationId && text) {
        await saveMessage(conversationId, 'assistant', text).catch((err) =>
          console.error('Failed to save assistant message:', err)
        );
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
