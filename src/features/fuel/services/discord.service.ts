import { fuelConfig } from '../config';
import { logger } from '@/lib/logger';

const log = logger.child({ service: 'discord' });

export interface DiscordSendResult {
  success: boolean;
  message: string;
  sentContent: string;
}

/**
 * Gửi tin nhắn tới Discord webhook.
 */
export async function sendDiscordMessage(
  content: string,
): Promise<DiscordSendResult> {
  if (!content || content.trim().length === 0) {
    throw new Error('Nội dung tin nhắn Discord không được để trống');
  }

  const webhookUrl = fuelConfig.DISCORD_HOOKS;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown');
      throw new Error(
        `Discord webhook trả về status ${response.status}: ${errorText}`,
      );
    }

    log.info('Discord message sent successfully', {
      contentLength: content.length,
    });

    return {
      success: true,
      message: 'Đã gửi tin nhắn lên Discord thành công!',
      sentContent: content,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    log.error('Failed to send Discord message', { error: message });
    throw new Error(`Không thể gửi tin nhắn Discord: ${message}`);
  }
}
