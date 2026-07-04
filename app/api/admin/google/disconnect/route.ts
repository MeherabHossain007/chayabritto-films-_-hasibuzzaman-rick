import { NextResponse } from 'next/server';
import { disconnectDrive } from '@/lib/google-drive';

/**
 * POST /api/admin/google/disconnect
 * Disconnect Google Drive by removing stored tokens.
 */
export async function POST() {
  try {
    disconnectDrive();
    return NextResponse.json({ success: true, message: 'Google Drive disconnected.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
