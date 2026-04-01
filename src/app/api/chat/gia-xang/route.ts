import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { z } from 'zod';
import { zodSchema } from 'ai';
import { chatModel } from '@/lib/ai';
import { verifyApiAuth } from '@/lib/auth-server';
import { FUEL_SYSTEM_PROMPT } from '@/features/fuel/constants/system-prompt';
import { getFuelPrices } from '@/features/fuel/services/fuel-price.service';
import { sendDiscordMessage } from '@/features/fuel/services/discord.service';
import { logger } from '@/lib/logger';

const log = logger.child({ route: 'chat/gia-xang' });

export async function POST(req: Request) {
  const authPayload = verifyApiAuth(req);
  if (!authPayload) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { messages } = (await req.json()) as { messages: UIMessage[] };

  const contextMessages = messages.slice(-20);
  const modelMessages = await convertToModelMessages(contextMessages);

  const result = streamText({
    model: chatModel,
    system: FUEL_SYSTEM_PROMPT,
    messages: modelMessages,
    tools: {
      get_fuel_prices: {
        description:
          'Tra cứu bảng giá xăng dầu mới nhất từ PVOIL. Gọi tool này khi user hỏi về giá xăng, giá dầu, giá nhiên liệu.',
        inputSchema: zodSchema(z.object({})),
        execute: async () => {
          log.info('Tool get_fuel_prices called');
          const data = await getFuelPrices();
          return data;
        },
      },
      send_discord_report: {
        description:
          'Gửi báo cáo giá xăng lên kênh Discord. Chỉ gọi khi user đồng ý gửi.',
        inputSchema: zodSchema(
          z.object({
            content: z
              .string()
              .describe(
                'Nội dung tin nhắn Discord — được soạn theo phong cách hài hước của Cô Kiều, có emoji và bảng giá',
              ),
          }),
        ),
        execute: async ({ content }: { content: string }) => {
          log.info('Tool send_discord_report called', {
            contentLength: content.length,
          });
          const data = await sendDiscordMessage(content);
          return data;
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
