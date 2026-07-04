import { NextResponse } from 'next/server';
import { deleteFile, isDriveConnected } from '@/lib/google-drive';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json(
        { error: 'Google Drive is not connected. Go to Admin > Settings to connect first.' },
        { status: 400 }
      );
    }

    const { id } = await params;

    // Delete directly from Google Drive
    await deleteFile(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete photo';
    console.error('Error deleting photo:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
