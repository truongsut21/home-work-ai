import { NextRequest, NextResponse } from 'next/server';
import { deleteConversation } from '@/features/chat/services/save-message';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
