import { NextRequest, NextResponse } from 'next/server';
import { deleteConversation } from '@/features/chat/services/save-message';
import { verifyApiAuth } from '@/lib/auth-server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authPayload = verifyApiAuth(_req);
  if (!authPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
