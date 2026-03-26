import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/features/chat/services/get-messages';
import { saveMessage } from '@/features/chat/services/save-message';

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get('conversationId');
  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
  }

  try {
    const messages = await getMessages(conversationId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to get messages:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { conversationId, role, content } = await req.json();
    if (!conversationId || !role || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const message = await saveMessage(conversationId, role, content);
    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to save message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
