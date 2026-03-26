import { NextRequest, NextResponse } from 'next/server';
import { getConversations } from '@/features/chat/services/get-messages';
import { createConversation } from '@/features/chat/services/save-message';

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Failed to get conversations:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    const conversation = await createConversation(title);
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Failed to create conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
