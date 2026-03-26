import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { chatModel } from '@/lib/ai';
import { SYSTEM_PROMPT, MAX_CONTEXT_MESSAGES } from '@/features/chat/constants/system-prompt';

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: UIMessage[] };

  // Keep only the last N messages for context window
  const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  // Convert UI messages to model messages for streamText
  const modelMessages = await convertToModelMessages(contextMessages);

  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
